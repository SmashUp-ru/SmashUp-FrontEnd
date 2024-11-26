import React, { useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';

const Player: React.FC = () => {
    const { isPlaying, loop, volume } = usePlayerStore();

    const player = useRef<ReactHowler | null>(null);

    const handleOnEnd = () => {};

    const handleOnLoad = () => {};

    return (
        <ReactHowler
            src={`https://api.smashup.ru/uploads/mashup/1.mp3`}
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
