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
    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (player.current) {
            player.current.seek(changedSeek / 1000);
            updateSeek(player.current.seek() * 1000);
        }
    }, [changedSeek]);

    useEffect(() => {
        if (isPlaying) {
            const updateTime = () => {
                if (player.current) {
                    updateSeek(player.current.seek() * 1000);
                }
                if (isPlaying) {
                    raf.current = requestAnimationFrame(updateTime);
                }
            };

            raf.current = requestAnimationFrame(updateTime);
        } else if (raf.current) {
            cancelAnimationFrame(raf.current);
        }

        return () => {
            if (raf.current) {
                cancelAnimationFrame(raf.current);
            }
        };
    }, [isPlaying]);

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
    useHotkeys('space', () => updatePlaying(!isPlaying));
    useHotkeys('ctrl+right', () => next());
    useHotkeys('ctrl+left', () => prev());

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
