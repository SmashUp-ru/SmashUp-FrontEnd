import { Input } from '@/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchIcon from '@/components/icons/Search.tsx';
import BellIcon from '@/components/icons/Bell.tsx';
import { useSearchStore } from '@/store/search.ts';
import { cn } from '@/lib/utils.ts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import leonid from '@/assets/leonid.png';
import { Button } from '@/components/ui/button.tsx';
import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Header() {
    const { updateSearchValue } = useSearchStore();
    const location = useLocation();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [debouncedValue] = useDebounce(inputValue, 500);

    useEffect(() => {
        updateSearchValue(debouncedValue);
    }, [debouncedValue]);

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

                <Link draggable={false} to='/profile/LeonidM'>
                    <Avatar>
                        <AvatarImage src={leonid} />
                        <AvatarFallback>LM</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </div>
    );
}
