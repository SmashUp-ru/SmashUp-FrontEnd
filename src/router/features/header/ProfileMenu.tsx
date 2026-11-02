import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import GavelIcon from '@/components/icons/gavel/Gavel32';
import DoorIcon from '@/components/icons/door/Door32';
import ProfileIcon from '@/components/icons/Profile.tsx';
import AddMashupIcon from '@/components/icons/addMashup/AddMashup32';
import SettingsIcon from '@/components/icons/Settings';
import { useGlobalStore } from '@/store/global.ts';
import { isModerator } from '@/lib/bitmask';
import { coverUrl } from '@/lib/cdn.ts';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';
import LogoutDialog from '@/router/features/auth/LogoutDialog.tsx';

const ITEM_ICON = 'shrink-0 group-data-[highlighted]:text-primary';

/**
 * Меню профиля в шапке. Раньше это была ВСПЛЫВАЮЩАЯ ПОДСКАЗКА с кнопками внутри:
 * открывалась только наведением (на тач-экране и с клавиатуры — никак), ссылка на
 * профиль была вложена в кнопку-триггер (невалидная разметка), а «Выйти»
 * срабатывал в один клик. Теперь — обычное выпадающее меню по клику.
 */
export default function ProfileMenu() {
    const currentUser = useGlobalStore((state) => state.currentUser);
    const isMobile = useIsMobile();
    const [logoutOpen, setLogoutOpen] = useState(false);

    // На мобайле меню профиля заменяет бургер в хедере (открывает drawer с профилем/действиями).
    if (isMobile) return null;

    if (!currentUser)
        return (
            <div className='flex gap-2 md:gap-2.5 shrink-0 items-center'>
                <Link
                    to='/login'
                    className='whitespace-nowrap bg-primary text-surface rounded-2xl px-3 py-2 text-[13px] md:px-5 md:py-[11px] md:text-[15px] font-medium hover:bg-hoverPrimary'
                    draggable={false}
                >
                    Войти
                </Link>
                <Link
                    to='/register'
                    className='hidden md:inline-block whitespace-nowrap bg-onPrimary text-onSurface rounded-2xl px-5 py-[11px] text-[15px] font-medium hover:bg-hoverPrimary/[0.2] hover:text-primary'
                    draggable={false}
                >
                    Зарегистрироваться
                </Link>
            </div>
        );

    return (
        <>
            {/* modal={false}: из пункта меню открывается диалог выхода — у модального
                меню Radix оставляет на body pointer-events:none, и страница «замирает». */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    aria-label='Меню профиля'
                    className='shrink-0 rounded-full outline outline-2 outline-offset-2 outline-transparent transition-[outline-color] duration-200 hover:outline-onSurface/20 aria-expanded:outline-primary focus-visible:outline-primary'
                >
                    <Avatar className='w-12 h-12'>
                        <AvatarImage src={coverUrl('user', currentUser.imageUrl, 100)} alt='' />
                        <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' sideOffset={8} className='min-w-[14rem]'>
                    <DropdownMenuLabel className='truncate normal-case text-sm text-onSurface'>
                        {currentUser.username}
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link to={`/user/${encodeURIComponent(currentUser.username)}`}>
                            <ProfileIcon size={24} color='onSurface' className={ITEM_ICON} />
                            Мой профиль
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to='/mashup/upload'>
                            <AddMashupIcon size={24} color='onSurface' className={ITEM_ICON} />
                            Загрузить мешап
                        </Link>
                    </DropdownMenuItem>
                    {isModerator(currentUser.permissions) && (
                        <DropdownMenuItem asChild>
                            <Link to='/mashup/moderation'>
                                <GavelIcon size={24} color='onSurface' className={ITEM_ICON} />
                                Модерация
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link to='/settings'>
                            <SettingsIcon size={24} color='onSurface' className={ITEM_ICON} />
                            Настройки
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className='text-error data-[highlighted]:text-error data-[highlighted]:bg-error/15'
                        onSelect={() => setLogoutOpen(true)}
                    >
                        <DoorIcon size={24} color='error' className='shrink-0' />
                        Выйти
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
        </>
    );
}
