import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function MashupSmallThumbSkeleton() {
    return (
        <div className='flex justify-between p-1.5 w-full rounded-2xl'>
            <div className='flex items-center gap-x-4 min-w-0 flex-1'>
                <Skeleton className='w-11 h-11 min-w-11 min-h-11 rounded-xl' />

                <div className='flex flex-col gap-y-2.5 min-w-0 w-full'>
                    <Skeleton className='w-full max-w-[221px] h-5 rounded-lg' />
                    <Skeleton className='w-full max-w-[123px] h-5 rounded-lg' />
                </div>
            </div>

            <div className='flex items-center gap-x-[28px] shrink-0'>
                <Skeleton className='w-6 h-6 rounded-[10px]' />
                <Skeleton className='w-[45px] h-6 rounded-[10px]' />
            </div>
        </div>
    );
}
