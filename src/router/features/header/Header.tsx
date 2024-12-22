import SearchBar from '@/router/features/header/SearchBar.tsx';
import ProfileMenu from '@/router/features/header/ProfileMenu.tsx';
import NotificationsMenu from '@/router/features/header/NotificationsMenu.tsx';
import BackButton from '@/router/features/header/BackButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function Header() {
    const { isLoading, updateIsLoading } = useGlobalStore();

    return (
        <div className='py-4 pr-4 flex items-center gap-x-12'>
            <div className='w-full flex items-center gap-x-4'>
                <BackButton />
                <SearchBar />
            </div>
            <div className='flex items-center gap-x-6'>
                <Button
                    onClick={() => {
                        updateIsLoading(!isLoading);
                    }}
                >
                    press me
                </Button>
                <NotificationsMenu />
                <ProfileMenu />
            </div>
        </div>
    );
}
