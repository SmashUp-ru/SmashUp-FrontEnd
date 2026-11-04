import { createElement, useRef } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { useLikePop } from '@/router/shared/hooks/useLikePop.ts';

type LikeKind = 'mashup' | 'playlist';

const NOUN: Record<LikeKind, string> = { mashup: 'мешапы', playlist: 'плейлисты' };

/**
 * Единая логика лайка мешапа/плейлиста для всех кнопок.
 * - `isLiked` читается из стора сущностей (проп может быть устаревшим снимком);
 * - гость получает тост «Войди…» вместо запроса, который сервер отклонит с 401;
 * - повторный клик, пока запрос в пути, игнорируется;
 * - лайк применяется сразу (оптимистично), при ошибке сервера откатывается + тост.
 */
export function useLike(kind: LikeKind, entity: { id: number; liked: boolean } | null | undefined) {
    const currentUser = useGlobalStore((state) => state.currentUser);
    const { toast } = useToast();
    const inFlight = useRef(false);

    const mashupLiked = useMashupStore((s) =>
        kind === 'mashup' && entity ? s.cache[entity.id]?.liked : undefined
    );
    const playlistLiked = usePlaylistStore((s) =>
        kind === 'playlist' && entity ? s.cache[entity.id]?.liked : undefined
    );
    const isLiked = (kind === 'mashup' ? mashupLiked : playlistLiked) ?? entity?.liked ?? false;
    const pop = useLikePop(isLiked);

    const toggle = () => {
        if (!entity || inFlight.current) return;
        if (!currentUser) {
            toast({
                element: createElement(ErrorToast, {
                    icon: true,
                    before: 'Войди,',
                    field: 'чтобы лайкать',
                    after: `${NOUN[kind]}.`
                }),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        const liked = !isLiked;
        const store = kind === 'mashup' ? useMashupStore : usePlaylistStore;
        // Сущности может не быть в кэше (проп-снимок) — тогда кладём её целиком,
        // иначе в кэше окажется огрызок `{ liked }` без остальных полей.
        const setLiked = (value: boolean) =>
            store
                .getState()
                .updateOneById(
                    entity.id,
                    store.getState().cache[entity.id]
                        ? { liked: value }
                        : { ...entity, liked: value }
                );

        // Оптимистично: сердце и анимация — сразу, при ошибке сервера откатываем.
        setLiked(liked);
        inFlight.current = true;
        axiosSession
            .post(`${kind}/${liked ? 'add_like' : 'remove_like'}?id=${entity.id}`)
            .catch((e) => {
                setLiked(!liked);
                return axiosCatcher(toast, liked ? 'при лайке' : 'при снятии лайка')(e);
            })
            .catch(() => {}) // axiosCatcher пробрасывает ошибку дальше — тост уже показан
            .finally(() => {
                inFlight.current = false;
            });
    };

    return { isLiked, pop, toggle };
}
