import { Skeleton } from '@/components/ui/skeleton.tsx';
import MashupSmallThumbSkeleton from '@/router/shared/components/mashup/MashupSmallThumbSkeleton.tsx';

export default function MashupPageSkeleton() {
    return (
        <div className='flex flex-col gap-y-6'>
            <Skeleton className='w-full h-[252px] rounded-[50px]' />

            <MashupSmallThumbSkeleton />
        </div>
    );
}
