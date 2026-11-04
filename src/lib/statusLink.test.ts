import { describe, it, expect } from 'vitest';
import {
    shortStatusLink,
    statusKindFromLink,
    statusKindOf,
    withStatusKind
} from '@/lib/statusLink.ts';

describe('statusKindFromLink', () => {
    it('паблик основы и паблик альтов (vk.ru и vk.com)', () => {
        expect(statusKindFromLink('https://vk.ru/wall-39786657_805862')).toBe('base');
        expect(statusKindFromLink('https://vk.com/wall-39786657_805851')).toBe('base');
        expect(statusKindFromLink('https://vk.ru/wall-158693521_553935')).toBe('alt');
        expect(statusKindFromLink('https://m.vk.com/wall-158693521_553934')).toBe('alt');
    });
    it('прочее — не определить', () => {
        expect(statusKindFromLink('https://vk.ru/wall-1_2')).toBeNull();
        expect(statusKindFromLink('https://youtube.com/watch?v=x')).toBeNull();
        expect(statusKindFromLink('https://evil.com/vk.com/wall-39786657_1')).toBeNull();
        expect(statusKindFromLink('')).toBeNull();
        expect(statusKindFromLink(undefined)).toBeNull();
    });
});

describe('withStatusKind', () => {
    it('основа и альт взаимоисключающие, explicit не трогается', () => {
        const explicit = 1;
        const alt = withStatusKind(explicit, 'alt');
        expect(statusKindOf(alt)).toBe('alt');
        expect(alt & 1).toBe(1);
        const base = withStatusKind(alt, 'base');
        expect(statusKindOf(base)).toBe('base');
        expect(statusKindOf(withStatusKind(base, 'none'))).toBe('none');
    });
});

describe('shortStatusLink', () => {
    it('пост VK — номером поста, прочее — без протокола', () => {
        expect(shortStatusLink('https://vk.ru/wall-39786657_805862')).toBe('VK · пост 805862');
        expect(shortStatusLink('https://www.youtube.com/watch?v=x')).toBe('youtube.com/watch?v=x');
    });
});
