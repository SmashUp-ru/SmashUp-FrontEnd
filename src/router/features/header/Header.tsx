import SearchBar from '@/router/features/header/SearchBar.tsx';
import ProfileMenu from '@/router/features/header/ProfileMenu.tsx';
import NotificationsMenu from '@/router/features/header/NotificationsMenu.tsx';
import BackButton from '@/router/features/header/BackButton.tsx';

export default function Header() {
    return (
        <div className='py-4 pr-4 flex items-center gap-x-12'>
            <div className='w-full flex items-center gap-x-4'>
                <BackButton />
                <SearchBar />
            </div>
            <div className='flex items-center gap-x-6'>
                <NotificationsMenu />
                <ProfileMenu />
            </div>
        </div>
    );
}
