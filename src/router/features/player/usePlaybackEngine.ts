import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';

type HowlerRef = MutableRefObject<ReactHowler | null>;

/**
 * Текущая позиция в мс или `null`. Howler до загрузки возвращает из `seek()` не
 * число, а сам Howl (вызов ставится в очередь) — без проверки в стор уходил NaN.
 */
export function readPosition(ref: HowlerRef): number | null {
    const value: unknown = ref.current?.seek();
    return typeof value === 'number' && Number.isFinite(value) ? value * 1000 : null;
}

/**
 * Применяет запрос перемотки (`changedSeek`), как только трек загружен.
 *
 * - Трек ещё грузится → запрос ЖДЁТ: вернувшийся колбэк нужно повесить на
 *   `<ReactHowler onLoad>`. Раньше такой запрос просто терялся.
 * - Howler занят (`_playLock`: идёт `play()` после предыдущей перемотки) → ждём и
 *   повторяем. Иначе Howler кладёт seek в свою очередь, и при нескольких быстрых
 *   кликах подряд терялись все, кроме первого (проверено: просили 1700с, встало 303с).
 *   Новый запрос перезаписывает `changedSeek`, поэтому применяется всегда последний.
 * - Применили → `seek` обновляется сразу (бегунок встаёт на место и на паузе,
 *   когда опрос позиции не идёт), а запрос сбрасывается в `null`, НЕ в 0.
 */
const BUSY_RETRY_MS = 50;

export function usePendingSeek(ref: HowlerRef): () => void {
    const changedSeek = usePlayerStore((s) => s.changedSeek);
    const retry = useRef<number | null>(null);

    const apply = useCallback(() => {
        if (retry.current !== null) {
            clearTimeout(retry.current);
            retry.current = null;
        }
        const target = usePlayerStore.getState().changedSeek;
        const player = ref.current;
        if (target === null || !player) return;
        if (player.howler.state() !== 'loaded') return;
        // Приватное поле Howler: публичного способа узнать о незавершённом play() нет.
        if ((player.howler as unknown as { _playLock?: boolean })._playLock) {
            retry.current = window.setTimeout(apply, BUSY_RETRY_MS);
            return;
        }
        player.seek(target / 1000);
        usePlayerStore.setState({ seek: target, changedSeek: null });
    }, [ref]);

    useEffect(() => {
        apply();
    }, [changedSeek, apply]);

    useEffect(
        () => () => {
            if (retry.current !== null) clearTimeout(retry.current);
        },
        []
    );

    return apply;
}

/**
 * Опрос позиции раз в `POLL_MS`, пока `playing`. Это «правда» для логики
 * (prev, аналитика прослушиваний); плавность бегунка даёт `useSmoothSeek`.
 */
export const POLL_MS = 500;

/**
 * Шаг seek-слайдера, мс. Был 1 мс по умолчанию — стрелка на клавиатуре двигала
 * бегунок на 1 мс (10 нажатий = 10 мс). 1 с на стрелку, 10 с на PageUp/Shift+стрелку.
 */
export const SEEK_STEP_MS = 1000;

/**
 * Общий движок для простых плееров-превью (модерация, VK).
 * Главный `Player.tsx` использует те же `usePendingSeek`/`readPosition`, но опрос
 * у него свой: в тике ещё считается аналитика (add_stream / listened).
 */
export function usePlaybackEngine(playing: boolean) {
    const playerRef = useRef<ReactHowler | null>(null);
    const onLoad = usePendingSeek(playerRef);
    const updateSeek = usePlayerStore((state) => state.updateSeek);

    useEffect(() => {
        if (!playing) return;
        const id = window.setInterval(() => {
            const position = readPosition(playerRef);
            if (position !== null) updateSeek(position);
        }, POLL_MS);
        return () => clearInterval(id);
    }, [playing, updateSeek]);

    return { playerRef, onLoad };
}

/** Играет ли источник, который сейчас показан в баре (обычный / модерация / VK). */
function selectActivePlaying(s: ReturnType<typeof usePlayerStore.getState>): boolean {
    if (s.moderationSrc !== null) return s.moderationIsPlaying;
    if (s.vkMashupSrc !== null) return s.vkMashupIsPlaying;
    return s.isPlaying;
}

/**
 * Позиция для ОТОБРАЖЕНИЯ (мс), плавная: между опросами (раз в 500мс) бегунок
 * двигается сам — от последней известной позиции на прошедшее время, каждый кадр.
 *
 * Почему не опрашивать Howler 60 раз в секунду в стор: на `seek` подписан
 * `usePlayer` (prev), а он стоит в каждой строке мешапа — перерисовывался бы весь
 * список. Тут перерисовывается только сам слайдер.
 *
 * Экстраполяция ограничена `MAX_AHEAD_MS`: если трек подвис на буферизации и
 * позиция не обновляется, бегунок останавливается, а не убегает вперёд.
 */
const MAX_AHEAD_MS = POLL_MS + 250;

export function useSmoothSeek(durationMs: number): number {
    const seek = usePlayerStore((s) => s.seek);
    const playing = usePlayerStore(selectActivePlaying);
    const [display, setDisplay] = useState(seek);
    const anchor = useRef({ ms: seek, at: performance.now() });

    useEffect(() => {
        anchor.current = { ms: seek, at: performance.now() };
        setDisplay(seek);
    }, [seek]);

    useEffect(() => {
        if (!playing) return;
        let frame = 0;
        const tick = () => {
            const { ms, at } = anchor.current;
            const ahead = Math.min(performance.now() - at, MAX_AHEAD_MS);
            const max = durationMs > 0 ? durationMs : Infinity;
            setDisplay(Math.min(ms + ahead, max));
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [playing, durationMs]);

    return display;
}
