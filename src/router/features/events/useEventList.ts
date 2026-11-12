import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import { SmashUpEvent, useEventStore } from '@/store/entities/event.ts';
import { SmashUpResponse } from '@/router/shared/types/smashup.ts';

/**
 * Список мероприятий (`upcoming` / `past` / `by_user?id=`). Ответ кладём и в кэш стора,
 * чтобы страница мероприятия открывалась без запроса. Перезапрос при смене токена:
 * в ответе `going` текущего пользователя, а админ видит ещё и черновики.
 */
export function useEventList(path: string | null) {
    const token = useGlobalStore((s) => s.token);
    const [events, setEvents] = useState<SmashUpEvent[]>([]);
    const [isLoading, setIsLoading] = useState(path !== null);
    const [isError, setIsError] = useState(false);
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
        if (path === null) return;
        let cancelled = false;
        setIsLoading(true);
        setIsError(false);
        axiosSession
            .get(`/event/${path}`)
            .then((r: AxiosResponse<SmashUpResponse<SmashUpEvent[]>>) => {
                if (cancelled) return;
                const update = useEventStore.getState().updateOneById;
                r.data.response.forEach((e) => update(e.id, e));
                setEvents(r.data.response);
            })
            .catch(() => !cancelled && setIsError(true))
            .finally(() => !cancelled && setIsLoading(false));
        return () => {
            cancelled = true;
        };
    }, [path, token, nonce]);

    return { events, isLoading, isError, reload: useCallback(() => setNonce((n) => n + 1), []) };
}
