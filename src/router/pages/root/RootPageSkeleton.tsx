import { Skeleton } from '@/components/ui/skeleton.tsx';
import PlaylistThumbSkeleton from '@/router/shared/components/playlist/PlaylistThumbSkeleton.tsx';
import MashupSmallThumbSkeleton from '@/router/shared/components/mashup/MashupSmallThumbSkeleton.tsx';

export default function RootPageSkeleton() {
    return (
        <div className='flex flex-col gap-8 pb-12'>
            <section className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='flex items-center gap-x-4 overflow-hidden flex-wrap h-[314px]'>
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <PlaylistThumbSkeleton key={idx} />
                    ))}
                </div>
            </section>

            <section className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
                    {Array.from({ length: 10 })
                        .slice(0, 6)
                        .map((_, idx) => (
                            <MashupSmallThumbSkeleton key={idx} />
                        ))}
                </div>
            </section>

            <section className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-[268px] h-[38px] rounded-lg' />
                <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
                    {Array.from({ length: 10 })
                        .slice(0, 6)
                        .map((_, idx) => (
                            <MashupSmallThumbSkeleton key={idx} />
                        ))}
                </div>
            </section>
        </div>
    );
}
