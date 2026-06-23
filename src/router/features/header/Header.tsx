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

    return (
        <div className='py-4 pr-4 flex items-center gap-x-4 md:gap-x-12'>
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
