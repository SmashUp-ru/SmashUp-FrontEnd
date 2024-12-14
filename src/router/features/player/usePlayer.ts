import { usePlayerStore } from '@/store/player.ts';
import { shuffleQueue } from '@/lib/utils.ts';

export function usePlayer() {
    const {
        updatePlaying,
        queue,
        updateQueue,
        updateOriginalQueue,
        queueIndex,
        updateQueueIndex,
        updateQueueName,
        queueId,
        updateQueueId,
        shuffle
    } = usePlayerStore();

    function play() {
        updatePlaying(true);
    }

    function pause() {
        updatePlaying(false);
    }

    function next() {
        if (queueIndex !== null && queueIndex + 1 < queue.length) {
            updateQueueIndex(queueIndex + 1);
        }
    }

    function prev() {
        if (queueIndex !== null && queueIndex > 0) {
            updateQueueIndex(queueIndex - 1);
        }
    }

    function playQueue(
        newQueue: number[],
        newQueueName: string,
        newQueueId: string,
        newQueueIndex: number = 0
    ) {
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
