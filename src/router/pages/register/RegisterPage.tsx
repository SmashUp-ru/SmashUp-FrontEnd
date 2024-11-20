import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import VKIcon from '@/components/icons/VK.tsx';
import MailIcon from '@/components/icons/Mail.tsx';
import ProfileIcon from '@/components/icons/Profile.tsx';

export default function RegisterPage() {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Регистрация</h1>
                    <span className='font-medium text-onSurfaceVariant'>Рады знакомству!</span>
                </div>

                {/*Форма*/}
                <form className='w-full flex flex-col gap-y-6'>
                    {/*Псевдоним*/}
                    <div className='w-full flex flex-col gap-y-2.5'>
                        <Label htmlFor='nickname' className='font-medium text-onSurfaceVariant'>
                            Псевдоним
                        </Label>
                        <Input
                            startIcon={ProfileIcon}
                            id='nickname'
                            className='w-full'
                            placeholder='Аркадий Гачибасов'
                        />
                    </div>

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
                        <Label htmlFor='password' className='font-medium text-onSurfaceVariant'>
                            Новый пароль
                        </Label>
                        <Input
                            id='password'
                            className='w-full'
                            placeholder='qwerty123'
                            type='password'
                        />
                    </div>

                    {/*Запомнить*/}
                    <div className='flex items-center gap-x-4'>
                        <Checkbox id='rules' />
                        <Label htmlFor='rules' className='text-onSurface font-medium'>
                            Я принимаю{' '}
                            <Link to='#' className='text-primary'>
                                пользовательское соглашение
                            </Link>
                            <br /> и{' '}
                            <Link to='#' className='text-primary'>
                                политику конфиденциальности
                            </Link>
                        </Label>
                    </div>

                    <Button>Войти</Button>
                </form>

                {/*Сепаратор*/}
                <div className='flex items-center justify-between w-full text-onSurfaceVariant'>
                    <Separator className='w-[20%]' />
                    <span className='font-medium'>Зарегистрироваться с помощью</span>
                    <Separator className='w-[20%]' />
                </div>

                <div className='flex flex-col gap-y-4 w-full items-center'>
                    {/*ВКИД*/}
                    <Button className='w-full py-[15px]' variant='outline'>
                        <VKIcon />
                        VK ID
                    </Button>

                    {/*Есть аккаунт?*/}
                    <div className='flex items-center gap-x-2.5'>
                        <span className='font-medium text-onSurfaceVariant'>
                            Уже зарегистрированы?
                        </span>
                        <Link className='font-bold text-primary' to='/register'>
                            Войдите
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
