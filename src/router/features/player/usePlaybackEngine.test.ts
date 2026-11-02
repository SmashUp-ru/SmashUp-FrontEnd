import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import type ReactHowler from 'react-howler';
import { usePlayerStore } from '@/store/player.ts';
import {
    readPosition,
    usePendingSeek,
    useSmoothSeek
} from '@/router/features/player/usePlaybackEngine.ts';

/** Минимальный двойник ReactHowler: состояние загрузки + seek (сек). */
function fakeHowler(state: 'loaded' | 'loading' = 'loaded', position = 0) {
    const fake = {
        state,
        position,
        seekCalls: [] as number[],
        howler: { state: () => fake.state },
        seek(value?: number) {
            if (value === undefined) return fake.position;
            fake.seekCalls.push(value);
            fake.position = value;
        }
    };
    return fake;
}

const asRef = (fake: ReturnType<typeof fakeHowler>) => ({
    current: fake as unknown as ReactHowler
});

// Без глобального режима vitest testing-library не размонтирует хуки сама —
// хук прошлого теста оставался жив и «съедал» запросы перемотки следующего.
afterEach(cleanup);

beforeEach(() => {
    usePlayerStore.setState({
        seek: 0,
        changedSeek: null,
        isPlaying: false,
        moderationSrc: null,
        vkMashupSrc: null
    });
});

describe('usePendingSeek', () => {
    it('применяет перемотку один раз и НЕ откатывает в начало (регрессия seek(0))', () => {
        const howl = fakeHowler('loaded');
        renderHook(() => usePendingSeek(asRef(howl)));

        act(() => usePlayerStore.getState().updateChangedSeek(1_500_000));

        expect(howl.seekCalls).toEqual([1500]);
        expect(usePlayerStore.getState().seek).toBe(1_500_000);
        expect(usePlayerStore.getState().changedSeek).toBeNull();
    });

    it('честная просьба «в начало» (0) исполняется', () => {
        const howl = fakeHowler('loaded', 300);
        renderHook(() => usePendingSeek(asRef(howl)));

        act(() => usePlayerStore.getState().updateChangedSeek(0));

        expect(howl.seekCalls).toEqual([0]);
    });

    it('до загрузки трека запрос ждёт и применяется на onLoad', () => {
        const howl = fakeHowler('loading');
        const { result } = renderHook(() => usePendingSeek(asRef(howl)));

        act(() => usePlayerStore.getState().updateChangedSeek(1_200_000));
        expect(howl.seekCalls).toEqual([]);
        expect(usePlayerStore.getState().changedSeek).toBe(1_200_000);

        howl.state = 'loaded';
        act(() => result.current());
        expect(howl.seekCalls).toEqual([1200]);
        expect(usePlayerStore.getState().changedSeek).toBeNull();
    });

    it('повторная перемотка в ту же точку тоже срабатывает', () => {
        const howl = fakeHowler('loaded');
        renderHook(() => usePendingSeek(asRef(howl)));

        act(() => usePlayerStore.getState().updateChangedSeek(60_000));
        act(() => usePlayerStore.getState().updateChangedSeek(60_000));

        expect(howl.seekCalls).toEqual([60, 60]);
    });
});

describe('readPosition', () => {
    it('мс для числа и null для не-числа (Howler до загрузки возвращает сам Howl)', () => {
        expect(readPosition(asRef(fakeHowler('loaded', 12.5)))).toBe(12_500);
        const queued = { current: { seek: () => ({}) } as unknown as ReactHowler };
        expect(readPosition(queued)).toBeNull();
        expect(readPosition({ current: null })).toBeNull();
    });
});

describe('useSmoothSeek', () => {
    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance']
        });
    });
    afterEach(() => vi.useRealTimers());

    it('между опросами двигается плавно и не убегает дальше 750мс при подвисании', () => {
        usePlayerStore.setState({ seek: 10_000, isPlaying: true });
        const { result } = renderHook(() => useSmoothSeek(2_099_141));

        act(() => vi.advanceTimersByTime(16 * 10)); // ~10 кадров
        expect(result.current).toBeGreaterThan(10_100);
        expect(result.current).toBeLessThan(10_200);

        act(() => vi.advanceTimersByTime(5_000)); // опроса не было — буферизация
        expect(result.current).toBeLessThanOrEqual(10_750);
    });

    it('новый опрос перезадаёт точку отсчёта; на паузе стоит', () => {
        usePlayerStore.setState({ seek: 10_000, isPlaying: true });
        const { result } = renderHook(() => useSmoothSeek(2_099_141));

        act(() => usePlayerStore.setState({ seek: 500_000 }));
        expect(result.current).toBe(500_000);

        act(() => usePlayerStore.setState({ isPlaying: false }));
        const frozen = result.current;
        act(() => vi.advanceTimersByTime(2_000));
        expect(result.current).toBe(frozen);
    });

    it('не выходит за длительность трека', () => {
        usePlayerStore.setState({ seek: 2_099_000, isPlaying: true });
        const { result } = renderHook(() => useSmoothSeek(2_099_141));
        act(() => vi.advanceTimersByTime(700));
        expect(result.current).toBe(2_099_141);
    });
});
