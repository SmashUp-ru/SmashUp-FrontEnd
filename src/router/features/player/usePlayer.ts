import { usePlayerStore } from '@/store/player.ts';
import { shuffleQueue } from '@/lib/utils.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from '@/store/entities/vkMashup';
import { useCallback } from 'react';

export function usePlayer() {
    const updatePlaying = usePlayerStore((state) => state.updatePlaying);
    const queue = usePlayerStore((state) => state.queue);
    const updateQueue = usePlayerStore((state) => state.updateQueue);
    const updateOriginalQueue = usePlayerStore((state) => state.updateOriginalQueue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const updateQueueName = usePlayerStore((state) => state.updateQueueName);
    const queueId = usePlayerStore((state) => state.queueId);
    const updateQueueId = usePlayerStore((state) => state.updateQueueId);
    const shuffle = usePlayerStore((state) => state.shuffle);
    const seek = usePlayerStore((state) => state.seek);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);
    const updateModerationSrc = usePlayerStore((state) => state.updateModerationSrc);
    const updateModerationIsPlaying = usePlayerStore((state) => state.updateModerationIsPlaying);
    const updateVkMashupSrc = usePlayerStore((state) => state.updateVkMashupSrc);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const updateInfo = usePlayerStore((state) => state.updateInfo);
    const updateMashupInfo = usePlayerStore((state) => state.updateMashupInfo);

    const play = useCallback(() => {
        updatePlaying(true);
    }, [updatePlaying]);

    const pause = useCallback(() => {
        updatePlaying(false);
    }, [updatePlaying]);

    const next = useCallback(() => {
        const currentLoop = usePlayerStore.getState().loop;
        updateSeek(0);
        updateChangedSeek(0);

        if (currentLoop === 'mashup') {
            play();
        } else if (queueIndex < queue.length - 1) {
            updateQueueIndex(queueIndex + 1);
        } else if (currentLoop === 'queue') {
            updateQueueIndex(0);
            play();
        } else if (currentLoop === 'none') {
            pause();
        }
    }, [pause, play, queue.length, queueIndex, updateChangedSeek, updateQueueIndex, updateSeek]);

    const prev = useCallback(() => {
        const currentLoop = usePlayerStore.getState().loop;

        if (seek > 1000 * 5) {
            pause();
            updateSeek(0);
            updateChangedSeek(0);
        } else {
            if (queueIndex > 0) {
                updateQueueIndex(queueIndex - 1);
            } else if (currentLoop === 'mashup') {
                play();
            } else {
                pause();
            }
        }
    }, [pause, play, queueIndex, seek, updateChangedSeek, updateQueueIndex, updateSeek]);

    const playQueue = useCallback(
        (
            newQueue: number[],
            newQueueName: string,
            newQueueId: string,
            newQueueIndex: number = 0
        ) => {
            if (newQueue.length === 0) return;

            if (newQueueId === queueId) {
                play();
            } else {
                updateModerationSrc(null);
                updateModerationIsPlaying(false);

                updateVkMashupSrc(null);
                updateVkMashupIsPlaying(false);

                updateSeek(0);
                updateChangedSeek(0);

                updateOriginalQueue(newQueue);

                let shuffledQueue = newQueue;
                if (shuffle) {
                    [shuffledQueue] = shuffleQueue(newQueue, newQueueIndex);
                }

                updateQueueId(newQueueId);
                updateQueue([...shuffledQueue]);
                updateQueueIndex(newQueueIndex);
                updateQueueName(newQueueName);
                play();
            }
        },
        [
            play,
            queueId,
            shuffle,
            updateChangedSeek,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    const playMashup = useCallback(
        (newQueue: number[], newQueueName: string, newQueueId: string, newQueueIndex: number) => {
            if (newQueueId === queueId && queueIndex === newQueueIndex) {
                play();
            } else {
                updateModerationSrc(null);
                updateModerationIsPlaying(false);

                updateVkMashupSrc(null);
                updateVkMashupIsPlaying(false);

                updateSeek(0);
                updateChangedSeek(0);

                updateOriginalQueue(newQueue);

                if (shuffle) {
                    [newQueue, newQueueIndex] = shuffleQueue(newQueue, newQueueIndex);
                }

                updateQueueId(newQueueId);

                updateQueue([...newQueue]);
                updateQueueIndex(newQueueIndex);
                updateQueueName(newQueueName);
                play();
            }
        },
        [
            play,
            queueId,
            queueIndex,
            shuffle,
            updateChangedSeek,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    const playModerationMashup = useCallback(
        (mashup: UnpublishedMashup) => {
            updateOriginalQueue([]);
            updateQueueId('');
            updateQueue([]);
            updateQueueIndex(-1);
            updateQueueName('');
            updateSeek(0);
            updateChangedSeek(0);
            updateInfo(false);
            updateMashupInfo(null);

            updateModerationSrc(mashup);
            updateModerationIsPlaying(true);

            updateVkMashupSrc(null);
            updateVkMashupIsPlaying(false);
        },
        [
            updateChangedSeek,
            updateInfo,
            updateMashupInfo,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    const playVkMashup = useCallback(
        (mashup: VkMashup) => {
            updateOriginalQueue([]);
            updateQueueId('');
            updateQueue([]);
            updateQueueIndex(-1);
            updateQueueName('');
            updateSeek(0);
            updateChangedSeek(0);
            updateInfo(false);
            updateMashupInfo(null);

            updateModerationSrc(null);
            updateModerationIsPlaying(false);

            updateVkMashupSrc(mashup);
            updateVkMashupIsPlaying(true);
        },
        [
            updateChangedSeek,
            updateInfo,
            updateMashupInfo,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    const openMashupInfo = useCallback(
        (mashupId: number) => {
            updateInfo(false);
            updateMashupInfo(mashupId);
        },
        [updateInfo, updateMashupInfo]
    );

    const openInfo = useCallback(() => {
        updateInfo(true);
        updateMashupInfo(null);
    }, [updateInfo, updateMashupInfo]);

    const closeInfo = useCallback(() => {
        updateInfo(false);
        updateMashupInfo(null);
    }, [updateInfo, updateMashupInfo]);

    return {
        play,
        pause,
        next,
        prev,
        playQueue,
        playMashup,
        openMashupInfo,
        openInfo,
        closeInfo,
        playModerationMashup,
        playVkMashup
    };
}
