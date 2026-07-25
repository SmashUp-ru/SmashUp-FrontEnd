import { CSSProperties, useRef } from 'react';

import { Button } from '@/components/ui/button.tsx';
import SkipLeftIcon from '@/components/icons/SkipLeft.tsx';
import SkipRightIcon from '@/components/icons/SkipRight.tsx';
import { playOnce } from '@/lib/playAnimation.ts';

interface SkipButtonProps {
    direction: 'prev' | 'next';
    onClick: () => void;
    /** Доп. классы кнопки (напр. `hidden md:inline-flex` в баре). */
    className?: string;
    size?: number;
    color?: string;
    /** Время анимации, мс. Только для витрины (замедление); в проде — из класса. */
    duration?: number;
}

/**
 * Кнопка перемотки трека: по нажатию иконка уезжает в сторону перехода и
 * возвращается (keyframe `skip`), поверх обычного пресса самой кнопки.
 *
 * Анимация живёт на обёртке-`span`, а не на кнопке: у кнопки в это же время
 * играет `animate-press` (свойство `scale`), а сдвиг идёт через `translate` —
 * два независимых свойства не перетирают друг друга.
 */
export default function SkipButton({
    direction,
    onClick,
    className,
    size = 32,
    color = 'onSurface',
    duration
}: SkipButtonProps) {
    const iconRef = useRef<HTMLSpanElement>(null);
    const isNext = direction === 'next';
    const Icon = isNext ? SkipRightIcon : SkipLeftIcon;

    return (
        <Button
            variant='ghost'
            size='control'
            className={className}
            aria-label={isNext ? 'Следующий трек' : 'Предыдущий трек'}
            onClick={() => {
                if (iconRef.current) playOnce(iconRef.current, 'animate-skip');
                onClick();
            }}
        >
            <span
                ref={iconRef}
                className='inline-flex'
                style={
                    {
                        '--skip-shift': isNext ? '7px' : '-7px',
                        // инлайн-лонгханд перебивает duration из шортхенда класса
                        ...(duration ? { animationDuration: `${duration}ms` } : {})
                    } as CSSProperties
                }
            >
                <Icon color={color} size={size} />
            </span>
        </Button>
    );
}
