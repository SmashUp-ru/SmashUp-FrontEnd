import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore } from '@/store/global.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function BackButton() {
    const navigate = useNavigate();
    const { isLoading } = useGlobalStore();

    if (isLoading) return <Skeleton className='w-10 h-10 min-w-10 min-h-10 rounded-full' />;

    return (
        <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-surface w-[40px] h-[40px]'
            onClick={() => navigate(-1)}
        >
            <ChevronLeftIcon className='w-[40px]' />
        </Button>
    );
}
