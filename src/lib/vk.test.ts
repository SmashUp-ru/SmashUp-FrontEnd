import { describe, it, expect, beforeEach, vi } from 'vitest';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/lib/utils.ts', () => ({ axiosSession: { get } }));

import { consumeVkState, startVkFlow } from '@/lib/vk.ts';

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

describe('startVkFlow', () => {
    beforeEach(() => {
        sessionStorage.clear();
        get.mockReset();
    });

    it('передаёт redirect_uri текущего домена, берёт state бэка и открывает URL как есть', async () => {
        const url =
            'https://id.vk.com/authorize?client_id=1&redirect_uri=x&state=BACKEND_STATE&v=5.131';
        get.mockResolvedValue({ data: { response: url } });
        vi.stubGlobal('location', { origin: 'https://test.smashup.ru', href: '' });

        await startVkFlow('link');

        expect(get).toHaveBeenCalledWith('/vk/link/url', {
            params: { redirect_uri: 'https://test.smashup.ru/vk/link' }
        });
        expect(window.location.href).toBe(url);
        expect(consumeVkState('link', 'BACKEND_STATE')).toBe(true);
        vi.unstubAllGlobals();
    });

    it('без state в URL бэка поток не начинается', async () => {
        get.mockResolvedValue({ data: { response: 'https://id.vk.com/authorize?client_id=1' } });
        await expect(startVkFlow('authorize')).rejects.toThrow();
        expect(sessionStorage.length).toBe(0);
    });
});
