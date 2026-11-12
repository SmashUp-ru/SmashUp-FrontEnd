import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useDebounce } from 'use-debounce';
import { axiosSession } from '@/lib/utils.ts';
import { User } from '@/store/entities/user.ts';
import { UsersSearchResponse } from '@/router/shared/types/search.ts';

/** Поиск пользователей по нику с задержкой 400 мс; короче 2 и длиннее 32 символов — пусто (лимит бэка). */
export function useUserSearch(query: string): User[] {
    const [debounced] = useDebounce(query.trim(), 400);
    const [found, setFound] = useState<User[]>([]);

    useEffect(() => {
        if (debounced.length < 2 || debounced.length > 32) return setFound([]);
        let cancelled = false;
        axiosSession
            .get(`/user/search?query=${encodeURIComponent(debounced)}`)
            .then(
                (r: AxiosResponse<UsersSearchResponse>) => !cancelled && setFound(r.data.response)
            )
            .catch(() => !cancelled && setFound([]));
        return () => {
            cancelled = true;
        };
    }, [debounced]);

    return found;
}
