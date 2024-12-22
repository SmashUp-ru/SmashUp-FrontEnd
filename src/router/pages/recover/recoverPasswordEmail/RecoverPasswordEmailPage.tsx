import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

export default function RecoverPasswordEmailPage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Восстановление пароля</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        На вашу почту было отправлено письмо с ссылкой на восстановление пароля.
                    </span>
                </div>

                <Button asChild className='w-full'>
                    <Link draggable={false} to='/public'>
                        Вернуться на главную
                    </Link>
                </Button>
            </div>
        </div>
    );
}
