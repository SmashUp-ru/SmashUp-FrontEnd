import { useNavigate, useParams } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/components/mashup/MashupForm';
import { useEffect, useMemo, useState } from 'react';
import MashupFormSkeleton from '@/router/shared/components/mashup/MashupFormSkeleton';
import { axiosSession } from '@/lib/utils';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useToast } from '@/router/shared/hooks/use-toast';
import { CachedVkMashup } from '@/store/entities/vkMashup';
import { UploadMashupResponse } from '@/router/shared/types/upload';
import { AxiosResponse } from 'axios';
import { useVkMashups } from './useVkMashups';

export default function UploadVkMashupPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [vkMashup, setVkMashup] = useState<CachedVkMashup>();

    const { vkMashups, updateVkMashups, removeVkMashup } = useVkMashups();

    const vkMashupKey = useMemo(() => {
        const audioId = params.audioId ? parseInt(params.audioId) : NaN;
        const ownerId = params.ownerId ? parseInt(params.ownerId) : NaN;

        if (isNaN(audioId) || isNaN(ownerId)) {
            navigate('/mashup/list/vk');
            return undefined;
        }

        return {
            audioId,
            ownerId
        };
    }, [params]);

    useEffect(() => {
        if (vkMashups !== null && vkMashupKey !== undefined) {
            const mashup = vkMashups.mashups.get(JSON.stringify(vkMashupKey));

            setVkMashup(mashup);
        }
    }, [vkMashups, vkMashupKey]);

    if (vkMashups === null || vkMashupKey === undefined || vkMashup === undefined) {
        return <MashupFormSkeleton />;
    }

    const postUrl = `https://vk.com/wall-${vkMashup.groupId}_${vkMashup.postId}`;

    return (
        <MashupForm
            initial={{
                name: vkMashup.name,
                originalName: `${vkMashup.artist} — ${vkMashup.name}`,
                explicit: false,
                banWords: false,
                statuses: undefined,
                selectedGenres: [],
                selectedTracks: [],
                selectedUsers: [],
                statusLink: postUrl,
                agree: true,
                basedImage: vkMashup.imageUrl || undefined
            }}
            text={{
                title: 'Загрузка мэшапа с VK',
                button: 'Опубликовать',
                toast: {
                    before: 'Ваш',
                    field: 'мэшап',
                    after: 'загружается...'
                }
            }}
            handleLoggedUser={true}
            handleTracksUrls={true}
            handleMashupFile={false}
            requireImageFile={vkMashup.imageUrl === undefined}
            showTracksIcons={true}
            lockStatusLink={true}
            onClick={(body: MashupFormBody) => {
                return axiosSession
                    .post('/mashup/upload/vk', {
                        audioId: vkMashupKey.audioId,
                        ownerId: vkMashupKey.ownerId,
                        ...body,
                        albumId: -1
                    })
                    .then((r: AxiosResponse<UploadMashupResponse>) => {
                        updateVkMashups(removeVkMashup(vkMashups, vkMashup));

                        const newMashup = r.data.response;
                        navigate(
                            `/mashup/upload/success/${newMashup !== undefined ? newMashup.id : '0'}`
                        );
                    })
                    .catch(axiosCatcher(toast, 'при загрузке мэшапа'));
            }}
        />
    );
}
