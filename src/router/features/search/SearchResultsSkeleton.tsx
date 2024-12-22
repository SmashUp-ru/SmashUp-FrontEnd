import MashupThumbSkeleton from '@/router/shared/mashup/MashupThumbSkeleton.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import UserThumbSkeleton from '@/router/shared/user/UserThumbSkeleton.tsx';

export default function SearchResultsSkeleton() {
    return (
        <div className='flex flex-col gap-y-6'>
            <div>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='w-full h-[314px] flex flex-wrap overflow-hidden items-center'>
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <MashupThumbSkeleton key={idx} />
                    ))}
                </div>
            </div>
            <div>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='w-full h-[314px] flex flex-wrap overflow-hidden items-center'>
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <UserThumbSkeleton key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}
