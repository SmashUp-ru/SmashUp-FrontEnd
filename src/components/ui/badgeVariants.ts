import { cva } from 'class-variance-authority';

// Бейдж — НЕинтерактивный `div`-ярлык (счётчики на профиле, чипсы кроссовера).
// Поэтому в базе нет ни focus-кольца (в фокус он не попадает — в SearchBar
// кликабельна кнопка-обёртка, а не сам бейдж), ни ховера.
// Размер шрифта задан явно: без него бейдж наследовал кегль контекста и один
// компонент рисовался по-разному на разных страницах.
const badgeVariants = cva(
    'inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-xs font-medium leading-normal transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-badge text-primary',
                destructive: 'bg-destructive text-destructive-foreground',
                // Рамка — токеном. Раньше вариант задавал только мёртвый
                // `text-foreground` (токена `foreground` в конфиге нет), а рамка
                // бралась из дефолта Tailwind — gray-200, светлее всего в UI.
                outline: 'border-onSurfaceVariant/40 text-onSurface'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
);

export { badgeVariants };
