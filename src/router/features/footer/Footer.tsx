import { useGlobalStore } from '@/store/global.ts';
import { Link } from 'react-router-dom';

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
                </div>
                <span className='text-primary font-bold'>2024 SmashUp</span>
            </div>
            <span className='font-medium text-onSurfaceVariant'>
                Сервис <Link to='https://smashup.ru' /> может содержать информацию, не
                предназначенную для несовершеннолетних
            </span>
        </div>
    );
}
