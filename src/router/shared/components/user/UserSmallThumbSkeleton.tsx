import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function UserSmallThumbSkeleton() {
    return (
        <div className='flex justify-between p-1.5 w-full rounded-2xl'>
            <div className='flex items-center gap-x-4 min-w-0 flex-1'>
                <Skeleton className='w-11 h-11 min-w-11 min-h-11 rounded-full' />
                <Skeleton className='w-full max-w-[160px] h-5 rounded-lg' />
            </div>
            <div className='flex items-center shrink-0'>
                <Skeleton className='w-10 h-6 rounded-[10px]' />
            </div>
        </div>
    );
}
