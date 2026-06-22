import { useEffect, useRef } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';

/**
 * Общий движок для простых плееров-превью (модерация, VK).
 *
 * Владеет ссылкой на ReactHowler, синхронизирует перемотку (`changedSeek`) и
 * каждые 500мс пишет текущую позицию в `seek`, пока `playing === true`.
 *
 * Главный плеер (`Player.tsx`) использует собственную расширенную версию: он
 * дополнительно трекает прослушивания (add_stream / listened) и медиасессию,
 * поэтому намеренно не сводится к этому хуку.
 *
 * Возвращает ref, который нужно повесить на `<ReactHowler ref={...}>`.
 */
export function usePlaybackEngine(playing: boolean) {
    const playerRef = useRef<ReactHowler | null>(null);
    const intervalRef = useRef<number | null>(null);

    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const updateSeek = usePlayerStore((state) => state.updateSeek);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.seek(changedSeek / 1000);
        }
    }, [changedSeek]);

    useEffect(() => {
        if (playing) {
            intervalRef.current = window.setInterval(() => {
                if (playerRef.current) {
                    updateSeek(playerRef.current.seek() * 1000);
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
    }, [playing, updateSeek]);

    return playerRef;
}
