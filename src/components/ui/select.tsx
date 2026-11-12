import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import ChevronDownIcon from '@/components/icons/ChevronDown.tsx';
import { cn } from '@/lib/utils.ts';

export interface SelectOption<T extends string | number> {
    value: T;
    label: string;
}

/** Триггер в стиле `Input`: подложка `surface`, то же кольцо фокуса. Общий с `DateTimePicker`. */
export const FIELD_TRIGGER =
    'group flex h-11 w-full items-center justify-between gap-x-2 rounded-2xl bg-surface pl-5 pr-3 text-left text-[15px] text-onSurface ' +
    'outline outline-2 outline-transparent outline-offset-[6px] transition-[outline-color,outline-offset] [transition-duration:200ms] ease-spring motion-reduce:transition-none ' +
    'focus-visible:outline-primary focus-visible:outline-offset-[2px] data-[state=open]:outline-primary data-[state=open]:outline-offset-[2px]';

/**
 * Выпадающий список в дизайне SmashUp вместо нативного `<select>`: меню — тот же
 * `DropdownMenu` (подсветка, тень, радиус), ширина по триггеру, текущий отмечен точкой.
 */
export function Select<T extends string | number>({
    value,
    options,
    onChange,
    placeholder = 'Выбери',
    className,
    'aria-label': ariaLabel
}: {
    value: T | null;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    'aria-label'?: string;
}) {
    const current = options.find((o) => o.value === value);
    return (
        // modal={false}: меню живёт внутри форм и диалогов, модальное заперло бы body
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type='button'
                    aria-label={ariaLabel}
                    className={cn(FIELD_TRIGGER, className)}
                >
                    <span className={cn('truncate', !current && 'text-additionalText')}>
                        {current?.label ?? placeholder}
                    </span>
                    <ChevronDownIcon
                        size={20}
                        color='onSurfaceVariant'
                        className='shrink-0 transition-transform group-data-[state=open]:rotate-180'
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='start'
                className='max-h-[320px] min-w-[--radix-dropdown-menu-trigger-width] overflow-y-auto'
            >
                <DropdownMenuRadioGroup
                    value={value === null ? undefined : String(value)}
                    onValueChange={(v) => {
                        const picked = options.find((o) => String(o.value) === v);
                        if (picked) onChange(picked.value);
                    }}
                >
                    {options.map((o) => (
                        <DropdownMenuRadioItem key={String(o.value)} value={String(o.value)}>
                            {o.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
