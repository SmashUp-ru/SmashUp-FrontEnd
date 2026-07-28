import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    clearAuthSession,
    getPrimaryAccount,
    rememberPrimaryAccount,
    replaceStoredToken
} from '@/lib/authSession.ts';

describe('authSession', () => {
    beforeEach(() => {
        clearAuthSession();
    });

    afterEach(() => {
        clearAuthSession();
    });

    it('сохраняет основной аккаунт в том же хранилище, что и текущая сессия', () => {
        sessionStorage.setItem('smashup_token', 'base-token');

        rememberPrimaryAccount({ token: 'base-token', username: 'Основной' });

        expect(getPrimaryAccount()).toEqual({ token: 'base-token', username: 'Основной' });
        expect(sessionStorage.getItem('smashup_primary_account')).not.toBeNull();
        expect(localStorage.getItem('smashup_primary_account')).toBeNull();
    });

    it('заменяет только активный токен и не сохраняет одновременно две сессии', () => {
        localStorage.setItem('smashup_token', 'base-token');

        replaceStoredToken('alter-ego-token');

        expect(localStorage.getItem('smashup_token')).toBe('alter-ego-token');
        expect(sessionStorage.getItem('smashup_token')).toBeNull();
    });
});
