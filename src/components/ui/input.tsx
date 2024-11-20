import * as React from 'react';

import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';
import LockIcon from '@/components/icons/Lock.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import { Button } from '@/components/ui/button.tsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: React.FC<IconProps>;
    endIcon?: React.FC<IconProps>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, startIcon, endIcon, ...props }, ref) => {
        const StartIcon = startIcon;
        const EndIcon = endIcon;

        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <div className='w-full relative'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                    {type === 'password' ? (
                        <LockIcon size={23} />
                    ) : (
                        StartIcon && <StartIcon size={23} color='onSurface' />
                    )}
                </div>

                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    className={cn(
                        'flex w-full rounded-2xl bg-surface font-bold text-onSurface placeholder:text-onSurfaceVariant py-[14.5px] px-[25px] focus:border border-onSurfaceVariant outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
                        startIcon || type === 'password' ? 'pl-[48px]' : '',
                        endIcon || type === 'password' ? 'pr-11' : '',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    {type === 'password' ? (
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                        >
                            <HideIcon size={23} />
                        </Button>
                    ) : (
                        EndIcon && <EndIcon color='onSurface' size={23} />
                    )}
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
