import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('relative overflow-hidden rounded-md bg-onError', className)} {...props}>
            <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer motion-reduce:hidden' />
        </div>
    );
}

export { Skeleton };
