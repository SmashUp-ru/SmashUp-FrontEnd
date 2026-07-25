import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    // Пресс-фидбэк — «нажим без отскока» (animate-press) навешивается в button.tsx
    // по click, а не через :active (иначе не срабатывает на tap-to-click тачпада).
    // ВАЖНО: время перехода задано через [transition-duration:150ms], а НЕ утилитой
    // duration-150 — плагин tailwindcss-animate переопределяет duration-* так, что
    // она ставит ещё и animation-duration и молча перебивает время keyframe-анимации
    // (из-за этого пресс проигрывался за 150ms вместо заявленных).
    'inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-[color,background-color,opacity,filter] [transition-duration:150ms] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                // Залитые (светлые) кнопки на ховере ТЕМНЕЮТ (brightness < 1) — заметно
                // и по конвенции; /90 (прозрачность) на тёмном фоне почти не читался.
                default: 'bg-primary text-surface font-bold text-[15px] hover:brightness-75',
                error: 'bg-error text-onError hover:brightness-75  font-bold text-[15px]',
                outline:
                    'font-bold text-[15px] border border-primary bg-transparent text-onBackground hover:bg-primary/10',
                ghost: 'rounded-full hover:bg-onSurface/10',
                link: 'text-primary underline-offset-4 hover:underline',
                nothing: 'text-inherit font-inherit'
            },
            size: {
                default: 'rounded-2xl px-4 py-[11px]',
                sm: 'px-4 py-2 font-bold text-[13px] rounded-xl',
                classic: 'rounded-2xl font-bold text-[15px] px-6 py-[11px] w-fit',
                icon: 'p-0',
                // Icon-кнопка с полем вокруг: круглая подсветка (ghost) шире
                // самой иконки и одинакова для иконок 24/32px. 44px = таргет
                // нажатия WCAG 2.5.5. Иконка центрируется базовым items/justify.
                control: 'h-11 w-11 rounded-full shrink-0'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export { buttonVariants };
