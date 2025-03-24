import { useEffect, useState } from 'react';
import { axiosSession, removeItem, replaceItem } from '@/lib/utils.ts';
import { useCurrentUserStore } from '@/store/currentUser';
import { CachedVkMashup, VkMashup, VkMashups, VkMashupsResponse } from '@/store/entities/vkMashup';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { AxiosSmashUpError, AxiosSmashUpResponse } from '@/router/shared/types/smashup';
import { useToast } from '@/router/shared/hooks/use-toast';

export function useVkMashups() {
    const vkMashups = useCurrentUserStore((state) => state.vkMashups);
    const updateVkMashups = useCurrentUserStore((state) => state.updateVkMashups);

    const [mashupsLoading, setMashupsLoading] = useState(vkMashups === null);

    const { toast } = useToast();

    useEffect(() => {
        if (vkMashups === null) {
            const emptyVkMashups: VkMashups = {
                total: 0,
                pages: new Map(),
                mashups: new Map()
            };

            loadVkMashups(emptyVkMashups, 0)
                .then(updateVkMashups)
                .catch((e: AxiosSmashUpError) => {
                    axiosCatcher(toast, 'при загрузке мэшапов из VK')(e);
                    updateVkMashups(emptyVkMashups);
                })
                .finally(() => setMashupsLoading(false));
        }
    }, [vkMashups]);

    const removeVkMashup = (vkMashups: VkMashups, vkMashup: CachedVkMashup): VkMashups => {
        vkMashups = copyVkMashups(vkMashups);

        const pages = vkMashups.pages;

        for (const [index, page] of pages.entries()) {
            if (vkMashup.page === index) {
                removeItem(
                    page,
                    vkMashup,
                    (l, r) => l.audioId === r.audioId && r.ownerId === r.ownerId,
                    true
                );
            } else if (vkMashup.page > index) {
                const previousPage = pages.get(index - 1);
                if (previousPage !== undefined) {
                    previousPage.push(page[0]);
                }

                page.splice(0, 1);
            }

            if (vkMashup.page >= index) {
                const nextPage = pages.get(index + 1);
                if (nextPage === undefined) {
                    // Removed, because it must be reloaded
                    pages.delete(index + 1);
                }
            }
        }

        return vkMashups;
    };

    const loadVkMashups = async (vkMashups: VkMashups, page: number): Promise<VkMashups> => {
        return axiosSession
            .get(`/mashup/list/vk?page=${page}`)
            .then((response: AxiosSmashUpResponse<VkMashupsResponse>) => {
                const total = response.data.response.total;
                const mashups = response.data.response.mashups;

                vkMashups = copyVkMashups(vkMashups);

                vkMashups.total = total;
                vkMashups.pages.set(page, mashups);
                for (const mashup of mashups) {
                    vkMashups.mashups.set(
                        JSON.stringify({
                            audioId: mashup.audioId,
                            ownerId: mashup.ownerId
                        }),
                        {
                            ...mashup,
                            page
                        }
                    );
                }

                return vkMashups;
            });
    };

    const copyVkMashups = (vkMashups: VkMashups): VkMashups => {
        const newPages = new Map<number, VkMashup[]>();
        for (const [index, oldPage] of vkMashups.pages.entries()) {
            newPages.set(index, [...oldPage]);
        }
        const newMashups = new Map(vkMashups.mashups);

        return {
            total: vkMashups.total,
            pages: newPages,
            mashups: newMashups
        };
    };

    const updateVkMashup = (vkMashups: VkMashups, vkMashup: VkMashup): VkMashups => {
        const key = JSON.stringify({
            audioId: vkMashup.audioId,
            ownerId: vkMashup.ownerId
        });

        const oldMashup = vkMashups.mashups.get(key);
        if (oldMashup === undefined) {
            return vkMashups;
        }

        vkMashups = copyVkMashups(vkMashups);

        vkMashups.mashups.set(key, {
            ...vkMashup,
            page: oldMashup.page
        });
        const page = vkMashups.pages.get(oldMashup.page);
        if (page !== undefined) {
            replaceItem(
                page,
                vkMashup,
                (i) => i.audioId === vkMashup.audioId && i.ownerId === vkMashup.ownerId
            );
        }

        return vkMashups;
    };

    return {
        isLoading: mashupsLoading,
        setLoading: setMashupsLoading,
        vkMashups,
        updateVkMashups,
        removeVkMashup,
        loadVkMashups,
        copyVkMashups,
        updateVkMashup
    };
}
