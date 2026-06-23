import { useEffect } from 'react';

const BASE = 'SmashUp';

/**
 * Устанавливает `document.title` для текущей страницы (вкладка и история браузера).
 * Передай `null`/`undefined`, пока заголовок неизвестен (например, данные грузятся) —
 * тогда показывается базовый «SmashUp». При размонтировании заголовок сбрасывается.
 *
 * Это дешёвый частичный SEO-win для SPA без SSR (за соц-карточки `og:*` не отвечает).
 */
export function useDocumentTitle(title?: string | null) {
    useEffect(() => {
        document.title = title ? `${title} · ${BASE}` : BASE;
        return () => {
            document.title = BASE;
        };
    }, [title]);
}
