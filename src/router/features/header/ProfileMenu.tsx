import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import GavelIcon from '@/components/icons/gavel/Gavel32';
import { Button } from '@/components/ui/button.tsx';
import DoorIcon from '@/components/icons/door/Door32';
import { useGlobalStore } from '@/store/global.ts';
import AddMashupIcon from '@/components/icons/addMashup/AddMashup32';
import { isModerator } from '@/lib/bitmask';
import SettingsIcon from '@/components/icons/Settings';
import { coverUrl } from '@/lib/cdn.ts';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';

export default function ProfileMenu() {
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateToken = useGlobalStore((state) => state.updateToken);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // На мобайле меню профиля заменяет бургер в хедере (открывает drawer с профилем/действиями).
    if (isMobile) return null;

    if (!currentUser)
        return (
            <div className='flex gap-2 md:gap-2.5 shrink-0 items-center'>
                <Link
                    to='/login'
                    className='whitespace-nowrap bg-primary text-surface rounded-2xl px-3 py-2 text-[13px] md:px-5 md:py-[11px] md:text-[15px] font-bold hover:bg-hoverPrimary'
                    draggable={false}
                >
                    Войти
                </Link>
                <Link
                    to='/register'
                    className='hidden md:inline-block whitespace-nowrap bg-onPrimary text-onSurface rounded-2xl px-5 py-[11px] text-[15px] font-bold hover:bg-hoverPrimary/[0.2] hover:text-primary'
                    draggable={false}
                >
                    Зарегистрироваться
                </Link>
            </div>
        );

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    <Link draggable={false} to={`/user/${currentUser.username}`}>
                        <Avatar className='w-12 h-12'>
                            <AvatarImage src={coverUrl('user', currentUser.imageUrl, 100)} />
                            <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                </TooltipTrigger>
                <TooltipContent
                    sideOffset={18}
                    // фон/радиус/рамку не переопределяем — берём общий стиль
                    // подсказки, иначе стрелка не совпадёт с фоном меню
                    className='flex flex-col items-center gap-y-1 rounded-2xl p-2'
                >
                    {/* asChild — ссылка получает стиль ghost-кнопки: круглая подсветка + пресс */}
                    <Button asChild variant='ghost' size='control' aria-label='Загрузить мэшап'>
                        <Link to='/mashup/upload'>
                            <AddMashupIcon />
                        </Link>
                    </Button>
                    {isModerator(currentUser.permissions) && (
                        <Button asChild variant='ghost' size='control' aria-label='Модерация'>
                            <Link to='/mashup/moderation'>
                                <GavelIcon />
                            </Link>
                        </Button>
                    )}
                    <Button asChild variant='ghost' size='control' aria-label='Настройки'>
                        <Link to='/settings'>
                            <SettingsIcon />
                        </Link>
                    </Button>
                    <Button
                        variant='ghost'
                        size='control'
                        aria-label='Выйти'
                        onClick={() => {
                            localStorage.removeItem('smashup_token');
                            sessionStorage.removeItem('smashup_token');
                            updateToken('');
                            navigate('/');
                            updateCurrentUser(null);
                        }}
                    >
                        <DoorIcon color='error' />
                    </Button>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
