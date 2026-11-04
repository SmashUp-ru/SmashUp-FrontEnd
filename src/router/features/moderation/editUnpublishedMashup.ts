import { axiosSession } from '@/lib/utils.ts';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation.ts';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup.ts';

export type UnpublishedMashupPatch = Partial<
    Pick<
        UnpublishedMashup,
        'name' | 'statuses' | 'statusesUrls' | 'genres' | 'tracks' | 'tracksUrls'
    >
> & {
    /** id авторов (в ответе — `authors` именами + `authorsIds`). */
    authors?: number[];
    /** Новая обложка: base64 без префикса `data:…;base64,`. */
    basedImageFile?: string;
};

/**
 * Правка неопубликованного мешапа прямо из списка модерации: шлёт только
 * изменённые поля и кладёт ответ сервера в стор (список перерисуется сам).
 */
export async function editUnpublishedMashup(
    id: number,
    patch: UnpublishedMashupPatch
): Promise<UnpublishedMashup> {
    const r: AxiosSmashUpResponse<UnpublishedMashup> = await axiosSession.post(
        '/moderation/unpublished_mashup/edit',
        { id, ...patch }
    );
    const updated = r.data.response;
    const { unpublishedMashups, updateUnpublishedMashups } = useModerationStore.getState();
    if (unpublishedMashups) {
        updateUnpublishedMashups(
            unpublishedMashups.map((m) => (m.id === updated.id ? updated : m))
        );
    }
    return updated;
}
