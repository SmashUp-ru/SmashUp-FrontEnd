import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    thumbClassName?: string;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
    ({ className, thumbClassName, ...props }, ref) => (
        <SwitchPrimitives.Root
            className={cn(
                // Выключенный трек — `surface`. Раньше здесь стоял мёртвый
                // `data-[state=unchecked]:bg-input` (токена `input` в конфиге нет),
                // из-за чего фон брался из базового `bg-onError` — семантически
                // «текст на ошибке».
                'peer inline-flex h-6 w-11 bg-surface shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
                className
            )}
            {...props}
            ref={ref}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    'pointer-events-none block h-5 w-5 rounded-full bg-onSurfaceVariant data-[state=checked]:bg-onSurface ring-0',
                    // Без тени: `shadow-lg` смещена вниз на 10px при диаметре 20px,
                    // из-за неё тёмное пятно снизу-справа съедало 2px зазор и кружок
                    // читался сдвинутым вверх-влево (геометрия при этом ровная —
                    // 2px со всех сторон, проверено пиксельно).
                    'transition-transform [transition-duration:240ms] ease-spring motion-reduce:transition-none',
                    'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                    thumbClassName
                )}
            />
        </SwitchPrimitives.Root>
    )
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
