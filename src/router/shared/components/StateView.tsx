import { ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import WarningIcon from '@/components/icons/Warning.tsx';
import { cn } from '@/lib/utils.ts';

interface StateViewProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
    /** Переопределяет геометрию контейнера — например `min-h-0` вне полной страницы. */
    className?: string;
}

/**
 * Центрированное состояние страницы (пусто / ошибка) — веб-аналог iOS
 * `ContentUnavailableView`. Используется на дата-страницах вместо «голого»
 * пустого экрана при отсутствии данных или ошибке загрузки.
 */
export function StateView({ icon, title, description, action, className }: StateViewProps) {
    return (
        <div
            className={cn(
                'flex min-h-[50vh] flex-col items-center justify-center gap-y-3 px-6 py-16 text-center',
                className
            )}
        >
            {icon}
            <h2 className='text-[15px] font-bold text-onSurface'>{title}</h2>
            {description && (
                <p className='max-w-[360px] text-[13px] text-onSurfaceVariant'>{description}</p>
            )}
            {action && (
                <Button size='sm' className='mt-2' onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

/** Состояние ошибки загрузки данных с кнопкой «Повторить». */
export function ErrorState({ onRetry, className }: { onRetry: () => void; className?: string }) {
    return (
        <StateView
            icon={<WarningIcon width={48} height={48} />}
            title='Не удалось загрузить'
            description='Проверьте подключение к интернету и попробуйте снова.'
            action={{ label: 'Повторить', onClick: onRetry }}
            className={className}
        />
    );
}
