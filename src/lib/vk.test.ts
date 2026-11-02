import { describe, it, expect, beforeEach } from 'vitest';
import { consumeVkState } from '@/lib/vk.ts';

const KEY = 'smashup_vk_oauth_state';

describe('consumeVkState (защита VK OAuth от подброшенного кода)', () => {
    beforeEach(() => sessionStorage.clear());

    it('принимает state из потока, начатого в этой вкладке', () => {
        sessionStorage.setItem(KEY, JSON.stringify({ kind: 'link', state: 'abc' }));
        expect(consumeVkState('link', 'abc')).toBe(true);
    });

    it('одноразовый: повтор того же state отклоняется', () => {
        sessionStorage.setItem(KEY, JSON.stringify({ kind: 'link', state: 'abc' }));
        consumeVkState('link', 'abc');
        expect(consumeVkState('link', 'abc')).toBe(false);
    });

    it('отклоняет ссылку без начатого потока (подброшенный code)', () => {
        expect(consumeVkState('link', 'abc')).toBe(false);
        expect(consumeVkState('link', null)).toBe(false);
    });

    it('отклоняет чужой state и state другого потока', () => {
        sessionStorage.setItem(KEY, JSON.stringify({ kind: 'link', state: 'abc' }));
        expect(consumeVkState('link', 'evil')).toBe(false);
        sessionStorage.setItem(KEY, JSON.stringify({ kind: 'authorize', state: 'abc' }));
        expect(consumeVkState('link', 'abc')).toBe(false);
    });
});
