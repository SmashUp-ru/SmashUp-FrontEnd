import MashupSmallThumbSkeleton from '@/router/shared/components/mashup/MashupSmallThumbSkeleton.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function LastSearchedSkeleton() {
    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <Skeleton className='w-[268px] h-[38px] rounded-[13px]' />
            <div className='flex flex-col gap-y-1 flex-1'>
                {Array.from({ length: 10 }).map((_, idx) => (
                    <MashupSmallThumbSkeleton key={idx} />
                ))}
            </div>
        </div>
    );
}
