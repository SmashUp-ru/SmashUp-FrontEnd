import { Input } from '@/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchIcon from '@/components/icons/Search.tsx';
import BellIcon from '@/components/icons/Bell.tsx';
import { useSearchStore } from '@/store/search.ts';
import { cn } from '@/lib/utils.ts';
import { Link } from 'react-router-dom';
import leonid from '@/assets/leonid.png';

export default function Header() {
    const { searchValue, updateSearchValue } = useSearchStore();

    return (
        <div className='py-4 pr-4 flex justify-between items-center gap-x-12'>
            <Input
                startIcon={SearchIcon}
                className={cn('font-bold text-lg', searchValue ? 'w-full' : 'w-[350px]')}
                placeholder='Поиск'
                value={searchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
            />
            <div className='flex items-center gap-x-6'>
                <BellIcon active />

                <Link to='/profile/0'>
                    <Avatar>
                        <AvatarImage src={leonid} />
                        <AvatarFallback>LM</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </div>
    );
}
