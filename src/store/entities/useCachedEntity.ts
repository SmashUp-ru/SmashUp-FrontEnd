import { useEffect, useMemo } from 'react';

/**
 * Реактивно отдаёт сущность из кэша entity-стора по строковому id, подгружая её,
 * если в кэше ещё нет. Общий примитив для *PageData-хуков, работающих через кэш
 * (mashup, playlist) — раньше один и тот же useMemo+useEffect дублировался в каждом.
 *
 * Имперартивные хуки (user/favorites) намеренно НЕ используют его — у них своя
 * логика (срез top-5, кастомный эндпоинт лайков), и обобщение было бы хуже дубля.
 */
export function useCachedEntityById<T>(
    id: string | undefined,
    getOneById: (id: number) => Promise<T>,
    cache: Record<number, T>
): { entity: T | null; isLoading: boolean } {
    const entity = useMemo(() => {
        if (!id) return null;
        return cache[parseInt(id)] ?? null;
    }, [id, cache]);

    const isLoading = useMemo(() => id !== undefined && !entity, [id, entity]);

    useEffect(() => {
        if (id && !entity) {
            getOneById(parseInt(id)).catch(console.error);
        }
    }, [id, entity, getOneById]);

    return { entity, isLoading };
}
