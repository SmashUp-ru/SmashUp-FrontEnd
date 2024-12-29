import React, { useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { BITRATES, useSettingsStore } from '@/store/settings.ts';

const Player: React.FC = () => {
    const updatePlaying = usePlayerStore((state) => state.updatePlaying);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const loop = usePlayerStore((state) => state.loop);
    const volume = usePlayerStore((state) => state.volume);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const bitrate = useSettingsStore((state) => state.bitrate);

    const { next, prev, play } = usePlayer();

    const player = useRef<ReactHowler | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (player.current) {
            player.current.seek(changedSeek / 1000);
        }
    }, [changedSeek]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                if (player.current) {
                    updateSeek(player.current.seek() * 1000);
                }
            }, 500);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, updateSeek]);

    const handleOnEnd = () => {
        if (queueIndex === queue.length - 1) {
            if (loop === 'queue') {
                updateQueueIndex(0);
                play();
            }
        } else if (loop !== 'mashup') {
            next();
        }
    };

    // hotkeys
    useHotkeys('space', () => updatePlaying(!isPlaying), { preventDefault: true });
    useHotkeys('ctrl+right', () => next(), { preventDefault: true });
    useHotkeys('ctrl+left', () => prev(), { preventDefault: true });

    return (
        <ReactHowler
            src={`https://api.smashup.ru/uploads/mashup/${queue[queueIndex]}.mp3?bitrate=${BITRATES[bitrate]}`}
            playing={isPlaying}
            onEnd={handleOnEnd}
            loop={loop === 'mashup'}
            volume={volume}
            ref={(ref) => (player.current = ref)}
        />
    );
};

export default Player;
