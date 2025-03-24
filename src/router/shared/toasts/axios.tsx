import errorMessages from '@/assets/error_messages.json';
import { Toast } from '@/router/shared/hooks/use-toast.ts';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';
import ErrorToast from './error.tsx';

export function axiosCatcher(
    toast: (t: Toast) => unknown,
    text?: string
): (r: AxiosSmashUpError<unknown>) => unknown {
    return (r: AxiosSmashUpError<unknown>) => {
        const message = r.response?.data.message;
        let humanMessage = message ? (errorMessages as Record<string, string>)[message] : undefined;
        if (!humanMessage) {
            humanMessage = message;
        }

        if (humanMessage === undefined) {
            if (r.status === 502) {
                humanMessage = 'Сервис недоступен, попробуйте чуть позже';
            } else {
                humanMessage = r.status?.toString();
            }
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
