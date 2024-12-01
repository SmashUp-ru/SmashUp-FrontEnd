import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    trackClassName?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
    ({ className, trackClassName, ...props }, ref) => (
        <SliderPrimitive.Root
            ref={ref}
            className={cn('relative flex w-full touch-none select-none items-center', className)}
            {...props}
        >
            <SliderPrimitive.Track
                className={cn(
                    'relative h-2 w-full grow overflow-hidden rounded-full bg-sliderBg',
                    trackClassName
                )}
            >
                <SliderPrimitive.Range className='absolute h-full bg-onSurface' />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className='' />
        </SliderPrimitive.Root>
    )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
