const BASE = import.meta.env.VITE_BACKEND_URL;

export type CdnEntity = 'mashup' | 'playlist' | 'user' | 'track';
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
