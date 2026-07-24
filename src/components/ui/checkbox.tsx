import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/lib/utils';

/**
 * Галка рисуется штрихом, а не заливкой: так её можно «прочертить» при
 * включении и стереть в обратную сторону при снятии — анимацией
 * stroke-dashoffset.
 *
 * `pathLength={1}` нормирует длину пути к единице, поэтому dasharray/dashoffset
 * задаются в долях и не зависят от геометрии (не нужно считать длину ломаной).
 *
 * Индикатор монтируется всегда (`forceMount`): иначе при снятии Radix убрал бы
 * его из DOM сразу и стирающая анимация не успела бы проиграть.
 */
const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'peer h-8 w-8 shrink-0 rounded-[6px] bg-surface ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            forceMount
            className='group flex h-full w-full items-center justify-center text-primary'
        >
            <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    d='M4.5 11.7L9 16.1L19.5 5.7'
                    pathLength={1}
                    className={cn(
                        '[stroke-dasharray:1] [stroke-dashoffset:1]',
                        // Здесь НЕ пружина: она проходит половину пути за четверть
                        // времени, и росчерк выглядит как мгновенное появление.
                        // Ровная кривая с разгоном и торможением читается как письмо.
                        'transition-[stroke-dashoffset] [transition-duration:300ms] [transition-timing-function:cubic-bezier(0.45,0,0.25,1)] motion-reduce:transition-none',
                        'group-data-[state=checked]:[stroke-dashoffset:0]'
                    )}
                />
            </svg>
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
