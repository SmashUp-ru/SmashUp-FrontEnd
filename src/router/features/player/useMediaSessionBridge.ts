import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/player.ts';
import { coverUrl } from '@/lib/cdn.ts';

/**
 * Связь плеера с системными виджетами (macOS Now Playing, экран блокировки iOS,
 * уведомление Android, Windows/Linux) через Media Session API. Общая для всех
 * трёх баров: позиция у них в одном сторе (`seek`), перемотка — через `changedSeek`.
 *
 * Отдаём: метаданные, обложку, позицию/длительность, play/pause-состояние.
 * Принимаем: play, pause, stop (= pause), seekto, previoustrack/nexttrack.
 * seekbackward/seekforward (±10с) НЕ подключаем: в iOS они вытесняют
 * с экрана блокировки кнопки «предыдущий/следующий трек».
 */
export interface MediaSessionTrack {
    title: string;
    artist: string;
    album?: string;
    artwork?: MediaImage[];
    durationMs: number | null;
}

export interface MediaSessionControls {
    play: () => void;
    pause: () => void;
    prev?: () => void;
    next?: () => void;
}

/** Обложка мешапа с CDN. Файлы — PNG; крупным виджетам нужно ≥512px, поэтому есть 800. */
export function mashupArtwork(imageUrl: string): MediaImage[] {
    return [100, 400, 800].map((size) => ({
        src: coverUrl('mashup', imageUrl, size as 100 | 400 | 800),
        sizes: `${size}x${size}`,
        type: 'image/png'
    }));
}

const session = (): MediaSession | null =>
    typeof navigator !== 'undefined' && 'mediaSession' in navigator ? navigator.mediaSession : null;

export function useMediaSessionBridge(
    track: MediaSessionTrack | null,
    playing: boolean,
    controls: MediaSessionControls
) {
    // Обработчики через ref: колбэки из usePlayer пересоздаются, а перевешивать
    // setActionHandler на каждый рендер незачем.
    const ctl = useRef(controls);
    ctl.current = controls;

    const active = track !== null;
    const artworkKey = track?.artwork?.map((a) => a.src).join('|') ?? '';

    useEffect(() => {
        const ms = session();
        if (!ms || !track || typeof MediaMetadata === 'undefined') return;
        ms.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            album: track.album ?? '',
            artwork: track.artwork ?? []
        });
        return () => {
            ms.metadata = null;
        };
        // artwork сравниваем по адресам, а не по ссылке на массив
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [track?.title, track?.artist, track?.album, artworkKey]);

    useEffect(() => {
        const ms = session();
        if (!ms || !active) return;
        const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
            ['play', () => ctl.current.play()],
            ['pause', () => ctl.current.pause()],
            ['stop', () => ctl.current.pause()],
            [
                'seekto',
                (d) => {
                    if (d.seekTime == null) return;
                    usePlayerStore.getState().updateChangedSeek(Math.round(d.seekTime * 1000));
                }
            ],
            ['previoustrack', controls.prev ? () => ctl.current.prev?.() : null],
            ['nexttrack', controls.next ? () => ctl.current.next?.() : null]
        ];
        for (const [action, fn] of handlers) {
            try {
                ms.setActionHandler(action, fn);
            } catch {
                // действие не поддерживается этим браузером
            }
        }
        return () => {
            for (const [action] of handlers) {
                try {
                    ms.setActionHandler(action, null);
                } catch {
                    /* см. выше */
                }
            }
        };
    }, [active, Boolean(controls.prev), Boolean(controls.next)]); // eslint-disable-line react-hooks/exhaustive-deps

    // Иначе на паузе виджет продолжает «проигрывать» ползунок дальше.
    useEffect(() => {
        const ms = session();
        if (!ms || !active) return;
        ms.playbackState = playing ? 'playing' : 'paused';
        return () => {
            ms.playbackState = 'none';
        };
    }, [active, playing]);

    // Позиция: подписка на стор, а не селектор — seek меняется каждые 500мс,
    // и ре-рендерить из-за этого бар незачем.
    const durationMs = track?.durationMs ?? null;
    useEffect(() => {
        const ms = session();
        if (!ms?.setPositionState || !durationMs) return;
        const duration = durationMs / 1000;
        const push = (seekMs: number) => {
            try {
                ms.setPositionState({
                    duration,
                    position: Math.min(Math.max(seekMs / 1000, 0), duration),
                    playbackRate: 1
                });
            } catch {
                // некорректные значения браузер отвергает исключением — не критично
            }
        };
        push(usePlayerStore.getState().seek);
        const unsubscribe = usePlayerStore.subscribe((state, prev) => {
            if (state.seek !== prev.seek) push(state.seek);
        });
        return () => {
            unsubscribe();
            try {
                ms.setPositionState();
            } catch {
                /* сброс не везде поддерживается */
            }
        };
    }, [durationMs]);
}
