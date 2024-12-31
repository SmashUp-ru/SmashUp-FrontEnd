import { cn } from '@/lib/utils.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { usePlayerStore } from '@/store/player.ts';
import TrackSmallThumbSkeleton from '@/router/shared/components/track/TrackSmallThumbSkeleton.tsx';

export default function MashupInfoSkeleton() {
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    return (
        <div
            className={cn(
                `min-w-[382px] w-[382px] h-[calc(100%-${queue.length === 0 || queueIndex === null ? '16' : '148'}px)] sticky top-0 bg-surfaceVariant rounded-[30px] my-4 mr-4 py-4 px-[10.5px] overflow-hidden`,
                'flex flex-col gap-y-4 items-start'
            )}
        >
            <div className='w-full flex items-center justify-between gap-x-[30px]'>
                <Skeleton className='h-[30px] w-[150px] rounded' />
                <Skeleton className='h-6 w-6 rounded' />
            </div>

            <Skeleton className='w-[350px] h-[350px] rounded-[30px]' />

            <div className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-full h-5 rounded-lg' />
                <Skeleton className='w-1/2 h-5 rounded-lg' />
            </div>

            <div className='flex items-center gap-x-4'>
                <Skeleton className='w-12 h-12 rounded-full' />

                <Skeleton className='w-[27px] h-[23px] rounded' />

                <Skeleton className='w-[26px] h-[22px] rounded' />

                <Skeleton className='w-[22px] h-[5px] rounded' />
            </div>

            <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                <Skeleton className='h-[30px] w-[150px] rounded' />

                <TrackSmallThumbSkeleton />
                <TrackSmallThumbSkeleton />
            </div>
        </div>
    );
}
