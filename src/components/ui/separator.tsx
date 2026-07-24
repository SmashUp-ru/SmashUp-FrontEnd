import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        // Тот же канон, что у разделителя в `DropdownMenu`: `bg-white/10`.
        // Было `bg-onBackground` (rgb(245,245,245)) — почти белая линия, самый
        // светлый элемент на экране, хотя разделитель должен быть тише контента.
        className={cn(
            'shrink-0 bg-white/10',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className
        )}
        {...props}
    />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
