import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';

export default function TrackSmallThumbSkeleton() {
    return (
        <div
            className={cn(
                'flex p-1.5 w-full group hover:bg-onPrimary rounded-2xl items-center gap-x-4',
                THUMB_ROW_HOVER
            )}
        >
            <Skeleton className='w-11 h-11 rounded-[10px]' />
            <div className='flex flex-col gap-y-2.5'>
                <Skeleton className='w-[221px] h-[19px] rounded-[10px]' />
                <Skeleton className='w-[123px] h-[19px] rounded-[10px]' />
            </div>
        </div>
    );
}
