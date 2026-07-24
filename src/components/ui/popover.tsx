import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Одна семья с `Tooltip` и `DropdownMenu`: фон `surface`, крупный радиус, та же
 * тень и рост от края, обращённого к триггеру.
 *
 * Раньше здесь не было ФОНА вообще (только `p-4 shadow-md`), а цвет текста
 * задавался мёртвым `text-popover-foreground` — токенов `popover*` в
 * tailwind.config нет, класс не генерировался. Поповер выглядел прозрачной
 * плашкой везде, где вызывающий код не добавлял `bg-*` руками.
 */
const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 8, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                'z-50 max-w-[min(360px,calc(100vw-2rem))] rounded-[18px] bg-surface p-4',
                'text-onSurface outline-none',
                'shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]',
                '[transform-origin:var(--radix-popover-content-transform-origin)]',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150 data-[state=open]:ease-out',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100',
                'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
                'motion-reduce:animate-none',
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
