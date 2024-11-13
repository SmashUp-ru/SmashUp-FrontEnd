import { Input } from '@/components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchIcon from '@/components/icons/Search.tsx';
import BellIcon from '@/components/icons/Bell.tsx';

export default function Header() {
    return (
        <div className='py-4 flex justify-between items-center'>
            <Input
                startIcon={SearchIcon}
                className='w-[350px] font-bold text-lg'
                placeholder='Поиск'
            />
            <div className='flex items-center gap-x-6'>
                <BellIcon active />

                <Avatar>
                    <AvatarImage src='https://github.com/shadcn.png' />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
