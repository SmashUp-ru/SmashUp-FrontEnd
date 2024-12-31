import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function MashupSmallThumbSkeleton() {
    return (
        <div className='flex justify-between p-1.5 w-full rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <Skeleton className='w-12 h-12 min-w-12 min-h-12 rounded-xl' />

                <div className='flex flex-col gap-y-2.5'>
                    <Skeleton className='w-[221px] h-5 rounded-lg' />
                    <Skeleton className='w-[123px] h-5 rounded-lg' />
                </div>
            </div>

            <div className='flex items-center gap-x-[28px]'>
                <Skeleton className='w-6 h-6 rounded-[10px]' />
                <Skeleton className='w-[45px] h-6 rounded-[10px]' />
            </div>
        </div>
    );
}
