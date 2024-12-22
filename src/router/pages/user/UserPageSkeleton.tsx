import { Skeleton } from '@/components/ui/skeleton.tsx';
import PlaylistThumbSkeleton from '@/router/shared/playlist/PlaylistThumbSkeleton.tsx';

export default function UserPageSkeleton() {
    return (
        <div className='flex flex-col gap-y-6'>
            {/*шапка*/}
            <Skeleton className='h-[252px] bg-surface p-4 rounded-tl-[120px] rounded-bl-[120px] rounded-r-[50px]' />

            {/*контент*/}
            <section className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='flex items-center gap-x-4 overflow-hidden flex-wrap h-[314px]'>
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <PlaylistThumbSkeleton key={idx} />
                    ))}
                </div>
            </section>
        </div>
    );
}
