import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import VKIcon from '@/components/icons/VK.tsx';
import MailIcon from '@/components/icons/Mail.tsx';

export default function LoginPage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Вход</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Добро пожаловать снова!
                    </span>
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

                    {/*Пароль*/}
                    <div className='w-full flex flex-col gap-y-2.5'>
                        <div className='w-full flex justify-between items-center'>
                            <Label htmlFor='password' className='font-medium text-onSurfaceVariant'>
                                Пароль
                            </Label>
                            <Link
                                draggable={false}
                                className='font-medium text-primary'
                                to='/restore-password'
                            >
                                Забыл пароль?
                            </Link>
                        </div>
                        <Input
                            id='password'
                            className='w-full'
                            placeholder='qwerty123'
                            type='password'
                        />
                    </div>

                    {/*Запомнить*/}
                    <div className='flex items-center gap-x-4'>
                        <Checkbox id='remember' />
                        <Label htmlFor='remember' className='text-onSurface font-medium'>
                            Запомнить меня
                        </Label>
                    </div>

                    <Button>Войти</Button>
                </form>

                {/*Сепаратор*/}
                <div className='flex items-center justify-between w-full text-onSurfaceVariant'>
                    <Separator className='w-[30%]' />
                    <span className='font-medium'>Войти с помощью</span>
                    <Separator className='w-[30%]' />
                </div>

                <div className='flex flex-col gap-y-4 w-full items-center'>
                    {/*ВКИД*/}
                    <Button className='w-full py-[15px]' variant='outline'>
                        <VKIcon />
                        VK ID
                    </Button>

                    {/*Нет аккаунта?*/}
                    <div className='flex items-center gap-x-2.5'>
                        <span className='font-medium text-onSurfaceVariant'>Нет аккаунта?</span>
                        <Link draggable={false} className='font-bold text-primary' to='/register'>
                            Зарегистрируйтесь
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
