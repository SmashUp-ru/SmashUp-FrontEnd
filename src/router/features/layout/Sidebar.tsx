import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoIcon from '@/components/icons/Logo.tsx';
import { useGlobalStore } from '@/store/global.ts';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import HomeIcon from '@/components/icons/home/Home32';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePlayerStore } from '@/store/player.ts';
import AddIcon from '@/components/icons/add/Add32';
import AddPlaylistDialog from '@/router/shared/components/playlist/AddPlaylistDialog.tsx';
import { cn } from '@/lib/utils.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import AddMashupIcon from '@/components/icons/addMashup/AddMashup32';
import GavelIcon from '@/components/icons/gavel/Gavel32';
import SettingsIcon from '@/components/icons/Settings';
import DoorIcon from '@/components/icons/door/Door32';
import { isModerator } from '@/lib/bitmask';
import { coverUrl } from '@/lib/cdn.ts';

interface SidebarProps {
    /** Открыт ли мобильный drawer (на десктопе панель всегда видна). */
    open?: boolean;
    onClose?: () => void;
}

/** Подпись пункта меню — видна только в мобильном drawer (на десктопе icon-rail). */
function RowLabel({ children }: { children: string }) {
    return (
        <span className='md:hidden font-bold text-base text-onSurface whitespace-nowrap'>
            {children}
        </span>
    );
}

const rowClass =
    'flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15] md:w-auto md:gap-x-0 md:px-0 md:py-0 md:rounded-none md:hover:bg-transparent md:justify-center';

export default function Sidebar({ open = false, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateToken = useGlobalStore((state) => state.updateToken);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);

    // На десктопе высота уменьшается, чтобы не перекрывать нижний плеер-бар.
    const playerActive = queue.length > 0 || queueIndex >= 0 || moderationSrc !== null;
    const desktopHeight = playerActive ? 'md:h-[calc(100%-148px)]' : 'md:h-[calc(100%-32px)]';

    const logout = () => {
        localStorage.removeItem('smashup_token');
        sessionStorage.removeItem('smashup_token');
        updateToken('');
        updateCurrentUser(null);
        navigate('/');
    };

    return (
        <>
            {/* Затемнение под мобильным drawer */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/60 transition-opacity motion-reduce:transition-none md:hidden',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={onClose}
                aria-hidden
            />

            {/* Панель: на десктопе в потоке, на мобильном — off-canvas drawer */}
            <div
                className={cn(
                    'fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col rounded-r-[30px] bg-surface pt-[64px] transition-transform duration-300 motion-reduce:transition-none',
                    'md:static md:z-auto md:my-4 md:mr-[30px] md:w-[123px] md:rounded-[30px] md:pt-[70px] md:transition-none',
                    desktopHeight,
                    open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
            >
                {/* Логотип */}
                <Link
                    draggable={false}
                    className='px-7 mb-10 md:mb-[70px]'
                    to='/'
                    aria-label='На главную'
                >
                    <LogoIcon color='primary' hoverColor='hoverPrimary' />
                </Link>

                <div className='flex flex-col gap-y-1.5 md:gap-y-12 w-full items-stretch md:items-center px-3 md:px-0'>
                    {/* Навигация */}
                    <Link draggable={false} to={'/'} className={rowClass}>
                        <HomeIcon
                            color={location.pathname === '/' ? 'primary' : 'onSurfaceVariant'}
                            hoverColor={location.pathname === '/' ? 'hoverPrimary' : 'onSurface'}
                        />
                        <RowLabel>Главная</RowLabel>
                    </Link>

                    {currentUser ? (
                        <Link
                            draggable={false}
                            to={'/favorites'}
                            aria-label='Любимые мэшапы'
                            className={rowClass}
                        >
                            <LikeOutlineIcon
                                color={
                                    location.pathname === '/favorites'
                                        ? 'primary'
                                        : 'onSurfaceVariant'
                                }
                                hoverColor={
                                    location.pathname === '/favorites'
                                        ? 'hoverPrimary'
                                        : 'onSurface'
                                }
                            />
                            <RowLabel>Любимое</RowLabel>
                        </Link>
                    ) : (
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger
                                    aria-label='Любимые мэшапы (требуется вход)'
                                    onClick={() => navigate('/login')}
                                    className={rowClass}
                                >
                                    <LikeOutlineIcon color='onSurfaceVariant/50' />
                                    <RowLabel>Любимое</RowLabel>
                                </TooltipTrigger>
                                <TooltipContent
                                    className='max-w-[300px] text-center'
                                    side='right'
                                    sideOffset={64}
                                >
                                    <p>
                                        Зарегистрируйся, чтобы иметь возможность сохранять любимые
                                        мэшапы
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {currentUser ? (
                        <AddPlaylistDialog redirect>
                            <div className={rowClass}>
                                <AddIcon color='onSurfaceVariant' hoverColor='onSurface' />
                                <RowLabel>Создать плейлист</RowLabel>
                            </div>
                        </AddPlaylistDialog>
                    ) : (
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger
                                    aria-label='Создать плейлист (требуется вход)'
                                    onClick={() => navigate('/login')}
                                    className={rowClass}
                                >
                                    <AddIcon color='onSurfaceVariant/50' />
                                    <RowLabel>Создать плейлист</RowLabel>
                                </TooltipTrigger>
                                <TooltipContent
                                    className='max-w-[300px] text-center'
                                    sideOffset={64}
                                >
                                    <p>
                                        Зарегистрируйся, чтобы иметь возможность создавать плейлисты
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                {/* Профиль и действия — только в мобильном drawer (на десктопе живут в ProfileMenu) */}
                {currentUser && (
                    <div className='md:hidden mt-auto flex flex-col items-stretch gap-y-1.5 px-3 pb-6'>
                        <Link
                            draggable={false}
                            to={`/user/${currentUser.username}`}
                            aria-label='Профиль'
                            className='flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15]'
                        >
                            <Avatar className='w-9 h-9'>
                                <AvatarImage src={coverUrl('user', currentUser.imageUrl, 100)} />
                                <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className='font-bold text-base text-onSurface truncate'>
                                {currentUser.username}
                            </span>
                        </Link>
                        <Link
                            draggable={false}
                            to='/mashup/upload'
                            aria-label='Загрузить мэшап'
                            className='flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15]'
                        >
                            <AddMashupIcon />
                            <span className='font-bold text-base text-onSurface'>
                                Загрузить мэшап
                            </span>
                        </Link>
                        {isModerator(currentUser.permissions) && (
                            <Link
                                draggable={false}
                                to='/mashup/moderation'
                                aria-label='Модерация'
                                className='flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15]'
                            >
                                <GavelIcon />
                                <span className='font-bold text-base text-onSurface'>
                                    Модерация
                                </span>
                            </Link>
                        )}
                        <Link
                            draggable={false}
                            to='/settings'
                            aria-label='Настройки'
                            className='flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15]'
                        >
                            <SettingsIcon />
                            <span className='font-bold text-base text-onSurface'>Настройки</span>
                        </Link>
                        <button
                            aria-label='Выйти'
                            onClick={logout}
                            className='flex items-center gap-x-4 w-full px-4 py-2.5 rounded-2xl hover:bg-onPrimary/[0.15]'
                        >
                            <DoorIcon color='error' />
                            <span className='font-bold text-base text-error'>Выйти</span>
                        </button>
                    </div>
                )}

                {!currentUser && (
                    <div className='md:hidden mt-auto flex flex-col items-center pb-9 px-3 w-full'>
                        <Link
                            draggable={false}
                            to='/login'
                            className='w-full text-center whitespace-nowrap bg-primary text-surface rounded-2xl px-3 py-3 text-base font-bold'
                        >
                            Войти
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
