import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosSession } from '@/lib/utils.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useUserStore } from '@/store/entities/user.ts';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup.ts';
import { vkRedirectUri } from '@/lib/vk.ts';

// Элемент ответа /vk/authorize. Форма задокументирована, но живьём не проверялась
// (нужен реальный VK-код), поэтому парсим защитно.
interface VkAuthorizeItem {
    token?: string;
    loggedIn?: boolean;
    vkId?: number | null;
    email?: string;
}

// Callback авторизации/регистрации через VK: /vk/authorize?code=...
// Бэк возвращает либо залогиненного пользователя с токеном (вход),
// либо VK-метаданные (vkId, email) для регистрации.
export default function VkAuthorizeCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { updateToken, updateCurrentUser } = useGlobalStore();
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const ran = useRef(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const code = searchParams.get('code');
        if (!code) {
            navigate('/login', { replace: true });
            return;
        }

        axiosSession
            .get('/vk/authorize', { params: { code, redirect_uri: vkRedirectUri('authorize') } })
            .then(async (r: AxiosSmashUpResponse<VkAuthorizeItem | VkAuthorizeItem[]>) => {
                const data = r.data.response;
                const items: VkAuthorizeItem[] = Array.isArray(data) ? data : [data];

                // 1) уже зарегистрирован → вход по токену
                const loggedIn = items.find((it) => it && it.loggedIn === true && !!it.token);
                if (loggedIn && loggedIn.token) {
                    updateToken(loggedIn.token);
                    localStorage.setItem('smashup_token', loggedIn.token);
                    const user = await getUserByToken('token', loggedIn.token);
                    updateCurrentUser(user);
                    navigate('/', { replace: true });
                    return;
                }

                // 2) не зарегистрирован → регистрация с предзаполнением из VK
                const meta = items.find((it) => it && (it.vkId ?? null) !== null);
                if (meta) {
                    navigate('/register', {
                        replace: true,
                        state: { vkId: meta.vkId, email: meta.email }
                    });
                    return;
                }

                setFailed(true);
            })
            .catch((e) => {
                setFailed(true);
                try {
                    axiosCatcher(toast, 'при входе через VK')(e);
                } catch {
                    // axiosCatcher показывает тост и перебрасывает по контракту — UI уже отрисовал ошибку
                }
            });
    }, [navigate, searchParams, toast, updateToken, updateCurrentUser, getUserByToken]);

    return (
        <section className='flex flex-col items-center justify-center gap-y-4 h-full py-20 text-center'>
            <span className='font-bold text-xl text-onSurface'>
                {failed ? 'Не удалось войти через VK' : 'Входим через VK…'}
            </span>
            {failed && (
                <button
                    type='button'
                    onClick={() => navigate('/login', { replace: true })}
                    className='font-bold text-primary hover:text-hoverPrimary'
                >
                    Вернуться ко входу
                </button>
            )}
        </section>
    );
}
