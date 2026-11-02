import { axiosSession } from '@/lib/utils.ts';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup.ts';

export type VkFlowKind = 'link' | 'authorize';

// Куда VK вернёт пользователя после авторизации. Всегда текущий домен —
// а не зашитый на бэке https://smashup.ru — чтобы связка работала и на бете, и локально.
//
// ВАЖНО: бэк ДОЛЖЕН использовать этот же redirect_uri при обмене code у VK
// (в /vk/link и /vk/authorize). Сейчас он его хардкодит на smashup.ru → на других
// доменах VK ответит "redirect_uri mismatch". Мы передаём redirect_uri параметром
// в callback, чтобы бэк мог его подхватить, как только это поддержит.
export function vkRedirectUri(kind: VkFlowKind): string {
    return `${window.location.origin}/vk/${kind}`;
}

// Защита от подброшенного кода (OAuth CSRF): без неё злоумышленник начинает
// привязку СВОЕГО VK, забирает code и даёт жертве ссылку /vk/link?code=… —
// колбэк сам отправит код с токеном жертвы, и к её аккаунту привяжется чужой VK
// (дальше вход через VK = вход в аккаунт жертвы). Поэтому перед уходом на VK
// запоминаем state в sessionStorage ЭТОЙ вкладки и в колбэке принимаем code
// только при совпадении: подложить значение в чужой sessionStorage нельзя.
const STATE_KEY = 'smashup_vk_oauth_state';

// Получаем OAuth-URL у бэка, подменяем в нём redirect_uri на текущий домен и уводим туда.
export async function startVkFlow(kind: VkFlowKind): Promise<void> {
    const res: AxiosSmashUpResponse<string> = await axiosSession.get(`/vk/${kind}/url`);
    const url = new URL(res.data.response);
    url.searchParams.set('redirect_uri', vkRedirectUri(kind));
    // Если бэк уже кладёт свой state — сохраняем его, чтобы не сломать его проверку.
    const state = url.searchParams.get('state') || crypto.randomUUID();
    url.searchParams.set('state', state);
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ kind, state }));
    window.location.href = url.toString();
}

/**
 * Проверяет state из колбэка VK и сразу его сжигает (одноразовый).
 * `false` — код пришёл не из потока, начатого в этой вкладке: отправлять его на бэк нельзя.
 */
export function consumeVkState(kind: VkFlowKind, received: string | null): boolean {
    const raw = sessionStorage.getItem(STATE_KEY);
    sessionStorage.removeItem(STATE_KEY);
    if (!raw || !received) return false;
    try {
        const stored = JSON.parse(raw) as { kind?: string; state?: string };
        return stored.kind === kind && stored.state === received;
    } catch {
        return false;
    }
}

// Привязан ли VK ID к текущему аккаунту. Возвращает vkId или null.
export async function getVkId(): Promise<number | null> {
    const res: AxiosSmashUpResponse<{ vkId: number | null }> =
        await axiosSession.get('/user/get_vk_id');
    return res.data.response?.vkId ?? null;
}
