import SearchBar from '@/router/features/header/SearchBar.tsx';
import ProfileMenu from '@/router/features/header/ProfileMenu.tsx';
import NotificationsMenu from '@/router/features/header/NotificationsMenu.tsx';
import BackButton from '@/router/features/header/BackButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import MenuIcon from '@/components/icons/menu/Menu32.tsx';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
    /** Открыть мобильный sidebar-drawer (кнопка-бургер видна только на мобильном). */
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const location = useLocation();

    /*
     * Шапка сама держит зону статус-бара: липнет к `top-0`, а вырез закрывает
     * собственным `padding-top`. Одно стекло на обе зоны — стыка нет (два
     * соседних `backdrop-blur` его давали).
     *
     * `-ml-2 pl-2` на мобайле — выход из левого жёлоба `pl-2` родителя: без этого
     * подложка не доходила бы до края экрана и слева оставалась бы щель.
     * Содержимое при этом не съезжает — отступ возвращён внутрь.
     */
    return (
        <div className='sticky top-0 z-20 -ml-2 pl-2 md:ml-0 md:pl-0 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 pr-4 flex items-center gap-x-4 md:gap-x-12 bg-background/80 backdrop-blur-xl border-b border-white/5'>
            <div className='w-full min-w-0 flex items-center gap-x-4'>
                {location.pathname !== '/' && <BackButton />}
                <SearchBar />
            </div>
            <div className='flex items-center gap-x-4 md:gap-x-6 shrink-0'>
                <NotificationsMenu />
                <ProfileMenu />
                <Button
                    variant='ghost'
                    size='icon'
                    className='md:hidden shrink-0'
                    onClick={onMenuClick}
                    aria-label='Открыть меню'
                >
                    <MenuIcon color='onSurface' size={28} />
                </Button>
            </div>
        </div>
    );
}
