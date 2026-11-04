import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const { playQueue, pause, mashups } = vi.hoisted(() => ({
    playQueue: vi.fn(),
    pause: vi.fn(),
    mashups: [
        { id: 1, statuses: 0 },
        { id: 2, statuses: 1 }, // бит 0 — explicit
        { id: 3, statuses: 0 }
    ]
}));
vi.mock('@/router/features/player/usePlayer.ts', () => ({
    usePlayer: () => ({ playQueue, pause })
}));
vi.mock('@/router/shared/components/playlist/usePlaylistMashups.ts', () => ({
    usePlaylistMashups: () => ({ mashups, isLoading: false })
}));

import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import { usePlayerStore } from '@/store/player.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { isExplicit } from '@/lib/bitmask.ts';

beforeEach(() => {
    playQueue.mockReset();
    pause.mockReset();
    usePlayerStore.setState({ isPlaying: false, queueId: '' });
    useSettingsStore.setState({ settingsBitmask: null });
});

describe('useEntityThumb', () => {
    it('проверка фикстуры: мешап 2 — explicit', () => {
        expect(isExplicit(mashups[1].statuses)).toBe(true);
    });

    it('play — вся очередь, если explicit не фильтруется', () => {
        const { result } = renderHook(() => useEntityThumb([1, 2, 3], 'Q', 'playlist/9'));
        act(() => result.current.togglePlay());
        expect(playQueue).toHaveBeenCalledWith([1, 2, 3], 'Q', 'playlist/9');
    });

    it('explicit запрещён — explicit-мешапы выкидываются из очереди', () => {
        useSettingsStore.setState({ settingsBitmask: 0 });
        const { result } = renderHook(() => useEntityThumb([1, 2, 3], 'Q', 'playlist/9'));
        act(() => result.current.togglePlay());
        expect(playQueue).toHaveBeenCalledWith([1, 3], 'Q', 'playlist/9');
    });

    it('играет именно эта очередь — пауза, а не перезапуск', () => {
        usePlayerStore.setState({ isPlaying: true, queueId: 'playlist/9' });
        const { result } = renderHook(() => useEntityThumb([1, 2, 3], 'Q', 'playlist/9'));
        expect(result.current.isThisPlaying).toBe(true);
        act(() => result.current.togglePlay());
        expect(pause).toHaveBeenCalledOnce();
        expect(playQueue).not.toHaveBeenCalled();
    });

    it('играет другая очередь — не считается «этой»', () => {
        usePlayerStore.setState({ isPlaying: true, queueId: 'playlist/1' });
        const { result } = renderHook(() => useEntityThumb([1], 'Q', 'playlist/9'));
        expect(result.current.isThisPlaying).toBe(false);
        expect(result.current.isThisQueue).toBe(false);
    });
});
