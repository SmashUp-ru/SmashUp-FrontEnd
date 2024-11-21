import { Skeleton } from '@/components/ui/skeleton.tsx';
import MashupThumbSkeleton from '@/router/shared/skeletons/MashupThumbSkeleton.tsx';

export default function PlaylistPageSkeleton() {
    return (
        <div className='flex flex-col gap-y-6'>
            <Skeleton className='w-full h-[252px] rounded-[50px]' />

            <div className='flex flex-col gap-y-1'>
                {Array.from({ length: 10 }).map(() => (
                    <MashupThumbSkeleton />
                ))}
            </div>
        </div>
    );
}
