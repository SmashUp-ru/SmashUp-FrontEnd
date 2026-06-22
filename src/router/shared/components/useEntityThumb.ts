import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';

/**
 * Общая логика «играбельного» thumb'а (плейлист / пользователь).
 *
 * Подгружает мешапы коллекции, фильтрует explicit по настройкам пользователя,
 * отслеживает, играет ли именно ЭТА очередь, и даёт единый toggle play/pause.
 * Заменяет дублированную логику в Playlist/User × Thumb/SmallThumb.
 *
 * @param mashupIds  состав коллекции (`playlist.mashups` / `user.mashups`)
 * @param queueName  человекочитаемое имя очереди
 * @param queueId    идентификатор очереди (`playlist/{id}` / `user/{username}/tracks`)
 */
export function useEntityThumb(mashupIds: number[], queueName: string, queueId: string) {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const currentQueueId = usePlayerStore((state) => state.queueId);
    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);
    const { playQueue, pause } = usePlayer();

    const { mashups, isLoading } = usePlaylistMashups(mashupIds);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    /** Эта очередь сейчас активна (играет или на паузе). */
    const isThisQueue = currentQueueId === queueId;
    /** Эта очередь активна И воспроизводится. */
    const isThisPlaying = isPlaying && isThisQueue;

    const togglePlay = () => {
        if (isThisPlaying) {
            pause();
            return;
        }

        const ids = hideExplicit
            ? mashups.filter((mashup) => !isExplicit(mashup.statuses)).map((mashup) => mashup.id)
            : mashupIds;

        playQueue(ids, queueName, queueId);
    };

    return { isThisQueue, isThisPlaying, togglePlay, isLoading };
}
