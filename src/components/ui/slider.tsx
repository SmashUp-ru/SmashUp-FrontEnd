import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
    showMarks?: boolean;
    captions?: string[];
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
    (
        {
            className,
            trackClassName,
            rangeClassName,
            thumbClassName,
            showMarks = false,
            captions,
            value,
            ...props
        },
        ref
    ) => {
        const currentValue = Array.isArray(value) ? value[0] : 0;

        return (
            <>
                {captions && (
                    <div className='absolute w-[105%] -left-2 -top-10 mb-4 flex flex-row justify-between'>
                        {captions.map((caption) => (
                            <span
                                key={caption}
                                className='w-[38px] font-semibold text-onSurfaceVariant'
                                role='presentation'
                            >
                                {caption}
                            </span>
                        ))}
                    </div>
                )}

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

                {showMarks && (
                    <div className='absolute -top-3 w-full flex justify-between'>
                        {Array.from({ length: (props.max || 4) + 1 }).map((_, i) => (
                            <div
                                key={`slidermark ${i}`}
                                className={cn(
                                    'h-[30px] w-2.5 rounded-[2.8px]',
                                    i <= currentValue ? 'bg-primary' : 'bg-sliderBg'
                                )}
                            />
                        ))}
                    </div>
                )}
            </>
        );
    }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
