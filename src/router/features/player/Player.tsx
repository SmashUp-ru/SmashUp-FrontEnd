import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { BITRATES, useSettingsStore } from '@/store/settings.ts';
import { axiosSession } from '@/lib/utils.ts';
import { mashupAudioUrl } from '@/lib/cdn.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { useGlobalStore } from '@/store/global.ts';
import {
    POLL_MS,
    readPosition,
    usePendingSeek
} from '@/router/features/player/usePlaybackEngine.ts';
import {
    mashupArtwork,
    useMediaSessionBridge
} from '@/router/features/player/useMediaSessionBridge.ts';

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
    // Подписка, а не getState() при рендере: иначе включённый «повтор трека»
    // доходил до Howler только при следующем случайном ре-рендере.
    const loop = usePlayerStore((state) => state.loop);
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
    const applyPendingSeek = usePendingSeek(player);
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
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                const position = readPosition(player);
                if (position !== null) {
                    updateSeek(position);
                    playTimeRef.current += POLL_MS / 1000;
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
            }, POLL_MS);
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

    // Системные виджеты (Now Playing, экран блокировки…)
    const track = useMemo(
        () => ({
            title: mashup.name,
            artist: mashup.authors.join(', '),
            album: queueName,
            artwork: mashupArtwork(mashup.imageUrl),
            durationMs: mashup.duration
        }),
        [mashup.name, mashup.authors, mashup.imageUrl, mashup.duration, queueName]
    );
    useMediaSessionBridge(track, isPlaying, { play, pause, prev, next });

    return (
        <ReactHowler
            src={mashupAudioUrl(queue[queueIndex], BITRATES[bitrate])}
            playing={isPlaying}
            onEnd={handleOnEnd}
            loop={loop === 'mashup'}
            volume={volume}
            ref={(ref) => (player.current = ref)}
            html5={true}
            preload={true}
            // Перемотка, запрошенная до загрузки трека, применяется здесь.
            onLoad={applyPendingSeek}
        />
    );
}
