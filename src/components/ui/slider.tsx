import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

// Слайдер остался только для непрерывных величин — seek и громкость.
// Дискретный выбор (битрейт) переехал на SegmentedControl, вместе с ним удалены
// showMarks/captions: засечки и подписи жили отдельно от трека и выглядели как
// самостоятельные элементы, а попадать в нужный шаг было неудобно.
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
    ({ className, trackClassName, rangeClassName, thumbClassName, value, ...props }, ref) => {
        return (
            <>
                <SliderPrimitive.Root
                    ref={ref}
                    value={value}
                    className={cn(
                        'group relative flex w-full touch-none select-none items-center',
                        className
                    )}
                    {...props}
                >
                    <SliderPrimitive.Track
                        className={cn(
                            'relative h-2 w-full grow overflow-hidden rounded-full bg-sliderBg',
                            trackClassName
                        )}
                    >
                        <SliderPrimitive.Range
                            className={cn('absolute h-full bg-onSurface', rangeClassName)}
                        />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb
                        className={cn(
                            'block w-4 h-4 bg-onSurface rounded-full',
                            'focus:outline-none',
                            thumbClassName
                        )}
                    />
                </SliderPrimitive.Root>
            </>
        );
    }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
