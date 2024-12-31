import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function MashupThumbSkeleton() {
    return (
        <div className='w-fit flex flex-col gap-y-4 p-4'>
            <Skeleton className='w-[216px] h-[216px] rounded-[30px]' />

            <div className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-full h-5 rounded-lg' />
                <Skeleton className='w-1/2 h-5 rounded-lg' />
            </div>
        </div>
    );
}
