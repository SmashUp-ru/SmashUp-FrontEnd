import { axiosSession } from '@/lib/utils.ts';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup.ts';

export type VkFlowKind = 'link' | 'authorize';

// Куда VK вернёт пользователя: текущий домен (прод, бета, localhost).
// Бэк пускает только белый список origin'ов и хранит этот же адрес для обмена кода.
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

// Берём OAuth-URL у бэка и уводим туда как есть. state генерирует бэк: для привязки он
// его проверяет сам (одноразовый, 10 минут, привязан к пользователю), для входа — нет,
// там единственная защита от login CSRF — наша проверка в колбэке.
export async function startVkFlow(kind: VkFlowKind): Promise<void> {
    const res: AxiosSmashUpResponse<string> = await axiosSession.get(`/vk/${kind}/url`, {
        params: { redirect_uri: vkRedirectUri(kind) }
    });
    const state = new URL(res.data.response).searchParams.get('state');
    if (!state) throw new Error('VK OAuth URL без state');
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ kind, state }));
    window.location.href = res.data.response;
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
