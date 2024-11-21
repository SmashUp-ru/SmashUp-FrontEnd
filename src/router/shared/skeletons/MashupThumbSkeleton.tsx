import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function MashupThumbSkeleton() {
    return (
        <div className='flex items-center gap-x-4'>
            <Skeleton className='w-12 h-12 rounded-[10px]' />
            <div className='flex flex-col items-center gap-y-2.5'>
                <Skeleton className='w-[221px] h-[19px] rounded-[10px]' />
                <Skeleton className='w-[123px] h-[19px] rounded-[10px]' />
            </div>
        </div>
    );
}
