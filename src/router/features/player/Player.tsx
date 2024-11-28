import React, { useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';

const Player: React.FC = () => {
    const { isPlaying, loop, volume, queue, queueIndex } = usePlayerStore();

    const player = useRef<ReactHowler | null>(null);

    const handleOnEnd = () => {};

    const handleOnLoad = () => {};

    return (
        <ReactHowler
            // @ts-expect-error сделано специально, но мб стоит каждый раз пересоздавать плеер. потом посмотрю, что лучше
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
