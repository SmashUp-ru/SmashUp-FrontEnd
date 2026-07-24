import * as React from 'react';

import { cn } from '@/lib/utils.ts';
import { playOnce } from '@/lib/playAnimation.ts';
import { IconProps } from '@/components/icons/props.tsx';
import LockIcon from '@/components/icons/Lock.tsx';
import HideIcon from '@/components/icons/hide/Hide28';
import { Button } from '@/components/ui/button.tsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: React.FC<IconProps>;
    startIconClassName?: string;
    endIconClassName?: string;
    endIcon?: React.FC<IconProps>;

    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            startIcon,
            startIconClassName,
            endIcon,
            endIconClassName,
            error,
            onPointerDown,
            ...props
        },
        ref
    ) => {
        const StartIcon = startIcon;
        const EndIcon = endIcon;

        const [showPassword, setShowPassword] = React.useState(false);
        const pressRef = React.useRef<HTMLSpanElement>(null);

        return (
            // className вешаем на ОБЁРТКУ, а не на само поле: подложка тянется по
            // ней, и если ограничить шириной только input (напр. max-w-[280px]),
            // фон и кольцо фокуса разъедутся по ширине. Скрытые поля (`hidden`)
            // по той же причине должны прятаться целиком, вместе с подложкой.
            <div className={cn('w-full relative', className)}>
                {/*
                 * Нажим играет ПОДЛОЖКА, а не сам <input>. Если масштабировать
                 * поле, то: (1) оно создаёт stacking context и своим фоном
                 * перекрывает абсолютные иконки — те пропадают на время
                 * анимации; (2) меняется геометрия поля, и выпадашка менеджера
                 * паролей ездит следом. Подложка держит фон и форму, поле
                 * остаётся неподвижным.
                 */}
                <span
                    ref={pressRef}
                    aria-hidden
                    className='pointer-events-none absolute inset-0 rounded-2xl bg-surface'
                />

                <div className='absolute left-5 top-1/2 transform -translate-y-1/2'>
                    {type === 'password' ? (
                        <LockIcon size={23} />
                    ) : (
                        StartIcon && (
                            <StartIcon size={23} color='onSurface' className={startIconClassName} />
                        )
                    )}
                </div>

                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    className={cn(
                        // фон живёт на подложке выше; relative — чтобы поле было
                        // над ней в порядке отрисовки
                        'relative flex w-full rounded-2xl bg-transparent text-onSurface py-[11px] px-5 text-[15px] font-bold placeholder:text-onSurfaceVariant',
                        // Кольцо есть всегда, но прозрачное и с отступом — на фокусе
                        // оно проявляется и «схлопывается» к краю поля. Так переход
                        // анимируется (outline-color/offset), а не появляется рывком.
                        // duration задан арбитрарным свойством: утилита duration-*
                        // от tailwindcss-animate перебила бы время нажима.
                        'outline outline-2 outline-transparent outline-offset-[6px]',
                        'transition-[outline-color,outline-offset] [transition-duration:200ms] ease-spring motion-reduce:transition-none',
                        'focus:outline-offset-[2px]',
                        error ? 'focus:outline-error' : 'focus:outline-primary',
                        startIcon || type === 'password' ? 'pl-[48px]' : '',
                        endIcon || type === 'password' ? 'pr-11' : ''
                    )}
                    ref={ref}
                    onPointerDown={(e) => {
                        // Нажим — только по указателю: фокус с клавиатуры (Tab)
                        // «придавливать» поле не должен.
                        if (pressRef.current) playOnce(pressRef.current, 'animate-press-input');
                        onPointerDown?.(e);
                    }}
                    {...props}
                />
                <div className='absolute right-5 top-1/2 transform -translate-y-3.5'>
                    {type === 'password' ? (
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                        >
                            <HideIcon />
                        </Button>
                    ) : (
                        EndIcon && (
                            <EndIcon color='onSurface' size={23} className={endIconClassName} />
                        )
                    )}
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
