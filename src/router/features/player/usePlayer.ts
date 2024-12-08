import { usePlayerStore } from '@/store/player.ts';

export function usePlayer() {
    const {
        updatePlaying,
        queue,
        updateQueue,
        queueIndex,
        updateQueueIndex,
        updateQueueName,
        queueId,
        updateQueueId
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

    function playQueue(newQueue: number[], newQueueName: string, newQueueId: string) {
        if (newQueueId === queueId) {
            play();
        } else {
            updateQueueId(newQueueId);

            updateQueue([...newQueue]);
            updateQueueIndex(0);
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
