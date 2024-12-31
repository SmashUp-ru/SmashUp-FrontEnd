import { usePlayerStore } from '@/store/player.ts';
import { shuffleQueue } from '@/lib/utils.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';

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

    const updateInfo = usePlayerStore((state) => state.updateInfo);
    const updateMashupInfo = usePlayerStore((state) => state.updateMashupInfo);

    function play() {
        updatePlaying(true);
    }

    function pause() {
        updatePlaying(false);
    }

    function next() {
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
    }

    function prev() {
        const currentLoop = usePlayerStore.getState().loop;

        console.log(seek);
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
    }

    function playQueue(
        newQueue: number[],
        newQueueName: string,
        newQueueId: string,
        newQueueIndex: number = 0
    ) {
        if (newQueue.length === 0) return;

        if (newQueueId === queueId) {
            play();
        } else {
            updateModerationSrc(null);
            updateModerationIsPlaying(false);

            updateSeek(0);
            updateChangedSeek(0);

            updateOriginalQueue(newQueue);

            if (shuffle) {
                [newQueue] = shuffleQueue(newQueue, newQueueIndex);
            }

            updateQueueId(newQueueId);
            updateQueue([...newQueue]);
            updateQueueIndex(newQueueIndex);
            updateQueueName(newQueueName);
            play();
        }
    }

    function playMashup(
        newQueue: number[],
        newQueueName: string,
        newQueueId: string,
        newQueueIndex: number
    ) {
        if (newQueueId === queueId && queueIndex === newQueueIndex) {
            play();
        } else {
            updateModerationSrc(null);
            updateModerationIsPlaying(false);

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
    }

    function playModerationMashup(mashup: UnpublishedMashup) {
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
    }

    function openMashupInfo(mashupId: number) {
        updateInfo(false);
        updateMashupInfo(mashupId);
    }

    function openInfo() {
        updateInfo(true);
        updateMashupInfo(null);
    }

    function closeInfo() {
        updateInfo(false);
        updateMashupInfo(null);
    }

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
        playModerationMashup
    };
}
