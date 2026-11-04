import { useCallback, useRef, useState } from 'react';

/**
 * Анти-дабл-сабмит для форм-диалогов.
 *
 * Возвращает флаг `sent` (для `disabled` на кнопке) и `guard`, оборачивающий
 * async-сабмит: повторный вызов во время отправки игнорируется, по завершении
 * (успех или ошибка) `sent` сбрасывается. Заменяет ручной паттерн
 * `if (sent) return; setSent(true); … finally setSent(false)`.
 *
 * Применяется только там, где этот паттерн реально дублировался (диалоги
 * AddPlaylist / UploadYouTubeTrack). MashupForm со своим loading-флоу не трогаем.
 */
export function useSubmitGuard() {
    const [sent, setSent] = useState(false);
    // Проверка по ref, а не по `sent`: стейт обновится только после ре-рендера,
    // и два клика в одном тике оба видели `sent === false` (двойная отправка).
    const inFlight = useRef(false);

    const guard = useCallback(async (submit: () => Promise<void> | void) => {
        if (inFlight.current) return;
        inFlight.current = true;
        setSent(true);
        try {
            await submit();
        } finally {
            inFlight.current = false;
            setSent(false);
        }
    }, []);

    return { sent, guard };
}
