import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BellIcon from '@/components/icons/Bell.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { useUser } from '@/hooks/useUser.ts';
import SearchBar from '@/router/features/header/SearchBar.tsx';
import DoorIcon from '@/components/icons/Door.tsx';

export default function Header() {
    const navigate = useNavigate();
    const user = useUser();

    return (
        <div className='py-4 pr-4 flex items-center gap-x-12'>
            <div className='w-full flex items-center gap-x-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full bg-surface w-[40px] h-[40px]'
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeftIcon className='w-[40px]' />
                </Button>

                <SearchBar />
            </div>
            <div className='flex items-center gap-x-6'>
                <BellIcon active />

                {user ? (
                    <Link draggable={false} to={`/user/${user.username}`}>
                        <Avatar>
                            <AvatarImage
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_100x100.png`}
                            />
                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                ) : (
                    <Link to='/login' draggable={false}>
                        <DoorIcon />
                    </Link>
                )}
            </div>
        </div>
    );
}
