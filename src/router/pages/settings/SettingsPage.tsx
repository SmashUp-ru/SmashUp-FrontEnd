import { useSettingsPageData } from '@/router/features/settings/useSettingsPageData.ts';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import VKIcon from '@/components/icons/VK.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { explicitAllowed, multisessionAllowed } from '@/lib/bitmask.ts';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import SettingsPageSkeleton from '@/router/pages/settings/SettingsPageSkeleton.tsx';
import { useGlobalStore } from '@/store/global.ts';
import UsernameDialog from '@/router/features/settings/UsernameDialog.tsx';
import EmailDialog from '@/router/features/settings/EmailDialog.tsx';
import PasswordDialog from '@/router/features/settings/PasswordDialog.tsx';
import UpdateAvatar from '@/router/features/settings/UpdateAvatar.tsx';
import { BITRATE_OPTIONS, BITRATES, useSettingsStore } from '@/store/settings.ts';
import { startVkFlow, getVkId } from '@/lib/vk.ts';
import { axiosSession } from '@/lib/utils.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';

export default function SettingsPage() {
    useDocumentTitle('Настройки');
    const { toast } = useToast();
    const { settings, isLoading, email } = useSettingsPageData();

    const bitrate = useSettingsStore((state) => state.bitrate);
    const updateBitrate = useSettingsStore((state) => state.updateBitrate);
    const updateSettings = useSettingsStore((state) => state.updateSettingsBitmask);

    const currentUser = useGlobalStore((state) => state.currentUser);

    const [allowMultisessions, setAllowMultisessions] = useState(false);
    const [showExplicit, setShowExplicit] = useState(false);

    useEffect(() => {
        if (settings !== null) {
            setAllowMultisessions(multisessionAllowed(settings));
            setShowExplicit(explicitAllowed(settings));
        }
    }, [settings]);

    // undefined = грузим / эндпоинт недоступен; null = не привязан; number = привязан
    const [vkId, setVkId] = useState<number | null | undefined>(undefined);
    const vkConnected = vkId != null;

    useEffect(() => {
        getVkId()
            .then(setVkId)
            .catch(() => setVkId(null));
    }, []);

    if (!currentUser) return null;
    if (isLoading) return <SettingsPageSkeleton />;

    return (
        <section className='flex flex-col gap-y-6 md:pr-[35px] min-h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-[28px] text-onSurface'>Настройки</h1>
            </div>
            <div className='w-full flex flex-col items-center md:items-start md:flex-row gap-8 md:gap-x-12'>
                <UpdateAvatar />

                {/*настройки*/}
                <div className='w-full flex flex-col gap-y-10 md:gap-y-[75px]'>
                    {/*настройки профиля*/}
                    <div className='w-full flex flex-col gap-y-[30px]'>
                        <h2 className='font-bold text-2xl'>Настройки профиля</h2>
                        <UsernameDialog username={currentUser.username} email={email} />

                        <EmailDialog email={email} />

                        <PasswordDialog email={email} />

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-20'>
                            {vkConnected ? (
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-x-[25px] items-center'>
                                        <VKIcon size={32} />
                                        <div className='flex flex-col items-start'>
                                            <span className='font-medium text-onSurfaceVariant'>
                                                Подключено
                                            </span>
                                            <span className='font-bold text-xl text-onSurface'>
                                                VK
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type='button'
                                    onClick={() =>
                                        startVkFlow('link').catch(
                                            axiosCatcher(toast, 'при подключении VK')
                                        )
                                    }
                                    className='flex items-center justify-between hover:opacity-80 transition-opacity'
                                >
                                    <div className='flex gap-x-[25px] items-center'>
                                        <VKIcon size={32} />
                                        <div className='flex flex-col items-start'>
                                            <span className='font-medium text-onSurfaceVariant'>
                                                Не подключено
                                            </span>
                                            <span className='font-bold text-xl text-onSurface'>
                                                VK
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon size={32} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/*настройки приложения*/}
                    <div className='w-full flex flex-col gap-y-[30px] mb-[30px]'>
                        <h2 className='font-bold text-2xl'>Настройки приложения</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-x-20 lg:gap-y-20 items-center'>
                            {/* Лейбл НАД контролом: так сегменты получают всю ширину
                                ячейки (при label-сбоку «Ориг» клипался в узкой
                                grid-ячейке). Настройки остаются в одну строку. */}
                            <div className='flex flex-col items-start gap-y-3'>
                                <Label className='shrink-0 font-medium text-[15px] text-onSurfaceVariant'>
                                    Битрейт мэшапов
                                </Label>
                                <div className='w-full min-w-0 max-w-[360px]'>
                                    <SegmentedControl
                                        aria-label='Битрейт мэшапов'
                                        value={bitrate}
                                        onChange={(v) => updateBitrate(v as keyof typeof BITRATES)}
                                        options={BITRATE_OPTIONS}
                                    />
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label className='font-medium text-[15px] text-onSurfaceVariant'>
                                    Разрешить мультисессии
                                </Label>
                                <Switch
                                    checked={allowMultisessions}
                                    onCheckedChange={(v) => {
                                        setAllowMultisessions(v);
                                        axiosSession
                                            .post(
                                                `/user/change_setting?bit=1&value=${v ? '1' : '0'}`
                                            )
                                            .then(() => {
                                                toast({
                                                    element: (
                                                        <BaseToast
                                                            icon
                                                            field='Настройки'
                                                            after='успешно изменены!'
                                                        />
                                                    )
                                                });
                                                updateSettings(null);
                                            })
                                            .catch(axiosCatcher(toast, 'при обновлении настроек.'));
                                    }}
                                    className='h-8 w-16 '
                                    thumbClassName='h-8 w-8 data-[state=checked]:translate-x-7'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label className='font-medium text-[15px] text-onSurfaceVariant'>
                                    Показывать Explicit-контент
                                </Label>
                                <Switch
                                    className='h-8 w-16 '
                                    checked={showExplicit}
                                    onCheckedChange={(v) => {
                                        setShowExplicit(v);
                                        axiosSession
                                            .post(
                                                `/user/change_setting?bit=0&value=${v ? '1' : '0'}`
                                            )
                                            .then(() => {
                                                toast({
                                                    element: (
                                                        <BaseToast
                                                            icon
                                                            field='Настройки'
                                                            after='успешно изменены!'
                                                        />
                                                    )
                                                });
                                                updateSettings(null);
                                            })
                                            .catch(axiosCatcher(toast, 'при обновлении настроек.'));
                                    }}
                                    thumbClassName='h-8 w-8 data-[state=checked]:translate-x-7'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* mt-auto — футтер прижат к низу, даже когда контент короче экрана */}
            <div className='mt-auto pt-6'>
                <Footer />
            </div>
        </section>
    );
}
