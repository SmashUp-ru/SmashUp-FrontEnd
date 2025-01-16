import { useGlobalStore } from '@/store/global.ts';
import { Link } from 'react-router-dom';
import VKMPIcon from '@/components/icons/VKMP.tsx';
import TelegramIcon from '@/components/icons/Telegram.tsx';

export default function Footer() {
    const { isLoading } = useGlobalStore();

    if (isLoading) return null;

    return (
        <div className='flex flex-col gap-y-2 mt-5'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-x-8 font-bold text-onSurface'>
                    <Link to='/privacy_policy'>Политика Конфиденциальности</Link>
                    <Link to='/user_agreement'>Пользовательское соглашение</Link>
                    <Link to='/dmca'>Правообладателям</Link>
                    <Link to='https://t.me/smashup_ru' target='_blank' className='flex gap-2'>
                        <TelegramIcon /> Наш телеграм-канал
                    </Link>
                    <Link to='https://vk.com/smashupru' target='_blank' className='flex gap-2'>
                        <VKMPIcon />
                        Наша группа в ВК
                    </Link>
                </div>
                <span className='text-primary font-bold'>2025 SmashUp</span>
            </div>
            <span className='font-medium text-onSurfaceVariant'>
                Сервис <Link to='https://smashup.ru' /> может содержать информацию, не
                предназначенную для несовершеннолетних
            </span>
        </div>
    );
}
