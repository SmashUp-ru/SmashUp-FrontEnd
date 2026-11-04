import { isAlt, isHashtagMashup, setAlt, setHashtagMashup } from '@/lib/bitmask.ts';

export type StatusKind = 'base' | 'alt' | 'none';

/**
 * Пабликами VK различаются основа и альт: пост `vk.com/wall-{ownerId}_{postId}`.
 * Те же owner-ID, что в iOS (`UnpublishedMashup.vkLinkKind`) и в спеке Android.
 * «Основа» — бит хэштег-мешапа (#), «альт» — бит alt.
 */
const VK_PUBLIC: Record<string, StatusKind> = {
    '39786657': 'base',
    '158693521': 'alt'
};

/** Что означает ссылка: основа, альт или неизвестно (`null` — по ссылке не определить). */
export function statusKindFromLink(link: string | null | undefined): StatusKind | null {
    if (!link || !/(^|\/\/|\.)vk\.(com|ru)\//.test(link)) return null;
    const owner = link.match(/wall-(\d+)_/)?.[1];
    return (owner && VK_PUBLIC[owner]) || null;
}

export function statusKindOf(statuses: number): StatusKind {
    if (isHashtagMashup(statuses)) return 'base';
    if (isAlt(statuses)) return 'alt';
    return 'none';
}

/** Маска с выставленным видом: основа и альт взаимоисключающие. */
export function withStatusKind(statuses: number, kind: StatusKind): number {
    return setAlt(setHashtagMashup(statuses, kind === 'base'), kind === 'alt');
}

/**
 * Короткая подпись ссылки для узкой колонки: обычный URL обрезался на
 * «https://vk.ru/wall-…», и как раз различающая часть пропадала.
 */
export function shortStatusLink(link: string): string {
    const post = /(^|\/\/|\.)vk\.(com|ru)\/wall-\d+_(\d+)/.exec(link)?.[3];
    if (post) return `VK · пост ${post}`;
    return link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}
