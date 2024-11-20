import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function RestorePasswordUpdatePage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Восстановление пароля</h1>
                    <span className='font-medium text-onSurfaceVariant'>Не забывайте!</span>
                </div>

                {/*Форма*/}
                <form className='w-full flex flex-col gap-y-6'>
                    {/*Новый пароль*/}
                    <div className='w-full flex flex-col gap-y-2.5'>
                        <Label htmlFor='password' className='font-medium text-onSurfaceVariant'>
                            Новый пароль
                        </Label>
                        <Input
                            type='password'
                            id='password'
                            className='w-full'
                            placeholder='qwerty123'
                        />
                    </div>

                    {/*Подтверждение пароля*/}
                    <div className='w-full flex flex-col gap-y-2.5'>
                        <Label
                            htmlFor='password-confirm'
                            className='font-medium text-onSurfaceVariant'
                        >
                            Подтверждение пароля
                        </Label>
                        <Input
                            type='password'
                            id='password-confirm'
                            className='w-full'
                            placeholder='qwerty123'
                        />
                    </div>

                    <Button>Подтвердить</Button>
                </form>
            </div>
        </div>
    );
}
