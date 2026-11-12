import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FIELD_TRIGGER, Select } from '@/components/ui/select.tsx';
import CalendarOutlineIcon from '@/components/icons/calendar/CalendarOutline28.tsx';
import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { cn } from '@/lib/utils.ts';
import { formatLocal, LocalDateTime, monthGrid, parseLocal } from '@/lib/calendar.ts';

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const HOURS = Array.from({ length: 24 }, (_, h) => ({
    value: h,
    label: String(h).padStart(2, '0')
}));
const MINUTES = Array.from({ length: 12 }, (_, i) => ({
    value: i * 5,
    label: String(i * 5).padStart(2, '0')
}));
/** Время по умолчанию при первом выборе дня: вечер, как у большинства мероприятий. */
const DEFAULT_TIME = { hh: 20, mm: 0 };

const monthTitle = (y: number, m: number) =>
    new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' })
        .format(Date.UTC(y, m, 1))
        .replace(' г.', '');

const label = (v: LocalDateTime) =>
    new Intl.DateTimeFormat('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    })
        .format(Date.UTC(v.y, v.m, v.d))
        .replace(' г.', '') + `, ${String(v.hh).padStart(2, '0')}:${String(v.mm).padStart(2, '0')}`;

/**
 * Дата и время в дизайне SmashUp вместо нативного `datetime-local`. Значение — та же
 * строка «2026-12-12T20:00» (время на часах площадки, без пояса), поэтому снаружи
 * ничего не меняется. Календарь с понедельника, минуты шагом 5.
 */
export function DateTimePicker({
    value,
    onChange,
    placeholder = 'Выбери дату',
    clearable,
    'aria-label': ariaLabel
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** Показать «Очистить» — для необязательных полей. */
    clearable?: boolean;
    'aria-label'?: string;
}) {
    const parsed = parseLocal(value);
    const today = new Date();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState({
        y: parsed?.y ?? today.getFullYear(),
        m: parsed?.m ?? today.getMonth()
    });

    const shiftMonth = (delta: number) =>
        setView(({ y, m }) => ({
            y: y + Math.floor((m + delta) / 12),
            m: (((m + delta) % 12) + 12) % 12
        }));

    const set = (patch: Partial<LocalDateTime>) => {
        const base = parsed ?? { y: view.y, m: view.m, d: 1, ...DEFAULT_TIME };
        onChange(formatLocal({ ...base, ...patch }));
    };

    // минуты не кратные 5 (из старых данных) тоже показываем, иначе селект был бы пуст
    const minutes =
        parsed && parsed.mm % 5 !== 0
            ? [...MINUTES, { value: parsed.mm, label: String(parsed.mm).padStart(2, '0') }].sort(
                  (a, b) => a.value - b.value
              )
            : MINUTES;

    return (
        <Popover
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                // открываем на месяце выбранной даты
                if (o && parsed) setView({ y: parsed.y, m: parsed.m });
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type='button'
                    // подпись поля + значение: иначе скринридер слышит только «Начало»
                    aria-label={
                        ariaLabel && `${ariaLabel}: ${parsed ? label(parsed) : placeholder}`
                    }
                    className={FIELD_TRIGGER}
                >
                    <span className={cn('truncate', !parsed && 'text-additionalText')}>
                        {parsed ? label(parsed) : placeholder}
                    </span>
                    <CalendarOutlineIcon size={20} className='shrink-0' />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align='start'
                className='w-[316px] p-3'
                // меню часов/минут рисуется порталом вне поповера: клик по его пункту
                // Radix счёл бы кликом снаружи и закрыл календарь
                onInteractOutside={(e) => {
                    if ((e.target as Element | null)?.closest?.('[role="menu"]'))
                        e.preventDefault();
                }}
            >
                <div className='flex items-center justify-between pb-2'>
                    <Button
                        type='button'
                        variant='ghost'
                        size='control'
                        aria-label='Предыдущий месяц'
                        onClick={() => shiftMonth(-1)}
                    >
                        <ChevronLeftIcon size={20} color='onSurface' />
                    </Button>
                    <span className='text-[15px] font-semibold capitalize'>
                        {monthTitle(view.y, view.m)}
                    </span>
                    <Button
                        type='button'
                        variant='ghost'
                        size='control'
                        aria-label='Следующий месяц'
                        onClick={() => shiftMonth(1)}
                    >
                        <ChevronLeftIcon size={20} color='onSurface' className='rotate-180' />
                    </Button>
                </div>

                <div className='grid grid-cols-7 gap-y-1 text-center'>
                    {WEEKDAYS.map((w) => (
                        <span key={w} className='pb-1 text-[12px] font-medium text-additionalText'>
                            {w}
                        </span>
                    ))}
                    {monthGrid(view.y, view.m).map((c) => {
                        const selected =
                            parsed !== null &&
                            parsed.y === c.y &&
                            parsed.m === c.m &&
                            parsed.d === c.d;
                        const isToday =
                            today.getFullYear() === c.y &&
                            today.getMonth() === c.m &&
                            today.getDate() === c.d;
                        return (
                            <button
                                key={`${c.y}-${c.m}-${c.d}`}
                                type='button'
                                aria-pressed={selected}
                                aria-label={new Intl.DateTimeFormat('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    timeZone: 'UTC'
                                }).format(Date.UTC(c.y, c.m, c.d))}
                                onClick={() => {
                                    set({ y: c.y, m: c.m, d: c.d });
                                    if (!c.inMonth) setView({ y: c.y, m: c.m });
                                }}
                                className={cn(
                                    'mx-auto flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors [transition-duration:150ms] motion-reduce:transition-none',
                                    'outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                    selected
                                        ? 'bg-primary font-semibold text-surface'
                                        : cn(
                                              'hover:bg-onSurface/10',
                                              c.inMonth ? 'text-onSurface' : 'text-additionalText',
                                              isToday && 'font-semibold text-primary'
                                          )
                                )}
                            >
                                {c.d}
                            </button>
                        );
                    })}
                </div>

                <div className='mt-3 flex items-center gap-x-2 border-t border-white/10 pt-3'>
                    <span className='mr-auto text-sm text-onSurfaceVariant'>Время</span>
                    <Select
                        aria-label='Часы'
                        className='w-[84px] bg-white/[0.07]'
                        value={parsed?.hh ?? null}
                        placeholder='чч'
                        options={HOURS}
                        onChange={(hh) => set({ hh })}
                    />
                    <span className='text-onSurfaceVariant'>:</span>
                    <Select
                        aria-label='Минуты'
                        className='w-[84px] bg-white/[0.07]'
                        value={parsed?.mm ?? null}
                        placeholder='мм'
                        options={minutes}
                        onChange={(mm) => set({ mm })}
                    />
                </div>

                <div className='mt-3 flex justify-end gap-x-2'>
                    {clearable && parsed && (
                        <Button
                            type='button'
                            variant='nothing'
                            size='sm'
                            className='mr-auto text-onSurfaceVariant hover:text-onSurface'
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                        >
                            Очистить
                        </Button>
                    )}
                    <Button type='button' size='sm' onClick={() => setOpen(false)}>
                        Готово
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
