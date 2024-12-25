import { useSettingsPageData } from '@/router/features/settings/useSettingsPageData.ts';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import ChevronRightIcon from '@/components/icons/ChevronRight.tsx';
import { Link } from 'react-router-dom';
import VKIcon from '@/components/icons/VK.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import { explicitAllowed, multisessionAllowed } from '@/lib/bitmask.ts';
import { Slider } from '@/components/ui/slider.tsx';
import SettingsPageSkeleton from '@/router/pages/settings/SettingsPageSkeleton.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function SettingsPage() {
    const { settings, isLoading, email } = useSettingsPageData();

    const currentUser = useGlobalStore((state) => state.currentUser);

    const [imageLoaded, setImageLoaded] = useState(false);

    const [username, setUsername] = useState('');
    const [allowMultisessions, setAllowMultisessions] = useState(false);
    const [showExplicit, setShowExplicit] = useState(false);
    const [bitrate, setBitrate] = useState(3);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username);
        }
    }, [currentUser]);

    useEffect(() => {
        if (settings !== null) {
            setAllowMultisessions(multisessionAllowed(settings));
            setShowExplicit(explicitAllowed(settings));
        }
    }, [settings]);

    if (!currentUser) return null;
    if (isLoading) return <SettingsPageSkeleton />;

    return (
        <section className='flex flex-col gap-y-6 pr-[35px]'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>Настройки</h1>
            </div>
            <div className='w-full flex gap-x-12'>
                <label className='relative cursor-pointer h-fit'>
                    {!imageLoaded && (
                        <Skeleton className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full' />
                    )}
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${currentUser.imageUrl}_800x800.png`}
                        alt={currentUser.username}
                        className={cn(
                            'w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-full brightness-50',
                            !imageLoaded && 'hidden'
                        )}
                        draggable={false}
                        onLoad={() => setImageLoaded(true)}
                    />
                    <EditIcon
                        size={70}
                        className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                        color='onSurface'
                    />
                    <Input type='file' className='hidden' />
                </label>
                {/*настройки*/}
                <div className='w-full flex flex-col gap-y-[75px]'>
                    {/*настройки профиля*/}
                    <div className='w-full flex flex-col gap-y-[30px]'>
                        <h2 className='font-bold text-[32px]'>Настройки профиля</h2>
                        <div className='w-full'>
                            <Label className='font-medium text-onSurfaceVariant'>
                                Отображаемый никнейм
                            </Label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='p-0 bg-transparent font-bold text-[24px]'
                                disabled
                            />
                        </div>

                        <div className='w-full'>
                            <Label className='font-medium text-onSurfaceVariant'>Почта</Label>
                            <Input
                                value={email ? email : 'а где'}
                                className='p-0 bg-transparent font-bold text-[24px]'
                                disabled
                            />
                        </div>

                        <div className='grid grid-cols-3 gap-x-20'>
                            <div className='w-full'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Текущий пароль
                                </Label>
                                <Input
                                    id='password'
                                    value=''
                                    disabled
                                    placeholder='Текущий пароль'
                                    className='p-0 bg-transparent font-bold text-[24px] placeholder:text-onPrimary'
                                />
                            </div>

                            <div className='w-full'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Новый пароль
                                </Label>
                                <Input
                                    id='newPassword'
                                    value=''
                                    disabled
                                    placeholder='Новый пароль'
                                    className='p-0 bg-transparent font-bold text-[24px] placeholder:text-onPrimary'
                                />
                            </div>

                            <div className='w-full'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Новый еще раз
                                </Label>
                                <Input
                                    id='newPasswordAgain'
                                    value=''
                                    disabled
                                    placeholder='Новый пароль'
                                    className='p-0 bg-transparent font-bold text-[24px] placeholder:text-onPrimary'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-x-20'>
                            <Link to='#' className='flex items-center justify-between'>
                                <div className='flex gap-x-[25px] items-center'>
                                    <VKIcon size={32} />
                                    <div className='flex flex-col'>
                                        <span className='font-medium text-onSurfaceVariant'>
                                            Не подключено
                                        </span>
                                        <span className='font-bold text-[24px] text-onSurface'>
                                            VK
                                        </span>
                                    </div>
                                </div>
                                <ChevronRightIcon width={13} height={23} />
                            </Link>
                        </div>
                    </div>

                    {/*настройки аккаунта*/}
                    <div className='w-full flex flex-col gap-y-[30px]'>
                        <h2 className='font-bold text-[32px]'>Настройки профиля</h2>
                        <div className='grid grid-cols-3 gap-x-20 items-center'>
                            <div className='flex items-center gap-x-10'>
                                <Label className='w-1/2 font-medium text-[18px] text-onSurfaceVariant'>
                                    Битрейт мэшапов
                                </Label>
                                <div className='w-full relative'>
                                    <Slider
                                        min={0}
                                        max={4}
                                        step={1}
                                        value={[bitrate]}
                                        showMarks={true}
                                        onValueChange={(v) => setBitrate(v[0])}
                                        className='z-30'
                                        rangeClassName='bg-primary'
                                        thumbClassName='bg-onSurface h-[30px] w-2.5 rounded-[2.8px]'
                                        captions={['64', '96', '128', '160', 'Ориг']}
                                    />
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label className='font-medium text-[18px] text-onSurfaceVariant'>
                                    Разрешить мультисессии
                                </Label>
                                <Switch
                                    checked={allowMultisessions}
                                    onCheckedChange={(v) => setAllowMultisessions(v)}
                                    className='h-8 w-16 '
                                    thumbClassName='h-8 w-8 data-[state=checked]:translate-x-7'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label className='font-medium text-[18px] text-onSurfaceVariant'>
                                    Показывать Explicit-контент
                                </Label>
                                <Switch
                                    className='h-8 w-16 '
                                    checked={showExplicit}
                                    onCheckedChange={(v) => setShowExplicit(v)}
                                    thumbClassName='h-8 w-8 data-[state=checked]:translate-x-7'
                                />
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    {/*<div className="bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6">*/}
                    {/*    <Button className="w-[460px]">Сохранить</Button>*/}
                    {/*    <Button*/}
                    {/*        className="w-[230px] bg-surfaceVariant text-onBackground hover:bg-surfaceVariant/90 hover:text-onBackground/90">Отменить</Button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </section>
    );
}
