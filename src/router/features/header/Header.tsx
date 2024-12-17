import { Input } from '@/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchIcon from '@/components/icons/Search.tsx';
import BellIcon from '@/components/icons/Bell.tsx';
import { useSearchStore } from '@/store/search.ts';
import { cn } from '@/lib/utils.ts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUser } from '@/hooks/useUser.ts';

export default function Header() {
    const { updateSearchValue } = useSearchStore();
    const location = useLocation();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [debouncedValue] = useDebounce(inputValue, 500);

    useEffect(() => {
        updateSearchValue(debouncedValue);
    }, [debouncedValue]);

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
                <Input
                    startIcon={SearchIcon}
                    className={cn('font-bold text-lg', 'w-full')}
                    placeholder='Поиск'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={() => {
                        if (location.pathname !== '/search') {
                            navigate('/search');
                        }
                    }}
                />
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
                    <></>
                )}
            </div>
        </div>
    );
}
