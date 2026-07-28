import { resetAppState } from '@/store/reset.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useUserStore, type User } from '@/store/entities/user.ts';

const TOKEN_KEY = 'smashup_token';
const PRIMARY_ACCOUNT_KEY = 'smashup_primary_account';

export interface PrimaryAccount {
    token: string;
    username: string;
}

function getActiveTokenStorage(): Storage {
    return localStorage.getItem(TOKEN_KEY) !== null ? localStorage : sessionStorage;
}

/** Сохраняет токен, не меняя выбранный пользователем режим «запомнить меня». */
export function replaceStoredToken(token: string): void {
    const storage = getActiveTokenStorage();
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    storage.setItem(TOKEN_KEY, token);
    useGlobalStore.getState().updateToken(token);
}

export function getPrimaryAccount(): PrimaryAccount | null {
    const stored =
        localStorage.getItem(PRIMARY_ACCOUNT_KEY) ?? sessionStorage.getItem(PRIMARY_ACCOUNT_KEY);
    if (!stored) return null;

    try {
        const account = JSON.parse(stored) as PrimaryAccount;
        return account.token && account.username ? account : null;
    } catch {
        return null;
    }
}

export function rememberPrimaryAccount(account: PrimaryAccount): void {
    getActiveTokenStorage().setItem(PRIMARY_ACCOUNT_KEY, JSON.stringify(account));
}

export function clearPrimaryAccount(): void {
    localStorage.removeItem(PRIMARY_ACCOUNT_KEY);
    sessionStorage.removeItem(PRIMARY_ACCOUNT_KEY);
}

/** Полностью завершает сессию, включая сохранённый путь возврата из альтер-эго. */
export function clearAuthSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    clearPrimaryAccount();
    useGlobalStore.getState().updateToken('');
    resetAppState();
}

/**
 * Меняет активную личность и перезагружает зависящие от неё данные.
 *
 * Кэши сущностей нельзя оставлять от предыдущей личности: в ответах сервера
 * видимость плейлистов, лайков и мешапов зависит от токена.
 */
export async function activateAccount(token: string): Promise<User> {
    resetAppState();
    replaceStoredToken(token);

    const user = await useUserStore.getState().getOneByStringKey('token', token);
    useGlobalStore.getState().updateCurrentUser(user);
    useGlobalStore.getState().updateCurrentUserPlaylists(user.playlists);
    return user;
}
