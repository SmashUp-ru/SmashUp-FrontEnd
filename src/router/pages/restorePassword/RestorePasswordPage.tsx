import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import MailIcon from '@/components/icons/Mail.tsx';

export default function RestorePasswordPage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Восстановление пароля</h1>
                    <span className='font-medium text-onSurfaceVariant'>Чота тут</span>
                </div>

                {/*Форма*/}
                <form className='w-full flex flex-col gap-y-6'>
                    {/*Почта*/}
                    <div className='w-full flex flex-col gap-y-2.5'>
                        <Label htmlFor='email' className='font-medium text-onSurfaceVariant'>
                            Электронная почта
                        </Label>
                        <Input
                            startIcon={MailIcon}
                            id='email'
                            className='w-full'
                            placeholder='sanya@smashup.ru'
                        />
                    </div>

                    <Button>Подтвердить</Button>
                </form>
            </div>
        </div>
    );
}
