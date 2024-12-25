import { User, useUserStore } from '@/store/entities/user.ts';
import { useEffect, useState } from 'react';
import { getToken } from '@/store/global.ts';

export function useUser(): User | null {
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const [user, setUser] = useState<User | null>(null);

    const token = getToken();

    useEffect(() => {
        if (token) {
            getUserByToken('token', token).then((r) => {
                setUser(r);
            });
        }
    }, [token]);

    if (!token) {
        return null;
    }
    return user;
}
