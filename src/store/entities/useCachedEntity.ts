import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Реактивно отдаёт сущность из кэша entity-стора по строковому id, подгружая её,
 * если в кэше ещё нет. Общий примитив для *PageData-хуков, работающих через кэш
 * (mashup, playlist) — раньше один и тот же useMemo+useEffect дублировался в каждом.
 *
 * Имперартивные хуки (user/favorites) намеренно НЕ используют его — у них своя
 * логика (срез top-5, кастомный эндпоинт лайков), и обобщение было бы хуже дубля.
 *
 * Раньше ошибка загрузки глоталась (`.catch(console.error)`): entity оставался
 * null, isLoading — навсегда true (бесконечный скелетон). Теперь ошибка поднимает
 * флаг isError и снимает загрузку, а reload позволяет повторить попытку.
 */
export function useCachedEntityById<T>(
    id: string | undefined,
    getOneById: (id: number) => Promise<T>,
    cache: Record<number, T>
): { entity: T | null; isLoading: boolean; isError: boolean; reload: () => void } {
    const entity = useMemo(() => {
        if (!id) return null;
        return cache[parseInt(id)] ?? null;
    }, [id, cache]);

    const [isError, setIsError] = useState(false);

    const load = useCallback(() => {
        if (!id) return;
        setIsError(false);
        getOneById(parseInt(id)).catch(() => setIsError(true));
    }, [id, getOneById]);

    const isLoading = useMemo(() => id !== undefined && !entity && !isError, [id, entity, isError]);

    useEffect(() => {
        if (id && !entity) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, entity]);

    return { entity, isLoading, isError, reload: load };
}
