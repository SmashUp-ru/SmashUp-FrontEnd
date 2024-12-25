import { getToken, useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useEmail() {
    const { currentUser, email, updateEmail } = useGlobalStore();

    const [emailLoading, setEmailLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            if (email === null) {
                axiosSession
                    .get('/user/get_email', {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    })
                    .then(
                        (
                            r: AxiosResponse<{
                                status: string;
                                response: {
                                    email: string;
                                };
                            }>
                        ) => {
                            updateEmail(r.data.response.email);
                        }
                    );
            }
            setEmailLoading(false);
        }
    }, [currentUser]);

    return {
        isLoading: emailLoading,
        email: email === null ? '' : email
    };
}
