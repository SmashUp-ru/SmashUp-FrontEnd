import { useRef } from 'react';

import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string | number> {
    value: T;
    label: string;
}

interface SegmentedControlProps<T extends string | number> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    /** Обязателен: у группы нет видимого заголовка внутри. */
    'aria-label': string;
}

/**
 * Сегментированный переключатель — выбор ОДНОГО из нескольких дискретных
 * значений (битрейт, режимы). В отличие от слайдера показывает все варианты
 * сразу и не требует «прицеливаться» в шаг: у слайдера с пятью метками
 * подписи и засечки живут отдельно от трека, и попасть в нужное значение
 * сложнее, чем просто нажать нужный вариант.
 *
 * Выделение — одна «пилюля», которая переезжает между сегментами по общей
 * пружине, а не перекрашивание фона у каждого: видно, ЧТО поменялось.
 *
 * Семантика — `radiogroup`/`radio` + roving tabindex: Tab заводит в группу на
 * активный вариант, стрелки переключают.
 */
function SegmentedControl<T extends string | number>({
    options,
    value,
    onChange,
    className,
    'aria-label': ariaLabel
}: SegmentedControlProps<T>) {
    const activeIndex = Math.max(
        0,
        options.findIndex((o) => o.value === value)
    );
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const move = (delta: number) => {
        const next = Math.min(options.length - 1, Math.max(0, activeIndex + delta));
        if (next === activeIndex) return;
        onChange(options[next].value);
        // Фокус едет за выбором: иначе кольцо остаётся на прежнем сегменте, а
        // выбран уже другой (паттерн radiogroup + roving tabindex).
        buttonsRef.current[next]?.focus();
    };

    return (
        <div
            role='radiogroup'
            aria-label={ariaLabel}
            className={cn('relative flex w-full rounded-2xl bg-surface p-1', className)}
            onKeyDown={(e) => {
                const delta =
                    e.key === 'ArrowRight' || e.key === 'ArrowDown'
                        ? 1
                        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                          ? -1
                          : 0;
                if (!delta) return;
                e.preventDefault();
                move(delta);
            }}
        >
            {/* Пилюля выделения: ширина — доля контейнера за вычетом паддингов. */}
            <span
                aria-hidden
                className='pointer-events-none absolute inset-y-1 left-1 rounded-xl bg-primary transition-transform [transition-duration:240ms] ease-spring motion-reduce:transition-none'
                style={{
                    width: `calc((100% - 0.5rem) / ${options.length})`,
                    transform: `translateX(${activeIndex * 100}%)`
                }}
            />

            {options.map((option, index) => {
                const active = index === activeIndex;
                return (
                    <button
                        key={option.value}
                        ref={(el) => {
                            buttonsRef.current[index] = el;
                        }}
                        type='button'
                        role='radio'
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            // min-w-0 обязателен: без него flex-1 не сжимается ниже
                            // ширины текста, и длинный вариант («Ориг») вылезает
                            // за контейнер.
                            'relative min-w-0 flex-1 rounded-xl px-1.5 py-2 text-[15px] font-bold',
                            'transition-colors [transition-duration:200ms] motion-reduce:transition-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            active ? 'text-surface' : 'text-onSurfaceVariant hover:text-onSurface'
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export { SegmentedControl };
