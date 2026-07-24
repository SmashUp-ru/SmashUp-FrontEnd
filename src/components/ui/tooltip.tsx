import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

/**
 * Задержка по умолчанию — 200ms вместо радиксовых 700ms: подсказки поясняют
 * иконки, ждать почти секунду незачем.
 */
const TooltipProvider = ({
    delayDuration = 200,
    ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => (
    <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Фон — `surface`, он светлее фона страницы, поэтому серая рамка не нужна: без
 * неё стрелка сливается с телом подсказки в одну фигуру. Глубину даёт тень.
 *
 * Рост — от края, обращённого к триггеру: `transform-origin` берётся из
 * радиксовой переменной, иначе zoom расходился бы от центра и подсказка
 * «прилетала» бы не от своей иконки.
 */
const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, children, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-[100] max-w-[320px] rounded-xl bg-surface px-3.5 py-2',
                'text-[15px] font-medium leading-snug text-onSurface [text-wrap:balance]',
                'shadow-[0_12px_32px_-12px_rgba(0,0,0,0.9)]',
                '[transform-origin:var(--radix-tooltip-content-transform-origin)]',
                'animate-in fade-in-0 zoom-in-95 duration-150 ease-out',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100',
                'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
                'motion-reduce:animate-none',
                className
            )}
            {...props}
        >
            {children}
            <TooltipPrimitive.Arrow width={12} height={6} className='fill-surface' />
        </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
