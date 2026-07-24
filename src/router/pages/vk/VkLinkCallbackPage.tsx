import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosSession } from '@/lib/utils.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { vkRedirectUri } from '@/lib/vk.ts';

// Callback, на который VK возвращает пользователя после привязки: /vk/link?code=...
// Меняем code на привязку у бэка и уводим обратно в настройки.
export default function VkLinkCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const ran = useRef(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const code = searchParams.get('code');
        if (!code) {
            navigate('/settings', { replace: true });
            return;
        }

        axiosSession
            .get('/vk/link', { params: { code, redirect_uri: vkRedirectUri('link') } })
            .then(() => {
                toast({ element: <BaseToast icon field='VK ID' after='успешно привязан!' /> });
                navigate('/settings', { replace: true });
            })
            .catch((e) => {
                setFailed(true);
                try {
                    axiosCatcher(toast, 'при привязке VK')(e);
                } catch {
                    // axiosCatcher показывает тост и перебрасывает по контракту — UI уже отрисовал ошибку
                }
            });
    }, [navigate, searchParams, toast]);

    return (
        <section className='flex flex-col items-center justify-center gap-y-4 h-full py-20 text-center'>
            <span className='font-bold text-xl text-onSurface'>
                {failed ? 'Не удалось привязать VK' : 'Привязываем VK…'}
            </span>
            {failed && (
                <button
                    type='button'
                    onClick={() => navigate('/settings', { replace: true })}
                    className='font-bold text-primary hover:text-hoverPrimary'
                >
                    Вернуться в настройки
                </button>
            )}
        </section>
    );
}
