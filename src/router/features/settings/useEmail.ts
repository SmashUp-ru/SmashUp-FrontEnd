import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetEmailResponse } from '@/types/api/settings.ts';

export function useEmail() {
    const email = useGlobalStore((state) => state.email);
    const updateEmail = useGlobalStore((state) => state.updateEmail);

    const [isEmailLoading, setEmailLoading] = useState(email === null);

    useEffect(() => {
        if (email === null) {
            axiosSession
                .get('/user/get_email')
                .then((response: AxiosResponse<GetEmailResponse>) =>
                    updateEmail(response.data.response.email)
                )
                .finally(() => setEmailLoading(false));
        }
    }, []);

    return {
        isLoading: isEmailLoading,
        email
    };
}
