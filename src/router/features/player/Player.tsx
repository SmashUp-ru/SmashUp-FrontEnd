import React, { useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

const Player: React.FC = () => {
    const {
        isPlaying,
        loop,
        volume,
        queue,
        queueIndex,
        updateQueueIndex,
        updateSeek,
        changedSeek
    } = usePlayerStore();
    const { next, play } = usePlayer();

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

    // перемотка из слайдера
    useEffect(() => {
        if (player.current) {
            player.current.seek(changedSeek / 1000);
            updateSeek(player.current.seek() * 1000);
        }
    }, [changedSeek]);

    useEffect(() => console.log(loop), [loop]);

    const handleOnEnd = () => {
        console.log(`Track ended at ${queueIndex} in length of ${queue.length}. Loop is ${loop}`);
        if (queueIndex === queue.length - 1) {
            if (loop === 'queue') {
                updateQueueIndex(0);
                play();
            }
        } else {
            if (loop !== 'mashup') {
                next();
            }
        }
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
            loop={loop === 'mashup'}
            volume={volume}
            ref={(ref) => (player.current = ref)}
        />
    );
};

export default Player;
