import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import ArrowUpIcon from '@/components/icons/arrow/ArrowUp24.tsx';
import ArrowDownIcon from '@/components/icons/arrow/ArrowDown24.tsx';
import PicturePlusIcon from '@/components/icons/picturePlus/PicturePlus24.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import CancelIcon from '@/components/icons/cancel/Cancel32.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import { Select } from '@/components/ui/select.tsx';
import { DateTimePicker } from '@/components/ui/date-time-picker.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { axiosSession, cn, convertToBase64, openExternal } from '@/lib/utils.ts';
import { coverUrl, eventPortraitUrl, eventWideUrl } from '@/lib/cdn.ts';
import { isAdmin } from '@/lib/bitmask.ts';
import { EVENT_TIMEZONES, utcToZonedInput, yandexMapsUrl, zonedInputToUtc } from '@/lib/events.ts';
import { useGlobalStore } from '@/store/global.ts';
import { EventMetro, EventStatus, SmashUpEvent, useEventStore } from '@/store/entities/event.ts';
import { User, useUserStore } from '@/store/entities/user.ts';
import { FormField } from '@/router/shared/components/mashup/MashupFormParts.tsx';
import Hint from '@/router/shared/components/Hint.tsx';
import { EventCard } from '@/router/features/events/EventParts.tsx';
import TicketsAdminBar from '@/router/features/events/TicketsAdminBar.tsx';
import TicketPreview from '@/router/features/events/TicketPreview.tsx';
import CoverCropDialog from '@/router/shared/components/image/CoverCropDialog.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { StateView } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useUserSearch } from '@/router/shared/hooks/useUserSearch.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { SmashUpResponse } from '@/router/shared/types/smashup.ts';

/** Слот в форме; `user` — только для показа аватара и ника. */
interface SlotDraft {
    /** Только для ключа React: при перестановке и удалении поле не теряет фокус. */
    uid: string;
    name: string;
    userIds: number[];
    user?: Pick<User, 'username' | 'imageUrl'>;
}

interface Draft {
    name: string;
    description: string;
    status: EventStatus;
    start: string; // datetime-local в поясе площадки
    end: string;
    timezone: string;
    city: string;
    venue: string;
    address: string;
    lat: string;
    lon: string;
    metro: EventMetro[];
    lineup: SlotDraft[];
    ticketUrl: string;
    priceFrom: string;
    ageLimit: string;
    square: string | null; // data-URL нового кадра
    portrait: string | null;
    wide: string | null;
}

const EMPTY: Draft = {
    name: '',
    description: '',
    status: 'DRAFT',
    start: '',
    end: '',
    timezone: 'Europe/Moscow',
    city: '',
    venue: '',
    address: '',
    lat: '',
    lon: '',
    metro: [],
    lineup: [],
    ticketUrl: '',
    priceFrom: '',
    ageLimit: '18',
    square: null,
    portrait: null,
    wide: null
};

function fromEvent(e: SmashUpEvent): Draft {
    return {
        ...EMPTY,
        name: e.name,
        description: e.description,
        status: e.status,
        start: utcToZonedInput(e.startsAt, e.timezone),
        end: e.endsAt ? utcToZonedInput(e.endsAt, e.timezone) : '',
        timezone: e.timezone,
        city: e.city,
        venue: e.venue,
        address: e.address,
        lat: e.lat?.toString() ?? '',
        lon: e.lon?.toString() ?? '',
        metro: e.metro,
        lineup: e.lineup.map((s) => ({ ...s, uid: crypto.randomUUID() })),
        ticketUrl: e.ticketUrl ?? '',
        priceFrom: e.priceFrom?.toString() ?? '',
        ageLimit: e.ageLimit?.toString() ?? ''
    };
}

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Черновик' },
    { value: 'PUBLISHED', label: 'Опубликовано' },
    { value: 'CANCELLED', label: 'Отменено' }
];

const num = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')));
const stripDataUrl = (url: string) => url.substring(url.indexOf(',') + 1);

/** Создание (`/event/new`) и правка (`/event/:eventId/edit`) мероприятия. Только админ. */
export default function EventEditorPage() {
    const { eventId } = useParams();
    const id = eventId ? Number(eventId) : null;
    const currentUser = useGlobalStore((s) => s.currentUser);
    const [existing, setExisting] = useState<SmashUpEvent | null>(null);
    const [draft, setDraft] = useState<Draft | null>(id === null ? EMPTY : null);
    const [notFound, setNotFound] = useState(false);

    useDocumentTitle(id === null ? 'Новое мероприятие' : 'Правка мероприятия');

    useEffect(() => {
        if (id === null) return;
        if (!Number.isSafeInteger(id) || id <= 0) return setNotFound(true);
        let cancelled = false;
        // после «Создать» тот же экран переходит на /event/:id/edit — старый черновик не показываем
        setDraft(null);
        setNotFound(false);
        useEventStore
            .getState()
            .getOneById(id)
            .then((e) => {
                if (cancelled) return;
                setExisting(e);
                setDraft(fromEvent(e));
            })
            .catch(() => !cancelled && setNotFound(true));
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (!currentUser || !isAdmin(currentUser.permissions))
        return <StateView title='Нет доступа' description='Мероприятия заводят только админы.' />;
    if (notFound) return <StateView title='Мероприятие не найдено' />;
    if (!draft) return null;

    return (
        <TooltipProvider>
            <EventForm key={id ?? 'new'} initial={draft} existing={existing} />
        </TooltipProvider>
    );
}

type StepId = 'main' | 'when' | 'place' | 'lineup' | 'poster' | 'sale' | 'tickets';

const STEPS: { id: StepId; title: string; hint: string }[] = [
    { id: 'main', title: 'Основное', hint: 'Название, описание и видимость' },
    { id: 'when', title: 'Когда', hint: 'Время на часах площадки, в её часовом поясе' },
    { id: 'place', title: 'Площадка', hint: 'Адрес, точка для кнопок карт и метро' },
    { id: 'lineup', title: 'Лайнап', hint: 'Мешаперы SmashUp и артисты без аккаунта' },
    {
        id: 'poster',
        title: 'Афиша',
        hint: 'Три формата: карточка, баннер и квадрат для мелких мест'
    },
    { id: 'sale', title: 'Продажа', hint: 'Куда ведёт кнопка с ценой и возрастное ограничение' },
    { id: 'tickets', title: 'Билеты', hint: 'Карта-билет и выдача тем, кто отметил «Пойду»' }
];

const QUIET_BTN = 'text-onSurfaceVariant hover:text-onSurface';

/**
 * Мастер мероприятия — как редактор билетов: шаги слева, справа живая карточка из списка.
 * Сохраняется кнопкой; у нового мероприятия последний шаг «Билеты» сначала создаёт его,
 * затем открывает тот же шаг уже с оформлением и выдачей.
 */
function EventForm({ initial, existing }: { initial: Draft; existing: SmashUpEvent | null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { sent, guard } = useSubmitGuard();
    const [d, setD] = useState<Draft>(initial);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [stepIndex, setStepIndex] = useState(() =>
        Math.max(
            0,
            STEPS.findIndex((st) => st.id === (location.state as { step?: StepId } | null)?.step)
        )
    );
    const step = STEPS[stepIndex];
    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
        setD((prev) => ({ ...prev, [key]: value }));

    /** Ошибка ведёт на шаг, где её исправлять. */
    const fail = (at: StepId, field: string, after: string) => {
        setStepIndex(STEPS.findIndex((st) => st.id === at));
        toast({
            element: <ErrorToast icon before='Проверь' field={field} after={after} />,
            duration: 3000,
            variant: 'destructive'
        });
    };

    const save = () =>
        guard(async () => {
            const startsAt = zonedInputToUtc(d.start, d.timezone);
            const endsAt = d.end ? zonedInputToUtc(d.end, d.timezone) : null;
            if (d.name.trim().length < 2) return fail('main', 'название,', 'нужно от 2 символов.');
            if (startsAt === null) return fail('when', 'начало,', 'нужны дата и время.');
            if (endsAt !== null && endsAt <= startsAt)
                return fail('when', 'конец,', 'он должен быть позже начала.');
            if (!d.city.trim() || !d.venue.trim())
                return fail('place', 'площадку,', 'нужны город и название.');
            const lat = num(d.lat);
            const lon = num(d.lon);
            if ((lat === null) !== (lon === null) || Number.isNaN(lat) || Number.isNaN(lon))
                return fail('place', 'координаты,', 'нужны обе или ни одной.');

            const body = {
                name: d.name,
                description: d.description,
                status: d.status,
                startsAt,
                endsAt,
                timezone: d.timezone,
                city: d.city,
                venue: d.venue,
                address: d.address,
                lat,
                lon,
                metro: d.metro.filter((m) => m.name.trim()),
                lineup: d.lineup.map(({ name, userIds }) => ({ name, userIds })),
                ticketUrl: d.ticketUrl.trim() || null,
                priceFrom: num(d.priceFrom),
                ageLimit: num(d.ageLimit),
                basedImageFile: d.square ? stripDataUrl(d.square) : undefined,
                basedPortraitFile: d.portrait ? stripDataUrl(d.portrait) : undefined,
                basedWideFile: d.wide ? stripDataUrl(d.wide) : undefined
            };
            await axiosSession
                .post(existing ? `/event/edit?id=${existing.id}` : '/event/create', body)
                .then((r: AxiosResponse<SmashUpResponse<SmashUpEvent>>) => {
                    const saved = r.data.response;
                    useEventStore.getState().updateOneById(saved.id, saved);
                    if (existing) {
                        navigate(`/event/${saved.id}`);
                    } else {
                        // новое: продолжаем мастер на шаге билетов, уже с id
                        navigate(`/event/${saved.id}/edit`, {
                            replace: true,
                            state: { step: 'tickets' }
                        });
                    }
                })
                .catch(axiosCatcher(toast, 'при сохранении'));
        });

    const remove = () =>
        guard(async () => {
            if (!existing) return;
            await axiosSession
                .post(`/event/delete?id=${existing.id}`)
                .then(() => navigate('/events'))
                .catch(axiosCatcher(toast, 'при удалении'));
        });

    const steps: Record<StepId, ReactNode> = {
        main: (
            <>
                <FormField label='Название'>
                    <Input
                        value={d.name}
                        maxLength={128}
                        onChange={(e) => set('name', e.target.value)}
                    />
                </FormField>
                <FormField label='Описание'>
                    <Textarea
                        value={d.description}
                        maxLength={4000}
                        rows={5}
                        onChange={(e) => set('description', e.target.value)}
                    />
                </FormField>
                <FormField
                    label={
                        <span className='flex items-center gap-x-1.5'>
                            Статус
                            <Hint text='Черновик видят только админы. Отменённое остаётся на сайте с пометкой.' />
                        </span>
                    }
                >
                    <SegmentedControl
                        aria-label='Статус'
                        options={STATUS_OPTIONS}
                        value={d.status}
                        onChange={(v) => set('status', v)}
                    />
                </FormField>
            </>
        ),
        when: (
            <>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField label='Начало'>
                        <DateTimePicker
                            aria-label='Начало'
                            value={d.start}
                            onChange={(v) => set('start', v)}
                        />
                    </FormField>
                    <FormField
                        label={
                            <span className='flex items-center gap-x-1.5'>
                                Конец
                                <Hint text='Необязательно. Без него мероприятие считается прошедшим через 12 часов после начала.' />
                            </span>
                        }
                    >
                        <DateTimePicker
                            aria-label='Конец'
                            placeholder='Не указан'
                            clearable
                            value={d.end}
                            onChange={(v) => set('end', v)}
                        />
                    </FormField>
                </div>
                <FormField label='Часовой пояс площадки'>
                    <Select
                        aria-label='Часовой пояс площадки'
                        value={d.timezone}
                        options={EVENT_TIMEZONES}
                        onChange={(v) => set('timezone', v)}
                    />
                </FormField>
            </>
        ),
        place: (
            <>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField label='Город'>
                        <Input
                            value={d.city}
                            maxLength={64}
                            onChange={(e) => set('city', e.target.value)}
                        />
                    </FormField>
                    <FormField label='Название площадки'>
                        <Input
                            value={d.venue}
                            maxLength={128}
                            onChange={(e) => set('venue', e.target.value)}
                        />
                    </FormField>
                </div>
                <FormField label='Адрес'>
                    <Input
                        value={d.address}
                        maxLength={256}
                        onChange={(e) => set('address', e.target.value)}
                    />
                </FormField>
                <PointField d={d} set={set} />
                <MetroField value={d.metro} onChange={(v) => set('metro', v)} />
            </>
        ),
        lineup: <LineupEditor value={d.lineup} onChange={(v) => set('lineup', v)} />,
        poster: (
            <div className='flex flex-wrap gap-6'>
                <ImagePicker
                    label='Вертикальная 4:5'
                    hint='Карточка в списке мероприятий. От 800×1000.'
                    aspect={0.8}
                    value={d.portrait}
                    current={
                        existing?.imagePortraitUrl
                            ? eventPortraitUrl(existing.imagePortraitUrl)
                            : null
                    }
                    onChange={(v) => set('portrait', v)}
                />
                <ImagePicker
                    label='Широкая 16:9'
                    hint='Афиша на странице мероприятия. От 1280×720.'
                    aspect={16 / 9}
                    minSide={720}
                    maxOut={1920}
                    value={d.wide}
                    current={existing?.imageWideUrl ? eventWideUrl(existing.imageWideUrl) : null}
                    onChange={(v) => set('wide', v)}
                />
                <ImagePicker
                    label='Квадрат'
                    hint='Строки, компиляция, уведомления. От 800×800.'
                    aspect={1}
                    value={d.square}
                    current={existing?.imageUrl ? coverUrl('event', existing.imageUrl, 400) : null}
                    onChange={(v) => set('square', v)}
                />
            </div>
        ),
        sale: (
            <>
                <FormField label='Ссылка на продажу'>
                    <Input
                        type='url'
                        placeholder='https://'
                        value={d.ticketUrl}
                        onChange={(e) => set('ticketUrl', e.target.value)}
                    />
                </FormField>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                        label={
                            <span className='flex items-center gap-x-1.5'>
                                Цена от, ₽
                                <Hint text='0 значит вход свободный. Пусто: цену не показываем.' />
                            </span>
                        }
                    >
                        <Input
                            inputMode='numeric'
                            value={d.priceFrom}
                            onChange={(e) => set('priceFrom', e.target.value.replace(/\D/g, ''))}
                        />
                    </FormField>
                    <FormField label='Возраст'>
                        <Input
                            inputMode='numeric'
                            value={d.ageLimit}
                            onChange={(e) =>
                                set('ageLimit', e.target.value.replace(/\D/g, '').slice(0, 2))
                            }
                        />
                    </FormField>
                </div>
            </>
        ),
        tickets: existing ? (
            <>
                <p className='text-sm text-onSurfaceVariant'>
                    Карта-билет в стиле мероприятия: у каждого участника свои ник, номер и код
                    входа. Оформи её, а затем выдай тем, кто отметил «Пойду».
                </p>
                <TicketsAdminBar event={existing} />
            </>
        ) : (
            <div className='flex flex-col items-start gap-y-4'>
                <p className='text-sm text-onSurfaceVariant'>
                    Билеты привязаны к мероприятию. Создай его, и здесь же откроется оформление
                    карты-билета и выдача.
                </p>
                <Button onClick={save} disabled={sent}>
                    Создать мероприятие
                </Button>
            </div>
        )
    };

    const preview: SmashUpEvent = {
        ...(existing ?? ({} as SmashUpEvent)),
        id: existing?.id ?? 0,
        name: d.name || 'Название мероприятия',
        startsAt: zonedInputToUtc(d.start, d.timezone) ?? Date.now(),
        endsAt: null,
        timezone: d.timezone,
        city: d.city || 'Город',
        venue: d.venue || 'Площадка',
        ageLimit: num(d.ageLimit),
        priceFrom: num(d.priceFrom),
        status: d.status,
        imageUrl: existing?.imageUrl ?? null,
        imagePortraitUrl: existing?.imagePortraitUrl ?? null,
        goingCount: existing?.goingCount ?? 0,
        going: false
    };

    return (
        <div className='flex flex-col gap-y-6 pb-12'>
            <div className='flex flex-wrap items-center gap-3'>
                <h1 className='mr-auto text-[28px] font-semibold text-onSurface'>
                    {existing ? 'Правка мероприятия' : 'Новое мероприятие'}
                </h1>
                <Button variant='nothing' size='sm' asChild className={QUIET_BTN}>
                    <Link to={existing ? `/event/${existing.id}` : '/events'}>Отмена</Link>
                </Button>
                {existing && (
                    <Button size='sm' onClick={save} disabled={sent}>
                        Сохранить
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)]'>
                {/* Слева — шаги. px-1: кольцо фокуса полей выходит на 4px за поле */}
                <div className='order-2 flex min-w-0 flex-col gap-6 px-1 md:flex-row lg:order-1'>
                    <nav
                        aria-label='Шаги'
                        className='-mx-1 flex gap-1 overflow-x-auto px-1 scrollbar-none md:mx-0 md:w-[180px] md:shrink-0 md:flex-col md:px-0'
                    >
                        {STEPS.map((st, i) => (
                            <button
                                key={st.id}
                                type='button'
                                aria-current={i === stepIndex ? 'step' : undefined}
                                onClick={() => setStepIndex(i)}
                                className={cn(
                                    'flex h-10 shrink-0 items-center gap-x-3 rounded-xl px-3 text-left text-sm font-medium transition-colors motion-reduce:transition-none',
                                    i === stepIndex
                                        ? 'bg-surface text-onSurface'
                                        : 'text-onSurfaceVariant hover:text-onSurface'
                                )}
                            >
                                <span className='w-4 shrink-0 text-[13px] tabular-nums text-additionalText'>
                                    {i + 1}
                                </span>
                                <span className='truncate'>{st.title}</span>
                            </button>
                        ))}
                    </nav>

                    <section key={step.id} className='flex min-w-0 flex-1 flex-col gap-y-5'>
                        <div className='flex flex-col gap-y-1'>
                            <span className='text-[13px] tabular-nums text-additionalText'>
                                Шаг {stepIndex + 1} из {STEPS.length}
                            </span>
                            <h2 className='flex items-center gap-x-1.5 text-[20px] font-semibold text-onSurface'>
                                {step.title}
                                <Hint text={step.hint} />
                            </h2>
                        </div>

                        <div className='flex flex-col gap-y-4'>{steps[step.id]}</div>

                        <div className='flex items-center justify-between gap-3 pt-2'>
                            <Button
                                variant='nothing'
                                size='sm'
                                className={cn(QUIET_BTN, stepIndex === 0 && 'invisible')}
                                onClick={() => setStepIndex((i) => i - 1)}
                            >
                                Назад
                            </Button>
                            {stepIndex < STEPS.length - 1 && (
                                <Button size='sm' onClick={() => setStepIndex((i) => i + 1)}>
                                    Далее: {STEPS[stepIndex + 1].title}
                                </Button>
                            )}
                        </div>

                        {existing && step.id === 'main' && (
                            <div className='border-t border-white/10 pt-4'>
                                {confirmDelete ? (
                                    <span className='flex items-center gap-x-2 text-[13px] text-onSurfaceVariant'>
                                        Удалить насовсем вместе с билетами?
                                        <Button
                                            variant='error'
                                            size='sm'
                                            onClick={remove}
                                            disabled={sent}
                                        >
                                            Удалить
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => setConfirmDelete(false)}
                                        >
                                            Нет
                                        </Button>
                                    </span>
                                ) : (
                                    <Button
                                        variant='nothing'
                                        size='sm'
                                        className='px-0 text-error'
                                        onClick={() => setConfirmDelete(true)}
                                    >
                                        Удалить мероприятие
                                    </Button>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Справа — карточка, как в списке; на узких экранах первой */}
                <div className='order-1 flex justify-center lg:sticky lg:top-[max(1rem,calc(50dvh-360px))] lg:order-2'>
                    <div className='w-full max-w-[340px]'>
                        {step.id === 'tickets' && existing ? (
                            <TicketPreview eventId={existing.id} />
                        ) : (
                            <EventCard
                                event={preview}
                                posterSrc={d.portrait ?? undefined}
                                preview
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Точка на карте: поиск по «площадка, город» в Nominatim (OSM) прямо из браузера админа,
 * координаты можно поправить руками и проверить в Яндекс Картах.
 * Запрос идёт через `fetch`, НЕ через `axiosSession`: тот приклеил бы наш Bearer-токен.
 */
function PointField({
    d,
    set
}: {
    d: Draft;
    set: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
}) {
    const { toast } = useToast();
    const [busy, setBusy] = useState(false);

    const find = async () => {
        const queries = [`${d.venue}, ${d.city}`, `${d.address}, ${d.city}`].filter(
            (q) => q.replace(/[,\s]/g, '').length > 0
        );
        setBusy(true);
        try {
            for (const q of queries) {
                const r = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ru&q=${encodeURIComponent(q)}`
                );
                const [hit] = (await r.json()) as { lat: string; lon: string }[];
                if (hit) {
                    set('lat', Number(hit.lat).toFixed(6));
                    set('lon', Number(hit.lon).toFixed(6));
                    return;
                }
            }
            toast({
                element: (
                    <ErrorToast
                        icon
                        before='Не нашли'
                        field='площадку на карте.'
                        after='Введи координаты руками.'
                    />
                ),
                duration: 3000,
                variant: 'destructive'
            });
        } catch {
            toast({
                element: (
                    <ErrorToast
                        icon
                        before='Поиск'
                        field='по карте'
                        after='не ответил, попробуй ещё раз.'
                    />
                ),
                duration: 3000,
                variant: 'destructive'
            });
        } finally {
            setBusy(false);
        }
    };

    const lat = num(d.lat);
    const lon = num(d.lon);
    return (
        <FormField
            label={
                <span className='flex items-center gap-x-1.5'>
                    Точка на карте
                    <Hint text='Нужна для кнопок «Яндекс Карты» и «2ГИС». Ищем по названию площадки и городу, затем по адресу.' />
                </span>
            }
        >
            <div className='flex flex-wrap items-center gap-2'>
                <Input
                    className='w-[160px]'
                    placeholder='Широта'
                    value={d.lat}
                    onChange={(e) => set('lat', e.target.value)}
                />
                <Input
                    className='w-[160px]'
                    placeholder='Долгота'
                    value={d.lon}
                    onChange={(e) => set('lon', e.target.value)}
                />
                <Button type='button' variant='outline' size='sm' onClick={find} disabled={busy}>
                    Найти
                </Button>
                {lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon) && (
                    <Button
                        type='button'
                        variant='link'
                        size='sm'
                        onClick={() => openExternal(yandexMapsUrl(lat, lon))}
                    >
                        Проверить в Яндекс Картах
                    </Button>
                )}
            </div>
        </FormField>
    );
}

function MetroField({
    value,
    onChange
}: {
    value: EventMetro[];
    onChange: (v: EventMetro[]) => void;
}) {
    const patch = (i: number, p: Partial<EventMetro>) =>
        onChange(value.map((m, j) => (j === i ? { ...m, ...p } : m)));
    return (
        <FormField label='Метро'>
            <div className='flex flex-col gap-y-2'>
                {value.map((m, i) => (
                    <div key={i} className='flex items-center gap-x-2'>
                        <input
                            type='color'
                            aria-label='Цвет линии'
                            value={/^#[0-9a-f]{6}$/i.test(m.color ?? '') ? m.color : '#a887f8'}
                            onChange={(e) => patch(i, { color: e.target.value })}
                            className='size-9 shrink-0 cursor-pointer rounded-full bg-transparent'
                        />
                        <Input
                            className='min-w-0 flex-1'
                            placeholder='Станция'
                            maxLength={64}
                            value={m.name}
                            onChange={(e) => patch(i, { name: e.target.value })}
                        />
                        <Input
                            className='w-[110px]'
                            placeholder='Метров'
                            inputMode='numeric'
                            value={m.distanceM?.toString() ?? ''}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 5);
                                patch(i, { distanceM: v ? Number(v) : undefined });
                            }}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            size='control'
                            aria-label='Убрать станцию'
                            onClick={() => onChange(value.filter((_, j) => j !== i))}
                        >
                            <CancelIcon size={20} />
                        </Button>
                    </div>
                ))}
                {value.length < 5 && (
                    <Button
                        type='button'
                        variant='nothing'
                        size='sm'
                        className='w-fit px-0 text-primary hover:text-onSurface'
                        onClick={() => onChange([...value, { name: '' }])}
                    >
                        <PlusIcon size={18} className='text-current' /> Добавить станцию
                    </Button>
                )}
            </div>
        </FormField>
    );
}

/** Лайнап: артисты SmashUp — из поиска по нику, остальные — просто именем. Порядок — стрелками. */
function LineupEditor({
    value,
    onChange
}: {
    value: SlotDraft[];
    onChange: (v: SlotDraft[]) => void;
}) {
    const [query, setQuery] = useState('');
    const found = useUserSearch(query);

    // у сохранённого мероприятия в слотах только id — подтянуть аватары и ники
    useEffect(() => {
        const missing = value
            .filter((s) => s.userIds.length > 0 && !s.user)
            .flatMap((s) => s.userIds);
        if (missing.length === 0) return;
        useUserStore
            .getState()
            .getManyByIds([...new Set(missing)], true)
            .then((users) => {
                const byId = new Map(users.map((u) => [u.id, u]));
                onChange(
                    value.map((s) =>
                        s.user || !byId.has(s.userIds[0])
                            ? s
                            : { ...s, user: byId.get(s.userIds[0]) }
                    )
                );
            })
            .catch(() => {});
        // только при первом показе: дальше user кладётся при добавлении
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const move = (i: number, delta: number) => {
        const next = [...value];
        [next[i], next[i + delta]] = [next[i + delta], next[i]];
        onChange(next);
    };
    const addGuest = () => {
        const name = query.trim();
        if (!name) return;
        onChange([...value, { uid: crypto.randomUUID(), name, userIds: [] }]);
        setQuery('');
    };
    const taken = new Set(value.flatMap((s) => s.userIds));

    return (
        <div className='flex flex-col gap-y-3'>
            {value.length > 0 && (
                <ol className='flex flex-col gap-y-1'>
                    {value.map((s, i) => (
                        <li key={s.uid} className='flex items-center gap-x-2'>
                            {s.user ? (
                                <ImageWithSkeleton
                                    src={coverUrl('user', s.user.imageUrl, 100)}
                                    alt=''
                                    className='size-9 shrink-0 rounded-full'
                                />
                            ) : (
                                <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-sm uppercase text-onSurface'>
                                    {s.name.slice(0, 1)}
                                </span>
                            )}
                            <Input
                                className='min-w-0 flex-1'
                                aria-label='Имя в лайнапе'
                                maxLength={64}
                                value={s.name}
                                onChange={(e) =>
                                    onChange(
                                        value.map((x, j) =>
                                            j === i ? { ...x, name: e.target.value } : x
                                        )
                                    )
                                }
                            />
                            {s.user && (
                                <span className='hidden truncate text-[13px] text-onSurfaceVariant sm:block'>
                                    @{s.user.username}
                                </span>
                            )}
                            <Button
                                type='button'
                                variant='ghost'
                                size='control'
                                aria-label='Выше'
                                disabled={i === 0}
                                onClick={() => move(i, -1)}
                            >
                                <ArrowUpIcon size={20} />
                            </Button>
                            <Button
                                type='button'
                                variant='ghost'
                                size='control'
                                aria-label='Ниже'
                                disabled={i === value.length - 1}
                                onClick={() => move(i, 1)}
                            >
                                <ArrowDownIcon size={20} />
                            </Button>
                            <Button
                                type='button'
                                variant='ghost'
                                size='control'
                                aria-label='Убрать'
                                onClick={() => onChange(value.filter((_, j) => j !== i))}
                            >
                                <CancelIcon size={20} />
                            </Button>
                        </li>
                    ))}
                </ol>
            )}

            <div className='flex items-center gap-x-2'>
                <Input
                    className='min-w-0 flex-1'
                    startIcon={SearchIcon}
                    placeholder='Ник на SmashUp или имя артиста'
                    value={query}
                    maxLength={64}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && found.length === 0 && addGuest()}
                />
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={!query.trim()}
                    onClick={addGuest}
                >
                    Без аккаунта
                </Button>
            </div>
            {found.filter((u) => !taken.has(u.id)).length > 0 && (
                <div className='-mt-1 flex flex-col gap-y-0.5'>
                    {found
                        .filter((u) => !taken.has(u.id))
                        .slice(0, 5)
                        .map((u) => (
                            <button
                                key={u.id}
                                type='button'
                                onClick={() => {
                                    onChange([
                                        ...value,
                                        {
                                            uid: crypto.randomUUID(),
                                            name: u.username,
                                            userIds: [u.id],
                                            user: u
                                        }
                                    ]);
                                    setQuery('');
                                }}
                                className='flex items-center gap-x-3 rounded-2xl p-1.5 text-left transition-colors hover:bg-onSurface/5 motion-reduce:transition-none'
                            >
                                <ImageWithSkeleton
                                    src={coverUrl('user', u.imageUrl, 100)}
                                    alt=''
                                    className='size-9 shrink-0 rounded-full'
                                />
                                <span className='truncate text-sm font-medium text-onSurface'>
                                    {u.username}
                                </span>
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}

/** Выбор картинки → кадр в `CoverCropDialog` → data-URL. Проверка минимума — перед отправкой на бэке. */
function ImagePicker({
    label,
    hint,
    aspect,
    minSide,
    maxOut,
    value,
    current,
    onChange
}: {
    label: string;
    hint: string;
    aspect: number;
    minSide?: number;
    maxOut?: number;
    value: string | null;
    current: string | null;
    onChange: (v: string | null) => void;
}) {
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const src = value ?? current;
    return (
        <div className='flex flex-col gap-y-2'>
            <span className='flex items-center gap-x-1.5 text-sm font-medium text-onSurfaceVariant'>
                {label}
                <Hint text={hint} />
            </span>
            <label
                className={cn(
                    'relative flex cursor-pointer items-center justify-center overflow-hidden rounded-[22px] bg-white/[0.07] text-onSurfaceVariant transition-colors hover:text-onSurface',
                    aspect === 1
                        ? 'aspect-square w-[180px]'
                        : aspect < 1
                          ? 'aspect-[4/5] w-[180px]'
                          : 'aspect-video w-[320px]'
                )}
            >
                {src && (
                    <img
                        src={src}
                        alt=''
                        className='absolute inset-0 h-full w-full object-cover'
                        draggable={false}
                    />
                )}
                <PicturePlusIcon
                    size={32}
                    color={src ? 'onSurface' : 'onSurfaceVariant'}
                    className={cn('relative', src && 'drop-shadow')}
                />
                <input
                    type='file'
                    accept='.png,.jpg,.jpeg'
                    className='sr-only'
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) setCropSrc(String(await convertToBase64(file)));
                    }}
                />
            </label>
            <CoverCropDialog
                src={cropSrc}
                aspect={aspect}
                minSide={minSide}
                maxOut={maxOut}
                title={`Афиша: ${label.toLowerCase()}`}
                onCancel={() => setCropSrc(null)}
                onDone={(url) => {
                    setCropSrc(null);
                    onChange(url);
                }}
            />
        </div>
    );
}
