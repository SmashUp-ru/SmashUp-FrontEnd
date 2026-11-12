const BASE = import.meta.env.VITE_BACKEND_URL;

export type CdnEntity = 'mashup' | 'playlist' | 'user' | 'track' | 'event';
export type CoverSize = 100 | 400 | 800;

/**
 * URL обложки сущности из CDN:
 *   {BASE}/uploads/{entity}/{imageUrl}_{size}x{size}.png
 *
 * Для дефолтной обложки передайте `imageUrl = 'default'`.
 * Заменяет ~30 ручных конкатенаций этого шаблона по проекту.
 */
export function coverUrl(
    entity: CdnEntity,
    imageUrl: string | number,
    size: CoverSize = 100
): string {
    return `${BASE}/uploads/${entity}/${imageUrl}_${size}x${size}.png`;
}

/** URL аудио мешапа: {BASE}/uploads/mashup/{id}.mp3?bitrate={bitrate} */
export function mashupAudioUrl(id: number, bitrate: number): string {
    return `${BASE}/uploads/mashup/${id}.mp3?bitrate=${bitrate}`;
}

/** Вертикальная афиша мероприятия 4:5 (1080×1350): {BASE}/uploads/event/{imageUrl}_portrait.jpg */
export function eventPortraitUrl(imageUrl: string): string {
    return `${BASE}/uploads/event/${imageUrl}_portrait.jpg`;
}

/** Широкий баннер мероприятия 16:9 (1920×1080): {BASE}/uploads/event/{imageUrl}_wide.jpg */
export function eventWideUrl(imageUrl: string): string {
    return `${BASE}/uploads/event/${imageUrl}_wide.jpg`;
}

/** Ассет оформления билета: картинка или шрифт. */
export function ticketAssetUrl(name: string): string {
    return `${BASE}/uploads/ticket/${name}`;
}
