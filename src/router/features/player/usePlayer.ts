import { usePlayerStore } from '@/store/player.ts';

export function usePlayer() {
    const { updatePlaying, queue, updateQueue, queueIndex, updateQueueIndex, updateQueueName } =
        usePlayerStore();

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

    function playPlaylist(playlist: number[], playlistName: string, index: number = 0) {
        updateQueue([...playlist]);
        updateQueueIndex(index);
        updateQueueName(playlistName);
        play();
    }

    return {
        play,
        pause,
        next,
        prev,
        playPlaylist
    };
}
