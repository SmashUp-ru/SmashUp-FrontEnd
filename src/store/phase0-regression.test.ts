import { describe, it, expect, beforeEach } from 'vitest';
import { useMobileStore } from '@/store/mobile.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useSearchStore } from '@/store/search.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { resetAppState } from '@/store/reset.ts';
import type { User } from '@/store/entities/user.ts';

beforeEach(() => {
    localStorage.clear();
});

// 0.1 — раньше mobile.ts и settings.ts писали под один ключ 'settings-storage'
// и затирали поля друг друга. Теперь ключи разные.
describe('0.1 — нет коллизии localStorage между mobile и settings', () => {
    it('agreed и bitrate переживают друг друга под разными ключами', () => {
        useMobileStore.getState().updateAgreed(true);
        useSettingsStore.getState().updateBitrate(2);

        const mobile = localStorage.getItem('mobile-storage');
        const settings = localStorage.getItem('settings-storage');

        expect(mobile).toContain('agreed');
        expect(settings).toContain('bitrate');
        expect(useMobileStore.getState().agreed).toBe(true);
        expect(useSettingsStore.getState().bitrate).toBe(2);
    });
});

// 0.5 — при логауте раньше оставались рекомендации/подборки/crossover/кэши.
describe('0.5 — resetAppState чистит производное состояние', () => {
    it('сбрасывает global-поля, crossover-теги и кэши entity-сторов', () => {
        useGlobalStore.setState({
            currentUser: { id: 1, username: 'x' } as User,
            recommendations: [1, 2],
            compilations: [3]
        });
        useSearchStore.setState({
            crossoverTracks: [{ id: 9 } as never],
            crossoverArtists: [{ id: 8 } as never]
        });
        useMashupStore.setState({ cache: { 1: { id: 1, name: 'm' } } as never });

        resetAppState();

        expect(useGlobalStore.getState().currentUser).toBeNull();
        expect(useGlobalStore.getState().recommendations).toBeNull();
        expect(useGlobalStore.getState().compilations).toBeNull();
        expect(useSearchStore.getState().crossoverTracks).toEqual([]);
        expect(useSearchStore.getState().crossoverArtists).toEqual([]);
        expect(useMashupStore.getState().cache).toEqual({});
    });
});
