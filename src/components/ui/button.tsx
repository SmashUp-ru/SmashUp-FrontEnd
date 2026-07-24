import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/buttonVariants';

import { cn } from '@/lib/utils';
import { playOnce } from '@/lib/playAnimation';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

/**
 * Пресс-фидбэк «нажим без отскока»: проигрываем keyframe `animate-press` по клику
 * (механика запуска — в `playOnce`). Параметры (squish 0.95/0.91, 240ms, пружина
 * через linear()) заданы в tailwind.config.js — там же почему именно они.
 */
const playPress = (el: HTMLElement) => playOnce(el, 'animate-press');

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                onClick={(e) => {
                    playPress(e.currentTarget as HTMLElement);
                    onClick?.(e);
                }}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
