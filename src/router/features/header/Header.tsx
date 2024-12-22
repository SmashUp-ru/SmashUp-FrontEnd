import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BellIcon from '@/components/icons/Bell.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { useUser } from '@/hooks/useUser.ts';
import SearchBar from '@/router/features/header/SearchBar.tsx';
import DoorIcon from '@/components/icons/Door.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GavelIcon from '@/components/icons/Gavel.tsx';
import { useProfileStore } from '@/store/profile.ts';

export default function Header() {
    const { updateToken } = useProfileStore();

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
                {user && <BellIcon active />}

                {user ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link draggable={false} to={`/user/${user.username}`}>
                                    <Avatar>
                                        <AvatarImage
                                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_100x100.png`}
                                        />
                                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                sideOffset={18}
                                className='flex flex-col gap-y-7 rounded-3xl bg-surfaceVariant border-none p-2'
                            >
                                <Link to='/moderation'>
                                    <GavelIcon />
                                </Link>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => {
                                        localStorage.removeItem('smashup_token');
                                        sessionStorage.removeItem('smashup_token');
                                        localStorage.removeItem('player-storage');
                                        updateToken('');
                                        navigate('/');
                                    }}
                                >
                                    <DoorIcon color='error' />
                                </Button>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Link to='/login' draggable={false}>
                        <DoorIcon />
                    </Link>
                )}
            </div>
        </div>
    );
}
