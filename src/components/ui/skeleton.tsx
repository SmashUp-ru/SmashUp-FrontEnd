import { cn } from '@/lib/utils';

/**
 * Плашка-заглушка на время загрузки. Подложка задана ПОЛУПРОЗРАЧНЫМ белым, а не
 * токеном: скелетон лежит и на фоне страницы (`background`, rgb(2,2,2)), и на
 * карточках (`surface`, rgb(18,18,18)) — фиксированный цвет на одном из них
 * сливается с фоном. Раньше тут стоял `bg-onError` (rgb(11,11,11) — «текст на
 * ошибке»): на фоне страницы это 9 пунктов яркости, плашки не было видно вовсе,
 * загрузку выдавал только пробегающий блик.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('relative overflow-hidden rounded-md bg-white/[0.07]', className)}
            {...props}
        >
            <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer motion-reduce:hidden' />
        </div>
    );
}

export { Skeleton };
