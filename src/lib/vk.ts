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

// Получаем OAuth-URL у бэка, подменяем в нём redirect_uri на текущий домен и уводим туда.
export async function startVkFlow(kind: VkFlowKind): Promise<void> {
    const res: AxiosSmashUpResponse<string> = await axiosSession.get(`/vk/${kind}/url`);
    const url = new URL(res.data.response);
    url.searchParams.set('redirect_uri', vkRedirectUri(kind));
    window.location.href = url.toString();
}

// Привязан ли VK ID к текущему аккаунту. Возвращает vkId или null.
export async function getVkId(): Promise<number | null> {
    const res: AxiosSmashUpResponse<{ vkId: number | null }> =
        await axiosSession.get('/user/get_vk_id');
    return res.data.response?.vkId ?? null;
}
