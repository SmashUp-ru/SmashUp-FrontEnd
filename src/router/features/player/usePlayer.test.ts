import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

// Характеризация ТЕКУЩЕГО поведения плеера перед рефакторингом движка (Фаза 4.1).
// usePlayer работает только с usePlayerStore — моки не нужны.

function resetPlayer() {
    usePlayerStore.setState({
        isPlaying: false,
        queue: [],
        originalQueue: [],
        queueIndex: -1,
        queueName: '',
        queueId: '',
        loop: 'none',
        shuffle: false,
        seek: 0,
        changedSeek: 0,
        info: false,
        mashupInfo: null,
        moderationSrc: null,
        moderationIsPlaying: false,
        vkMashupSrc: null,
        vkMashupIsPlaying: false
    });
}

beforeEach(() => {
    localStorage.clear();
    resetPlayer();
});

describe('usePlayer — play / pause', () => {
    it('play ставит isPlaying=true, pause — false', () => {
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.play());
        expect(usePlayerStore.getState().isPlaying).toBe(true);
        act(() => result.current.pause());
        expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
});

describe('usePlayer — next', () => {
    it('loop=none, не последний трек → следующий индекс, seek сброшен', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 0, loop: 'none', seek: 1234 });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.next());
        expect(usePlayerStore.getState().queueIndex).toBe(1);
        expect(usePlayerStore.getState().seek).toBe(0);
    });

    it('loop=none, последний трек → пауза, индекс не меняется', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 2, loop: 'none', isPlaying: true });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.next());
        expect(usePlayerStore.getState().isPlaying).toBe(false);
        expect(usePlayerStore.getState().queueIndex).toBe(2);
    });

    it('loop=queue, последний трек → индекс 0 и играет', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 2, loop: 'queue' });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.next());
        expect(usePlayerStore.getState().queueIndex).toBe(0);
        expect(usePlayerStore.getState().isPlaying).toBe(true);
    });

    it('loop=mashup → повтор текущего (играет), индекс не меняется', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 1, loop: 'mashup' });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.next());
        expect(usePlayerStore.getState().queueIndex).toBe(1);
        expect(usePlayerStore.getState().isPlaying).toBe(true);
    });
});

describe('usePlayer — prev', () => {
    it('seek > 5с → пауза и перемотка в начало (индекс не меняется)', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 1, seek: 6000, isPlaying: true });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.prev());
        expect(usePlayerStore.getState().isPlaying).toBe(false);
        expect(usePlayerStore.getState().seek).toBe(0);
        expect(usePlayerStore.getState().queueIndex).toBe(1);
    });

    it('seek ≤ 5с, индекс > 0 → предыдущий трек', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 2, seek: 2000 });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.prev());
        expect(usePlayerStore.getState().queueIndex).toBe(1);
    });

    it('seek ≤ 5с, первый трек, loop=none → пауза', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 0, seek: 1000, isPlaying: true });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.prev());
        expect(usePlayerStore.getState().isPlaying).toBe(false);
        expect(usePlayerStore.getState().queueIndex).toBe(0);
    });

    it('seek ≤ 5с, первый трек, loop=mashup → играет', () => {
        usePlayerStore.setState({ queue: [1, 2, 3], queueIndex: 0, seek: 1000, loop: 'mashup' });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.prev());
        expect(usePlayerStore.getState().isPlaying).toBe(true);
        expect(usePlayerStore.getState().queueIndex).toBe(0);
    });
});

describe('usePlayer — playQueue', () => {
    it('пустая очередь → no-op', () => {
        usePlayerStore.setState({ queueId: 'playlist/1', queue: [1, 2] });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playQueue([], 'x', 'playlist/2'));
        expect(usePlayerStore.getState().queueId).toBe('playlist/1');
        expect(usePlayerStore.getState().queue).toEqual([1, 2]);
    });

    it('тот же queueId → просто возобновляет (очередь не трогает)', () => {
        usePlayerStore.setState({
            queueId: 'playlist/1',
            queue: [1, 2],
            queueIndex: 0,
            isPlaying: false
        });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playQueue([9, 9], 'ignored', 'playlist/1'));
        expect(usePlayerStore.getState().queue).toEqual([1, 2]);
        expect(usePlayerStore.getState().isPlaying).toBe(true);
    });

    it('новый queueId (shuffle off) → ставит очередь по порядку и играет', () => {
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playQueue([5, 6, 7], 'My Playlist', 'playlist/2', 1));
        const s = usePlayerStore.getState();
        expect(s.queue).toEqual([5, 6, 7]);
        expect(s.originalQueue).toEqual([5, 6, 7]);
        expect(s.queueIndex).toBe(1);
        expect(s.queueName).toBe('My Playlist');
        expect(s.queueId).toBe('playlist/2');
        expect(s.isPlaying).toBe(true);
        expect(s.moderationSrc).toBeNull();
        expect(s.vkMashupSrc).toBeNull();
    });
});

describe('usePlayer — playMashup', () => {
    it('тот же queueId и индекс → просто возобновляет', () => {
        usePlayerStore.setState({ queueId: 'playlist/1', queueIndex: 2, queue: [1, 2, 3] });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playMashup([1, 2, 3], 'x', 'playlist/1', 2));
        expect(usePlayerStore.getState().isPlaying).toBe(true);
        expect(usePlayerStore.getState().queue).toEqual([1, 2, 3]);
    });

    it('новый контекст → ставит очередь, индекс и играет', () => {
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playMashup([10, 20], 'Search', 'search/q', 1));
        const s = usePlayerStore.getState();
        expect(s.queue).toEqual([10, 20]);
        expect(s.queueIndex).toBe(1);
        expect(s.queueId).toBe('search/q');
        expect(s.isPlaying).toBe(true);
    });
});

describe('usePlayer — moderation / vk источники взаимоисключающие', () => {
    it('playModerationMashup чистит очередь и vk-источник', () => {
        usePlayerStore.setState({
            queue: [1, 2],
            queueIndex: 1,
            vkMashupSrc: { audioId: 1 } as never,
            vkMashupIsPlaying: true
        });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playModerationMashup({ id: 42 } as never));
        const s = usePlayerStore.getState();
        expect(s.queue).toEqual([]);
        expect(s.queueIndex).toBe(-1);
        expect(s.moderationSrc).toEqual({ id: 42 });
        expect(s.moderationIsPlaying).toBe(true);
        expect(s.vkMashupSrc).toBeNull();
        expect(s.vkMashupIsPlaying).toBe(false);
    });

    it('playVkMashup чистит очередь и moderation-источник', () => {
        usePlayerStore.setState({
            queue: [1, 2],
            moderationSrc: { id: 1 } as never,
            moderationIsPlaying: true
        });
        const { result } = renderHook(() => usePlayer());
        act(() => result.current.playVkMashup({ audioId: 7 } as never));
        const s = usePlayerStore.getState();
        expect(s.queue).toEqual([]);
        expect(s.vkMashupSrc).toEqual({ audioId: 7 });
        expect(s.vkMashupIsPlaying).toBe(true);
        expect(s.moderationSrc).toBeNull();
        expect(s.moderationIsPlaying).toBe(false);
    });
});
