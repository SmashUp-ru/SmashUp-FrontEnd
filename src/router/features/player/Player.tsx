import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { BITRATES, useSettingsStore } from '@/store/settings.ts';
import { axiosSession } from '@/lib/utils.ts';
import { coverUrl, mashupAudioUrl } from '@/lib/cdn.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useMediaSession } from '@dmhd6219/react-media-session';
import {
    POLL_MS,
    readPosition,
    usePendingSeek
} from '@/router/features/player/usePlaybackEngine.ts';

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

    // media session api

    const artwork = useMemo(
        () => [
            {
                src: coverUrl('mashup', mashup.imageUrl, 100),
                sizes: '100x100',
                type: 'image/jpeg'
            },
            {
                src: coverUrl('mashup', mashup.imageUrl, 400),
                sizes: '400x400',
                type: 'image/jpeg'
            }
        ],
        [mashup.imageUrl]
    );

    // seekbackward/seekforward (±10с) НЕ подключаем: в iOS они заменяют на экране
    // блокировки кнопки «предыдущий/следующий трек».
    const onSeekTo = useCallback((details: MediaSessionActionDetails) => {
        if (details.seekTime == null) return;
        usePlayerStore.getState().updateChangedSeek(Math.round(details.seekTime * 1000));
    }, []);

    useMediaSession({
        title: mashup.name,
        artist: mashup.authors.join(', '),
        album: queueName,
        artwork: artwork,
        onPlay: play,
        onPause: pause,
        onPreviousTrack: prev,
        onNextTrack: next,
        onSeekTo: onSeekTo
    });

    // Позиция и длительность для системного виджета (macOS Now Playing, экран
    // блокировки): без них виджет не знает, где трек, и ползунок перемотки там
    // не работает. Подписка на стор, а не селектор: seek меняется каждые 500мс,
    // и ре-рендерить из-за этого Player незачем.
    useEffect(() => {
        const session = 'mediaSession' in navigator ? navigator.mediaSession : null;
        if (!session?.setPositionState || !mashup.duration) return;
        const duration = mashup.duration / 1000;
        const push = (seekMs: number) => {
            try {
                session.setPositionState({
                    duration,
                    position: Math.min(Math.max(seekMs / 1000, 0), duration),
                    playbackRate: 1
                });
            } catch {
                // некорректные значения браузер отвергает исключением — не критично
            }
        };
        push(usePlayerStore.getState().seek);
        return usePlayerStore.subscribe((state, prevState) => {
            if (state.seek !== prevState.seek) push(state.seek);
        });
    }, [mashup.duration]);

    // Иначе на паузе виджет продолжает «проигрывать» ползунок дальше.
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [isPlaying]);

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
