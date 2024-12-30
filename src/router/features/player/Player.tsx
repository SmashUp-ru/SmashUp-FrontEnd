import React, { useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { BITRATES, useSettingsStore } from '@/store/settings.ts';
import { axiosSession } from '@/lib/utils.ts';

const Player: React.FC = () => {
    const updatePlaying = usePlayerStore((state) => state.updatePlaying);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const volume = usePlayerStore((state) => state.volume);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const bitrate = useSettingsStore((state) => state.bitrate);

    const { next, prev, play, pause } = usePlayer();

    const player = useRef<ReactHowler | null>(null);
    const intervalRef = useRef<number | null>(null);

    const playTimeRef = useRef<number>(0);
    const playTimeSent = useRef<boolean>(false);
    const durationSent = useRef<boolean>(false);

    const sendListenedEvent = () => {
        playTimeSent.current = true;

        const currentTrackId = queue[queueIndex];
        if (currentTrackId) {
            axiosSession.post(`/mashup/add_stream?id=${currentTrackId}`).catch(console.error);
        }
    };

    const sendListenedDuration = () => {
        if (playTimeRef.current >= 30) {
            durationSent.current = true;

            const currentTrackId = queue[queueIndex];
            if (currentTrackId) {
                axiosSession
                    .post(`/mashup/listened?id=${currentTrackId}`, {
                        duration: playTimeRef.current
                    })
                    .catch(console.error);
            }
        }
    };

    const resetPlayTime = () => {
        playTimeRef.current = 0;
        playTimeSent.current = false;
        durationSent.current = false;
    };

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
                    playTimeRef.current += 0.5;
                    if (playTimeRef.current >= 30 && !playTimeSent.current) {
                        sendListenedEvent();
                    }
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

    useEffect(() => {
        sendListenedDuration();
        resetPlayTime();
    }, [queueIndex]);

    const handleOnEnd = () => {
        sendListenedDuration();
        resetPlayTime();
        const currentLoop = usePlayerStore.getState().loop;
        const queue = usePlayerStore.getState().queue;
        const queueIndex = usePlayerStore.getState().queueIndex;

        if (queueIndex === queue.length - 1) {
            if (currentLoop === 'queue') {
                updateQueueIndex(0);
                play();
            } else if (currentLoop === 'none') {
                pause();
            }
        } else {
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
            loop={usePlayerStore.getState().loop === 'mashup'}
            volume={volume}
            ref={(ref) => (player.current = ref)}
        />
    );
};

export default Player;
