import * as React from 'react';

import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: React.FC<IconProps>;
    endIcon?: React.FC<IconProps>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, startIcon, endIcon, ...props }, ref) => {
        const StartIcon = startIcon;
        const EndIcon = endIcon;

        return (
            <div className='w-full relative'>
                {StartIcon && (
                    <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                        <StartIcon size={21} color='onSurface' />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-2xl bg-surface py-2 px-4 text-sm focus:border border-onSurfaceVariant outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-onSurface disabled:cursor-not-allowed disabled:opacity-50',
                        startIcon ? 'pl-11' : '',
                        endIcon ? 'pr-11' : '',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {EndIcon && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                        <EndIcon color='onSurface' size={18} />
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
