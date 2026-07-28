import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useSearchStore } from '@/store/search.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import CrossoverPopoverContent from '@/router/features/header/CrossoverPopoverContent.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function SearchBar() {
    const {
        searchValue,
        updateSearchValue,
        type,
        crossoverTracks,
        crossoverArtists,
        updateCrossoverArtists,
        updateCrossoverTracks
    } = useSearchStore();
    const location = useLocation();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [debouncedValue] = useDebounce(inputValue, 500);

    useEffect(() => {
        updateSearchValue(debouncedValue);
    }, [debouncedValue, updateSearchValue]);

    const [crossoverOpened, setCrossoverOpened] = useState(false);

    // if (isLoading) {
    //     return <Skeleton className='w-full h-[57px] rounded-2xl' />;
    // }

    return (
        <Popover open={crossoverOpened && searchValue.length > 0}>
            <div className='w-full flex items-center gap-x-2'>
                <PopoverTrigger className={cn('w-full')}>
                    <Input
                        disabled={
                            location.pathname === '/mashup/upload' ||
                            location.pathname.startsWith('/mashup/moderation/')
                        }
                        startIcon={SearchIcon}
                        className={cn('font-bold text-[15px]', 'w-full')}
                        placeholder='Поиск'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (location.pathname !== '/search') {
                                navigate('/search');
                            }

                            if (type === 'crossover') {
                                setCrossoverOpened(true);
                            }
                        }}
                    />
                </PopoverTrigger>

                {crossoverTracks.map((track) => (
                    <Button
                        key={track.id}
                        variant='nothing'
                        size='icon'
                        aria-label='Удалить трек из поиска'
                        onClick={() =>
                            updateCrossoverTracks([
                                ...crossoverTracks.filter((elem) => elem.id !== track.id)
                            ])
                        }
                    >
                        <Badge className='gap-x-1'>
                            <div className='w-6 h-6'>
                                <ImageWithSkeleton
                                    className='w-full h-full'
                                    src={coverUrl('track', track.imageUrl, 100)}
                                    alt={track.name}
                                />
                            </div>
                            <span>{track.name}</span>
                        </Badge>
                    </Button>
                ))}

                {crossoverArtists.map((artist) => (
                    <Button
                        key={artist.id}
                        variant='nothing'
                        size='icon'
                        aria-label='Удалить артиста из поиска'
                        onClick={() =>
                            updateCrossoverArtists([
                                ...crossoverArtists.filter((elem) => elem.id !== artist.id)
                            ])
                        }
                    >
                        <Badge className='gap-x-1'>
                            <div className='w-6 h-6'>
                                <ImageWithSkeleton
                                    className='w-full h-full'
                                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/track_author/${artist.imageUrl}_100x100.png`}
                                    alt={artist.name}
                                />
                            </div>
                            <span>{artist.name}</span>
                        </Badge>
                    </Button>
                ))}
            </div>
            <PopoverContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(event) => {
                    const target = event.target as Element;
                    if (!target.closest('input')) {
                        setCrossoverOpened(false);
                    }
                }}
                className={cn(
                    // фон теперь базовый; ширина — по триггеру, поэтому базовый
                    // max-w здесь снимаем, иначе подсказка станет уже поля
                    'rounded-2xl text-onSurfaceVariant',
                    'w-[--radix-popover-trigger-width] max-w-none'
                )}
            >
                <CrossoverPopoverContent />
            </PopoverContent>
        </Popover>
    );
}
