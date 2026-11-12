import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarOutlineIcon from '@/components/icons/calendar/CalendarOutline28.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { isAdmin } from '@/lib/bitmask.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useEventList } from '@/router/features/events/useEventList.ts';
import { EventCard, EventRow } from '@/router/features/events/EventParts.tsx';
import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';

const CITY_KEY = 'events-city';

function readCity(): string | null {
    try {
        return localStorage.getItem(CITY_KEY);
    } catch {
        return null;
    }
}

/** Мероприятия: ближайшие крупными билетами (с фильтром по городу), ниже архив строками. */
export default function EventsPage() {
    useDocumentTitle('Мероприятия');
    const currentUser = useGlobalStore((s) => s.currentUser);
    const upcoming = useEventList('upcoming');
    const past = useEventList('past');
    const [city, setCity] = useState<string | null>(readCity);

    const cities = useMemo(
        () => [...new Set(upcoming.events.map((e) => e.city))].sort(),
        [upcoming.events]
    );
    // выбранного города больше нет в афише — показываем все
    const activeCity = city && cities.includes(city) ? city : null;
    const shown = activeCity
        ? upcoming.events.filter((e) => e.city === activeCity)
        : upcoming.events;

    const pick = (c: string | null) => {
        setCity(c);
        try {
            if (c) localStorage.setItem(CITY_KEY, c);
            else localStorage.removeItem(CITY_KEY);
        } catch {
            // приватный режим: просто не запоминаем
        }
    };

    if (upcoming.isError) return <ErrorState onRetry={upcoming.reload} />;

    return (
        <div className='flex flex-col gap-y-8 pb-8'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
                <h1 className='text-[28px] font-semibold text-onSurface'>Мероприятия</h1>
                {currentUser && isAdmin(currentUser.permissions) && (
                    <Button asChild size='sm'>
                        <Link to='/event/new'>
                            <PlusIcon size={18} className='text-surface' />
                            Новое мероприятие
                        </Link>
                    </Button>
                )}
            </div>

            {cities.length > 1 && (
                <div className='flex flex-wrap gap-2' role='group' aria-label='Город'>
                    {[null, ...cities].map((c) => (
                        <Button
                            key={c ?? 'all'}
                            size='sm'
                            variant='nothing'
                            aria-pressed={activeCity === c}
                            onClick={() => pick(c)}
                            className={cn(
                                'rounded-full',
                                activeCity === c
                                    ? 'bg-onSurface text-surface'
                                    : 'bg-surface text-onSurface hover:bg-onPrimary'
                            )}
                        >
                            {c ?? 'Все города'}
                        </Button>
                    ))}
                </div>
            )}

            {upcoming.isLoading ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className='aspect-[4/5] w-full rounded-[30px]' />
                    ))}
                </div>
            ) : shown.length === 0 ? (
                <StateView
                    className='min-h-0'
                    icon={<CalendarOutlineIcon size={48} />}
                    title='Скоро анонсируем'
                    description='Ближайших мероприятий пока нет. Загляни в архив ниже.'
                />
            ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {shown.map((e) => (
                        <EventCard key={e.id} event={e} />
                    ))}
                </div>
            )}

            {past.events.length > 0 && (
                <section className='flex flex-col gap-y-3'>
                    <h2 className='text-xl font-semibold text-onSurface'>Прошедшие</h2>
                    <div className='grid grid-cols-1 gap-1 lg:grid-cols-2'>
                        {past.events.map((e) => (
                            <EventRow key={e.id} event={e} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
