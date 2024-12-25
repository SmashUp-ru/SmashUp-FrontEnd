import { usePlayerStore } from '@/store/player.ts';
import { shuffleQueue } from '@/lib/utils.ts';

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

    function play() {
        updatePlaying(true);
    }

    function pause() {
        updatePlaying(false);
    }

    function next() {
        if (queueIndex < queue.length - 1) {
            updateQueueIndex(queueIndex + 1);
        }

        if (queueIndex === queue.length - 1) {
            pause();
        }
    }

    function prev() {
        if (queueIndex > 0) {
            updateQueueIndex(queueIndex - 1);
        }

        if (queueIndex === 0) {
            pause();
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
            updateOriginalQueue(newQueue);

            updateQueueId(newQueueId);

            updateQueue([...newQueue]);
            updateQueueIndex(newQueueIndex);
            updateQueueName(newQueueName);
            play();
        }
    }

    return {
        play,
        pause,
        next,
        prev,
        playQueue,
        playMashup
    };
}
