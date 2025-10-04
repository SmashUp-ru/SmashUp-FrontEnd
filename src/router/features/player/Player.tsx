import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { BITRATES, useSettingsStore } from '@/store/settings.ts';
import { axiosSession } from '@/lib/utils.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useMediaSession } from '@dmhd6219/react-media-session';

export default function Player({ mashup }: { mashup: Mashup }) {
    const currentUser = useGlobalStore((state) => state.currentUser);

    const updatePlaying = usePlayerStore((state) => state.updatePlaying);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const volume = usePlayerStore((state) => state.volume);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);
    const bitrate = useSettingsStore((state) => state.bitrate);

    const moderationSrc = usePlayerStore((state) => state.moderationSrc);
    const moderationIsPlaying = usePlayerStore((state) => state.moderationIsPlaying);
    const updateModerationIsPlaying = usePlayerStore((state) => state.updateModerationIsPlaying);

    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);
    const vkMashupIsPlaying = usePlayerStore((state) => state.vkMashupIsPlaying);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const [lastId, setLastId] = useState<number | null>(null);

    const { next, prev, play, pause, closeInfo } = usePlayer();

    const player = useRef<ReactHowler | null>(null);
    const intervalRef = useRef<number | null>(null);

    const playTimeRef = useRef<number>(0);
    const playTimeSent = useRef<boolean>(false);

    const sendListenedEvent = useCallback(() => {
        playTimeSent.current = true;

        const currentTrackId = queue[queueIndex];
        if (currentTrackId && currentUser !== null) {
            axiosSession.post(`/mashup/add_stream?id=${currentTrackId}`).catch(console.error);
        }
    }, [currentUser, queue, queueIndex]);

    const sendListenedDuration = useCallback(() => {
        if (lastId && currentUser !== null && playTimeRef.current > 0) {
            axiosSession
                .post(`/mashup/listened?id=${lastId}&duration=${playTimeRef.current}`)
                .catch(console.error);
        }
    }, [currentUser, lastId]);

    const resetPlayTime = useCallback(() => {
        sendListenedDuration();

        playTimeRef.current = 0;
        playTimeSent.current = false;
    }, [sendListenedDuration]);

    const handleOnEnd = useCallback(() => {
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
    }, [next, pause, play, resetPlayTime, updateQueueIndex]);

    useEffect(() => {
        if (!player.current) return;
        if (player.current.howler.state() === 'loaded') {
            player.current.seek(changedSeek / 1000);
            if (changedSeek !== 0) {
                updateChangedSeek(0);
            }
        }
    }, [changedSeek, updateChangedSeek]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                if (player.current) {
                    updateSeek(player.current.seek() * 1000);
                    playTimeRef.current += 0.5;
                    if (
                        playTimeRef.current >= Math.min(30, mashup.duration / 2000) &&
                        !playTimeSent.current
                    ) {
                        sendListenedEvent();
                    }

                    if (playTimeRef.current >= 30 * 60) {
                        sendListenedDuration();
                        playTimeRef.current = 0;
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
    }, [isPlaying, mashup.duration, sendListenedDuration, sendListenedEvent, updateSeek]);

    useEffect(() => {
        resetPlayTime();
        setLastId(queue[queueIndex]);
    }, [queue, queueIndex, resetPlayTime]);

    // hotkeys
    useHotkeys(
        'space',
        () => {
            // TODO: разобраться с пробелом
            if (moderationSrc !== null) {
                updateModerationIsPlaying(!moderationIsPlaying);
            } else if (vkMashupSrc !== null) {
                updateVkMashupIsPlaying(!vkMashupIsPlaying);
            } else {
                updatePlaying(!isPlaying);
            }
        },
        { preventDefault: true }
    );
    useHotkeys('ctrl+right', () => next(), { preventDefault: true });
    useHotkeys('ctrl+left', () => prev(), { preventDefault: true });
    useHotkeys('esc', () => closeInfo(), { preventDefault: true });

    // media session api

    const artwork = useMemo(
        () => [
            {
                src: `${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`,
                sizes: '100x100',
                type: 'image/jpeg'
            },
            {
                src: `${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`,
                sizes: '400x400',
                type: 'image/jpeg'
            }
        ],
        [mashup.imageUrl]
    );

    useMediaSession({
        title: mashup.name,
        artist: mashup.authors.join(', '),
        album: queueName,
        artwork: artwork,
        onPlay: play,
        onPause: pause,
        // onSeekBackward,
        // onSeekForward,
        onPreviousTrack: prev,
        onNextTrack: next
    });

    return (
        <ReactHowler
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${queue[queueIndex]}.mp3?bitrate=${BITRATES[bitrate]}`}
            playing={isPlaying}
            onEnd={handleOnEnd}
            loop={usePlayerStore.getState().loop === 'mashup'}
            volume={volume}
            ref={(ref) => (player.current = ref)}
            html5={true}
            preload={true}
            onLoad={() => {
                if (changedSeek > 0 && player.current) {
                    player.current.seek(changedSeek / 1000);
                    updateChangedSeek(0);
                }
            }}
        />
    );
}
