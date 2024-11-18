import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react';
import ReactHowler from 'react-howler';

const FullControl: React.FC = () => {
    const player = useRef<ReactHowler | null>(null);
    const [playing, setPlaying] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loop, setLoop] = useState(false);
    const [mute, setMute] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [seek, setSeek] = useState(0.0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [duration, setDuration] = useState<number | undefined>(undefined);
    const raf = useRef<number | undefined>(undefined);

    const clearRAF = () => {
        if (raf.current) {
            cancelAnimationFrame(raf.current);
        }
    };

    const renderSeekPos = () => {
        if (!isSeeking && player.current) {
            setSeek(player.current.seek() ?? 0);
        }
        raf.current = requestAnimationFrame(renderSeekPos);
    };

    const handleToggle = () => {
        setPlaying((prev) => !prev);
    };

    const handleOnLoad = () => {
        setLoaded(true);
        setDuration(player.current?.duration());
    };

    const handleOnPlay = () => {
        setPlaying(true);
    };

    const handleOnEnd = () => {
        setPlaying(false);
        clearRAF();
    };

    const handleStop = () => {
        player.current?.stop();
        setPlaying(false);
        setSeek(0);
        clearRAF();
    };

    const handleLoopToggle = () => {
        setLoop((prev) => !prev);
    };

    const handleMuteToggle = () => {
        setMute((prev) => !prev);
    };

    const handleMouseDownSeek = () => {
        setIsSeeking(true);
        clearRAF(); // Останавливаем обновление во время ручного изменения
    };

    const handleMouseUpSeek = (e: MouseEvent<HTMLInputElement>) => {
        setIsSeeking(false);
        const newSeek = parseFloat((e.target as HTMLInputElement).value);
        setSeek(newSeek);
        player.current?.seek(newSeek);
        if (playing) renderSeekPos(); // Возобновляем обновление, если играется
    };

    const handleSeekingChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newSeek = parseFloat(e.target.value);
        setSeek(newSeek);
    };

    useEffect(() => {
        if (playing && !isSeeking) {
            renderSeekPos();
        } else {
            clearRAF();
        }
        return () => clearRAF(); // Clean up on unmount
    }, [playing, isSeeking]);

    return (
        <div className='mb-4 mr-4 h-[96px] p-4 flex flex-wrap items-center justify-between bg-surface rounded-[30px]'>
            <ReactHowler
                src={`https://api.smashup.ru/uploads/mashup/1.mp3`}
                playing={playing}
                onLoad={handleOnLoad}
                onPlay={handleOnPlay}
                onEnd={handleOnEnd}
                loop={loop}
                mute={mute}
                volume={volume}
                ref={(ref) => (player.current = ref)}
            />

            <p>{loaded ? 'Loaded' : 'Loading'}</p>

            <div className='toggles'>
                <label>
                    Loop:
                    <input type='checkbox' checked={loop} onChange={handleLoopToggle} />
                </label>
                <label>
                    Mute:
                    <input type='checkbox' checked={mute} onChange={handleMuteToggle} />
                </label>
            </div>

            <p>
                Status: {seek.toFixed(2)} / {duration ? duration.toFixed(2) : 'NaN'}
            </p>

            <div className='volume'>
                <label>
                    Volume:
                    <span className='slider-container'>
                        <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.05'
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                        />
                    </span>
                    {volume.toFixed(2)}
                </label>
            </div>

            <div className='seek'>
                <label>
                    Seek:
                    <span className='slider-container'>
                        <input
                            type='range'
                            min='0'
                            max={duration ? duration.toFixed(2) : '0'}
                            step='0.01'
                            value={seek}
                            onChange={handleSeekingChange}
                            onMouseDown={handleMouseDownSeek}
                            onMouseUp={handleMouseUpSeek}
                        />
                    </span>
                </label>
            </div>

            <button onClick={handleToggle}>{playing ? 'Pause' : 'Play'}</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
};

export default FullControl;
