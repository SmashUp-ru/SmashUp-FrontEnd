import React, { useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';

const Player: React.FC = () => {
    const { isPlaying, loop, volume, queue, queueIndex, seek, updateSeek } = usePlayerStore();
    const player = useRef<ReactHowler | null>(null);
    const raf = useRef<number | null>(null);

    const updateTime = () => {
        if (player.current) {
            updateSeek(player.current.seek() * 1000);
        }
        if (isPlaying) {
            raf.current = requestAnimationFrame(updateTime);
        }
    };

    useEffect(() => {
        if (isPlaying) {
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

    useEffect(() => {
        if (player.current) {
            const currentSeek = player.current.seek() * 1000;
            if (Math.abs(currentSeek - seek) > 100) {
                player.current.seek(seek / 1000);
            }
        }
    }, [seek]);

    const handleOnEnd = () => {
        console.log('Track ended');
    };

    const handleOnLoad = () => {
        console.log('Track loaded');
    };

    return (
        <ReactHowler
            src={`https://api.smashup.ru/uploads/mashup/${queue[queueIndex]}.mp3`}
            playing={isPlaying}
            onLoad={handleOnLoad}
            onEnd={handleOnEnd}
            loop={loop}
            volume={volume}
            ref={(ref) => (player.current = ref)}
        />
    );
};

export default Player;
