import errorMessages from '@/assets/error_messages.json';
import { Toast } from '@/router/shared/hooks/use-toast.ts';
import { SmashUpResponse } from '@/router/shared/types/smashup.ts';
import { AxiosError } from 'axios';
import ErrorToast from './error.tsx';

export function axiosCatcher(
    toast: (t: Toast) => unknown,
    text?: string
): (r: AxiosError<SmashUpResponse<unknown>>) => unknown {
    return (r: AxiosError<SmashUpResponse<unknown>>) => {
        const message = r.response?.data.message;
        let humanMessage = message ? (errorMessages as Record<string, string>)[message] : undefined;
        if (!humanMessage) {
            humanMessage = message;
        }

        toast({
            element: (
                <ErrorToast
                    icon
                    before={text ? 'Ошибка' : undefined}
                    field={text + (humanMessage ? '. ' : '')}
                    after={humanMessage}
                />
            ),
            duration: 2000,
            variant: 'destructive'
        });

        throw r;
    };
}
