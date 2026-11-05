import { ReactNode, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import { cn, convertToBase64 } from '@/lib/utils.ts';
import { toast, useToast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { isAdmin, isModerator } from '@/lib/bitmask.ts';
import { useGlobalStore } from '@/store/global.ts';
import {
    CodePosition,
    CodeType,
    FoilType,
    formatTicketDate,
    InfoLayout,
    newTicketDraft,
    TextAlign,
    TicketEvent,
    CustomFontSlot,
    TicketFont,
    TicketSkin,
    TicketTier,
    useTicketDrafts
} from '@/store/ticketDrafts.ts';
import TicketCard from '@/router/features/tickets/TicketCard.tsx';
import LineupField from '@/router/features/tickets/LineupField.tsx';
import { StateView } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';

const LABEL = 'text-[13px] font-medium text-onSurfaceVariant';
const QUIET_BTN = 'hover:bg-onSurface/10';

/** Ужимаем картинку до 1200px по длинной стороне в webp — иначе localStorage кончится на втором билете. */
async function fitImage(file: File, max = 1200): Promise<string> {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d')?.drawImage(bmp, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', 0.85);
}

/** Подсказка — за «i» в тултипе, а не строкой под полем: шаг остаётся коротким. */
function Hint({ text }: { text: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type='button'
                    aria-label={text}
                    // внутри <label>: без preventDefault клик по «i» фокусировал бы поле
                    onClick={(e) => e.preventDefault()}
                    className='inline-flex size-5 shrink-0 items-center justify-center rounded-full text-additionalText hover:text-onSurface transition-colors motion-reduce:transition-none'
                >
                    <Info className='size-4' strokeWidth={1.75} />
                </button>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
    return (
        <label className='flex flex-col gap-y-2 min-w-0'>
            <span className={cn(LABEL, 'flex items-center gap-x-1')}>
                {label}
                {hint && <Hint text={hint} />}
            </span>
            {children}
        </label>
    );
}

const SVG_MAX_BYTES = 512 * 1024;

function ImageField({
    label,
    hint,
    value,
    svg,
    onChange
}: {
    label: string;
    hint: string;
    /** Принимать SVG — хранится как есть (вектор, без растрирования). */
    svg?: boolean;
    value?: string;
    onChange: (v?: string) => void;
}) {
    const input = useRef<HTMLInputElement>(null);
    return (
        <div className='flex items-center gap-x-3 min-w-0'>
            <button
                type='button'
                onClick={() => input.current?.click()}
                aria-label={`${label}: выбрать файл`}
                className='h-14 w-10 shrink-0 rounded-lg bg-white/[0.07] bg-cover bg-center hover:brightness-125 transition-[filter]'
                style={value ? { backgroundImage: `url(${value})` } : undefined}
            />
            <span className='flex min-w-0 flex-1 items-center gap-x-1 text-sm font-medium text-onSurface'>
                {label}
                <Hint text={hint} />
            </span>
            {value ? (
                <Button
                    variant='nothing'
                    size='sm'
                    className={QUIET_BTN}
                    onClick={() => onChange(undefined)}
                >
                    Убрать
                </Button>
            ) : (
                <Button
                    variant='nothing'
                    size='sm'
                    className={QUIET_BTN}
                    onClick={() => input.current?.click()}
                >
                    Выбрать
                </Button>
            )}
            <input
                ref={input}
                type='file'
                accept={`image/png,image/jpeg,image/webp${svg ? ',image/svg+xml' : ''}`}
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    if (file.type === 'image/svg+xml') {
                        // SVG идёт только в CSS background-image — скрипты внутри там не исполняются
                        if (file.size > SVG_MAX_BYTES)
                            return toast({
                                element: (
                                    <ErrorToast
                                        icon
                                        before={`${label}:`}
                                        after='SVG не больше 512 КБ.'
                                    />
                                ),
                                duration: 3000,
                                variant: 'destructive'
                            });
                        convertToBase64(file)
                            .then((d) => typeof d === 'string' && onChange(d))
                            .catch(() => {});
                        return;
                    }
                    fitImage(file)
                        .then(onChange)
                        .catch(() => {});
                }}
            />
        </div>
    );
}

function ColorField({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <label className='flex items-center gap-x-3 h-11 px-3 rounded-2xl bg-surface cursor-pointer'>
            <input
                type='color'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='h-6 w-6 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0'
            />
            <span className='text-sm font-medium text-onSurface'>{label}</span>
            <span className='ml-auto text-[13px] uppercase tabular-nums text-onSurfaceVariant'>
                {value}
            </span>
        </label>
    );
}

function SliderField({
    label,
    hint,
    shown,
    value,
    min,
    max,
    step,
    onChange
}: {
    label: string;
    hint?: string;
    shown: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className='flex flex-col gap-y-3'>
            <span className={cn(LABEL, 'flex items-center gap-x-1')}>
                {label}
                {hint && <Hint text={hint} />}
                <span className='ml-auto tabular-nums text-onSurface'>{shown}</span>
            </span>
            <Slider
                aria-label={label}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
            />
        </div>
    );
}

function Segmented<T extends string>(props: {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className='flex flex-col gap-y-2'>
            <span className={LABEL}>{props.label}</span>
            <SegmentedControl
                aria-label={props.label}
                tone='neutral'
                options={props.options}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

function Toggle({
    label,
    checked,
    onChange
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className='flex items-center justify-between gap-x-3 cursor-pointer'>
            <span className='text-sm font-medium text-onSurface'>{label}</span>
            <Switch checked={checked} onCheckedChange={onChange} />
        </label>
    );
}

const FOIL: { value: FoilType; label: string }[] = [
    { value: 'none', label: 'Нет' },
    { value: 'holo', label: 'Голограмма' },
    { value: 'sparkle', label: 'Блёстки' }
];
const INFO: { value: InfoLayout; label: string }[] = [
    { value: 'bottom', label: 'Снизу' },
    { value: 'top', label: 'Сверху' },
    { value: 'minimal', label: 'Только имя' }
];
const ALIGN: { value: TextAlign; label: string }[] = [
    { value: 'left', label: 'Слева' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'Справа' }
];
const BASE_FONTS: { value: TicketFont; label: string }[] = [
    { value: 'sans', label: 'Гротеск' },
    { value: 'mono', label: 'Моно' },
    { value: 'serif', label: 'Антиква' }
];
const CODE_POS: { value: CodePosition; label: string }[] = [
    { value: 'top', label: 'Сверху' },
    { value: 'center', label: 'В середине' },
    { value: 'bottom', label: 'Снизу' }
];
const CODE_TYPES: { value: CodeType; label: string }[] = [
    { value: 'qr', label: 'QR' },
    { value: 'pdf417', label: 'PDF417' },
    { value: 'aztec', label: 'Aztec' },
    { value: 'code128', label: 'Штрихкод' },
    { value: 'text', label: 'Текстом' }
];
// ~3 строки текста оборота при ширине карты; на самой карте всё равно line-clamp-3
const BACK_TEXT_MAX = 150;
/** Не больше 3 строк: всё после второго переноса склеиваем в третью строку (и при вставке). */
const maxThreeLines = (v: string) => {
    const lines = v.split('\n');
    return lines.length <= 3 ? v : [...lines.slice(0, 2), lines.slice(2).join(' ')].join('\n');
};
const FONT_MAX_BYTES = 2 * 1024 * 1024;

type StepId =
    'event' | 'lineup' | 'images' | 'text' | 'color' | 'foil' | 'back' | 'tiers' | 'after';

/**
 * Шаги — в порядке, в котором билет собирается: сначала что за мероприятие, потом
 * лицо (картинка → текст → цвет → фольга), потом оборот, и только потом уровни —
 * они переопределяют уже готовое базовое оформление. «После мероприятия» — последним.
 */
const STEPS: { id: StepId; title: string; hint: string; side?: 'back'; past?: boolean }[] = [
    { id: 'event', title: 'Мероприятие', hint: 'Что, где и когда. Попадёт на каждый билет' },
    { id: 'lineup', title: 'Лайнап', hint: 'Мешаперы SmashUp. Под билетом ведут в их профили' },
    { id: 'images', title: 'Картинка', hint: 'Арт в формате 5:7 и, если есть, передний план' },
    { id: 'text', title: 'Текст', hint: 'Раскладка, выравнивание и шрифты' },
    { id: 'color', title: 'Цвет и форма', hint: 'Фон, цвет текста, углы и рамка' },
    { id: 'foil', title: 'Фольга и свет', hint: 'Что блестит при наклоне и как сильно' },
    { id: 'back', title: 'Оборот', hint: 'Код для входа, правила и партнёры', side: 'back' },
    {
        id: 'tiers',
        title: 'Уровни',
        hint: 'VIP и другие уровни меняют только то, что в них задано. Выбери уровень и поменяй его на шагах с 3 по 7'
    },
    {
        id: 'after',
        title: 'После мероприятия',
        hint: 'Билет становится памятью: штамп на обороте, фольга ярче',
        side: 'back',
        past: true
    }
];

/**
 * Редактор билетов на оффлайн-мероприятия. Только для модераторов и админов
 * (проверка на клиенте — косметика; данных тут нет, пока это мок в localStorage).
 * Пошагово, как онбординг: слева список шагов и один шаг, справа — карта.
 * Выбран уровень (VIP…) — правки оформления пишутся в его переопределения, а не в базу.
 */
export default function TicketEditorPage() {
    useDocumentTitle('Билеты');
    const { toast } = useToast();
    const currentUser = useGlobalStore((s) => s.currentUser);
    const { drafts, save, remove } = useTicketDrafts();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [tierId, setTierId] = useState<string | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const fontInput = useRef<HTMLInputElement>(null);
    const fontSlot = useRef<CustomFontSlot>('custom');

    const draft = drafts.find((d) => d.id === selectedId) ?? drafts[0];

    if (currentUser === null) return null;
    if (!isModerator(currentUser.permissions) && !isAdmin(currentUser.permissions))
        return (
            <StateView title='Нет доступа' description='Редактор билетов доступен только команде' />
        );
    if (!draft) return null;

    const step = STEPS[stepIndex];
    const tier = draft.tiers.find((t) => t.id === tierId);
    const skin: TicketSkin = tier ? { ...draft.skin, ...tier.skin } : draft.skin;

    // Свежий черновик из стора, а не из замыкания рендера: картинки ужимаются асинхронно, и две
    // загрузки подряд (арт + передний план) иначе затирали друг друга — вторая писала поверх
    // устаревшей копии, где первой ещё нет.
    const fresh = () => useTicketDrafts.getState().drafts.find((d) => d.id === draft.id) ?? draft;
    const setTiers = (tiers: TicketTier[]) => save({ ...fresh(), tiers });
    const updateEvent = (event: Partial<TicketEvent>) => {
        const d = fresh();
        save({ ...d, event: { ...d.event, ...event } });
    };
    const updateSkin = (patch: Partial<TicketSkin>) => {
        const d = fresh();
        if (tier)
            setTiers(
                d.tiers.map((t) => (t.id === tier.id ? { ...t, skin: { ...t.skin, ...patch } } : t))
            );
        else save({ ...d, skin: { ...d.skin, ...patch } });
    };

    const ev = (key: 'name' | 'date' | 'time' | 'city' | 'venue' | 'stampText') => ({
        value: draft.event[key] ?? '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateEvent({ [key]: e.target.value })
    });

    const SLOT_KEY = { custom: 'customFont', custom2: 'customFont2' } as const;
    const shortName = (n: string) => (n.length > 16 ? `${n.slice(0, 15)}…` : n);
    const fonts = [
        ...BASE_FONTS,
        ...(['custom', 'custom2'] as const)
            .filter((slot) => skin[SLOT_KEY[slot]])
            .map((slot) => ({ value: slot, label: shortName(skin[SLOT_KEY[slot]]!.name) }))
    ];

    const fail = (after: string) =>
        toast({
            element: <ErrorToast icon before='Шрифт:' after={after} />,
            duration: 3000,
            variant: 'destructive'
        });

    const uploadFont = async (file: File, slot: CustomFontSlot) => {
        if (!/\.(woff2?|ttf|otf)$/i.test(file.name))
            return fail('подойдёт woff2, woff, ttf или otf.');
        if (file.size > FONT_MAX_BYTES) return fail('не больше 2 МБ.');
        const data = await convertToBase64(file);
        if (typeof data !== 'string') return;
        try {
            await new FontFace('ticket-font-check', `url(${data})`).load();
        } catch {
            return fail('файл не читается как шрифт.');
        }
        // Сразу применяем: первый шрифт — к заголовку, второй — к тексту.
        updateSkin({
            [SLOT_KEY[slot]]: { name: file.name.replace(/\.[^.]+$/, ''), data },
            ...(slot === 'custom' ? { titleFont: slot } : { bodyFont: slot })
        });
    };

    const removeFont = (slot: CustomFontSlot) =>
        updateSkin({
            [SLOT_KEY[slot]]: undefined,
            titleFont: skin.titleFont === slot ? 'sans' : skin.titleFont,
            bodyFont: skin.bodyFont === slot ? 'sans' : skin.bodyFont
        });

    const selectDraft = (id: string | null) => {
        setSelectedId(id);
        setTierId(null);
        setConfirmDelete(false);
    };

    const createDraft = () => {
        const d = newTicketDraft();
        save(d);
        selectDraft(d.id);
        setStepIndex(0);
    };

    const addTier = () => {
        const t: TicketTier = {
            id: crypto.randomUUID(),
            name: draft.tiers.length ? `Уровень ${draft.tiers.length + 1}` : 'VIP',
            skin: {}
        };
        setTiers([...draft.tiers, t]);
        setTierId(t.id);
    };

    const chip = (active: boolean) =>
        cn(
            'h-9 shrink-0 max-w-[200px] truncate rounded-xl px-3 text-[13px] font-medium transition-colors motion-reduce:transition-none',
            active
                ? 'bg-onSurface text-surface'
                : 'bg-surface text-onSurfaceVariant hover:text-onSurface'
        );

    const steps: Record<StepId, ReactNode> = {
        event: (
            <>
                <Field label='Название'>
                    <Input maxLength={48} {...ev('name')} />
                </Field>
                <div className='grid grid-cols-2 gap-4'>
                    <Field label='Дата'>
                        <Input type='date' {...ev('date')} />
                    </Field>
                    <Field label='Время'>
                        <Input type='time' {...ev('time')} />
                    </Field>
                </div>
                <Field label='Город'>
                    <Input maxLength={32} {...ev('city')} />
                </Field>
                <Field label='Площадка'>
                    <Input maxLength={48} {...ev('venue')} />
                </Field>
                <Field label='Тираж' hint='Пусто, если без лимита. На билете: № 0137 / тираж'>
                    <Input
                        type='number'
                        min={1}
                        max={99999}
                        value={draft.event.capacity ?? ''}
                        onChange={(e) =>
                            updateEvent({
                                capacity: e.target.value
                                    ? Math.max(1, Math.round(+e.target.value))
                                    : undefined
                            })
                        }
                    />
                </Field>
                {draft.event.date && (
                    <span className='text-[13px] text-onSurfaceVariant'>
                        На билете: {formatTicketDate(draft.event)}
                    </span>
                )}
            </>
        ),
        lineup: (
            <>
                <LineupField
                    value={draft.event.lineup ?? []}
                    onChange={(lineup) => updateEvent({ lineup })}
                />
                <Toggle
                    label='Лайнап на лицевой стороне'
                    checked={skin.lineupOnFront}
                    onChange={(lineupOnFront) => updateSkin({ lineupOnFront })}
                />
            </>
        ),
        images: (
            <>
                <ImageField
                    label='Арт'
                    hint='Основной фон 5:7, например 1000×1400'
                    value={skin.art}
                    onChange={(art) => updateSkin({ art })}
                />
                <ImageField
                    label='Передний план'
                    hint='PNG с прозрачностью. При наклоне едет сильнее арта'
                    value={skin.foreground}
                    onChange={(foreground) => updateSkin({ foreground })}
                />
                <SliderField
                    label='Глубина'
                    hint='Насколько передний план отходит от арта при наклоне'
                    shown={skin.depth ? `${Math.round((skin.depth / 2.5) * 100)}%` : 'нет'}
                    value={skin.depth}
                    min={0}
                    max={6}
                    step={0.25}
                    onChange={(depth) => updateSkin({ depth })}
                />
            </>
        ),
        text: (
            <>
                <Segmented
                    label='Расположение'
                    options={INFO}
                    value={skin.info}
                    onChange={(info) => updateSkin({ info })}
                />
                <Segmented
                    label='Выравнивание'
                    options={ALIGN}
                    value={skin.align}
                    onChange={(align) => updateSkin({ align })}
                />
                {/* Чипсы, а не сегменты: с двумя своими шрифтами вариантов пять, и в сегментах они не влезали */}
                {(
                    [
                        ['Шрифт заголовка', 'titleFont'],
                        ['Шрифт текста', 'bodyFont']
                    ] as const
                ).map(([label, key]) => (
                    <div
                        key={key}
                        role='radiogroup'
                        aria-label={label}
                        className='flex flex-col gap-y-2'
                    >
                        <span className={LABEL}>{label}</span>
                        <div className='flex flex-wrap gap-2'>
                            {fonts.map((f) => (
                                <button
                                    key={f.value}
                                    type='button'
                                    role='radio'
                                    aria-checked={skin[key] === f.value}
                                    className={chip(skin[key] === f.value)}
                                    onClick={() => updateSkin({ [key]: f.value })}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {(['custom', 'custom2'] as const).map((slot, n) => {
                    const font = skin[SLOT_KEY[slot]];
                    return (
                        <div key={slot} className='flex items-center gap-x-3 min-w-0'>
                            <span className='flex min-w-0 flex-1 items-center gap-x-1 text-sm font-medium text-onSurface'>
                                <span className='truncate'>
                                    {font ? font.name : `Свой шрифт ${n + 1}`}
                                </span>
                                {n === 0 && <Hint text='woff2, woff, ttf или otf до 2 МБ' />}
                            </span>
                            {font ? (
                                <Button
                                    variant='nothing'
                                    size='sm'
                                    className={QUIET_BTN}
                                    onClick={() => removeFont(slot)}
                                >
                                    Убрать
                                </Button>
                            ) : (
                                <Button
                                    variant='nothing'
                                    size='sm'
                                    className={QUIET_BTN}
                                    onClick={() => {
                                        fontSlot.current = slot;
                                        fontInput.current?.click();
                                    }}
                                >
                                    Загрузить
                                </Button>
                            )}
                        </div>
                    );
                })}
                <input
                    ref={fontInput}
                    type='file'
                    accept='.woff2,.woff,.ttf,.otf'
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) uploadFont(file, fontSlot.current).catch(() => {});
                    }}
                />
                <SliderField
                    label='Размер заголовка'
                    shown={`${Math.round(skin.titleScale * 100)}%`}
                    value={skin.titleScale}
                    min={0.5}
                    max={1.6}
                    step={0.05}
                    onChange={(titleScale) => updateSkin({ titleScale })}
                />
                <Toggle
                    label='Заголовок капсом'
                    checked={skin.uppercase}
                    onChange={(uppercase) => updateSkin({ uppercase })}
                />
                <Toggle
                    label='Аватар участника'
                    checked={skin.showAvatar}
                    onChange={(showAvatar) => updateSkin({ showAvatar })}
                />
                <Toggle
                    label='Затемнение под текстом'
                    checked={skin.scrim}
                    onChange={(scrim) => updateSkin({ scrim })}
                />
            </>
        ),
        color: (
            <>
                <ColorField label='Фон' value={skin.bg} onChange={(bg) => updateSkin({ bg })} />
                <ColorField
                    label='Текст'
                    value={skin.text}
                    onChange={(text) => updateSkin({ text })}
                />
                <SliderField
                    label='Скругление'
                    shown={`${skin.radius}%`}
                    value={skin.radius}
                    min={0}
                    max={14}
                    step={0.5}
                    onChange={(radius) => updateSkin({ radius })}
                />
                <SliderField
                    label='Рамка'
                    shown={skin.frameWidth ? `${skin.frameWidth}%` : 'нет'}
                    value={skin.frameWidth}
                    min={0}
                    max={4}
                    step={0.25}
                    onChange={(frameWidth) => updateSkin({ frameWidth })}
                />
                {skin.frameWidth > 0 && (
                    <ColorField
                        label='Цвет рамки'
                        value={skin.frameColor}
                        onChange={(frameColor) => updateSkin({ frameColor })}
                    />
                )}
            </>
        ),
        foil: (
            <>
                <SegmentedControl
                    aria-label='Тип фольги'
                    tone='neutral'
                    options={FOIL}
                    value={skin.foil}
                    onChange={(foil) => updateSkin({ foil })}
                />
                {skin.foil !== 'none' && (
                    <>
                        <SliderField
                            label='Сила фольги'
                            shown={`${Math.round(skin.foilStrength * 100)}%`}
                            value={skin.foilStrength}
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={(foilStrength) => updateSkin({ foilStrength })}
                        />
                        <SliderField
                            label='Оттенок'
                            shown={`${skin.holoHue}°`}
                            value={skin.holoHue}
                            min={0}
                            max={360}
                            step={5}
                            onChange={(holoHue) => updateSkin({ holoHue })}
                        />
                        {skin.foil === 'holo' && (
                            <SliderField
                                label='Угол полос'
                                shown={`${skin.holoAngle}°`}
                                value={skin.holoAngle}
                                min={0}
                                max={180}
                                step={5}
                                onChange={(holoAngle) => updateSkin({ holoAngle })}
                            />
                        )}
                        <ImageField
                            label='Маска фольги'
                            hint='PNG: блестит там, где непрозрачно. Без маски блестит вся карта'
                            value={skin.mask}
                            onChange={(mask) => updateSkin({ mask })}
                        />
                    </>
                )}
                <ImageField
                    label='Тиснение'
                    hint='PNG: форма выдавливается, светотень ходит за наклоном'
                    value={skin.emboss}
                    onChange={(emboss) => updateSkin({ emboss })}
                />
                <SliderField
                    label='Блик'
                    shown={`${Math.round(skin.glare * 100)}%`}
                    value={skin.glare}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(glare) => updateSkin({ glare })}
                />
                <SliderField
                    label='Наклон'
                    shown={skin.tilt ? `${skin.tilt}°` : 'нет'}
                    value={skin.tilt}
                    min={0}
                    max={25}
                    step={1}
                    onChange={(tilt) => updateSkin({ tilt })}
                />
            </>
        ),
        back: (
            <>
                <Field label='Текст' hint='Тайминг, правила входа. До 3 строк'>
                    <Textarea
                        rows={3}
                        maxLength={BACK_TEXT_MAX}
                        value={draft.event.backText ?? ''}
                        onChange={(e) => updateEvent({ backText: maxThreeLines(e.target.value) })}
                    />
                </Field>
                <div role='radiogroup' aria-label='Тип кода' className='flex flex-col gap-y-2'>
                    <span className={cn(LABEL, 'flex items-center gap-x-1')}>
                        Тип кода
                        <Hint text='QR читают почти все сканеры, бери его, если площадка не просит другого. PDF417 и Aztec используют Wallet и транспорт, штрихкод Code128 нужен для старых лазерных сканеров' />
                    </span>
                    <div className='flex flex-wrap gap-2'>
                        {CODE_TYPES.map((c) => (
                            <button
                                key={c.value}
                                type='button'
                                role='radio'
                                aria-checked={skin.codeType === c.value}
                                className={chip(skin.codeType === c.value)}
                                onClick={() => updateSkin({ codeType: c.value })}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
                <Segmented
                    label='Положение кода'
                    options={CODE_POS}
                    value={skin.backCodePos}
                    onChange={(backCodePos) => updateSkin({ backCodePos })}
                />
                <ImageField
                    label='Фон оборота'
                    hint='По умолчанию цвет карты'
                    value={skin.back}
                    onChange={(back) => updateSkin({ back })}
                />
                <ImageField
                    label='Партнёры'
                    hint='SVG или PNG: полоса логотипов над именем участника'
                    svg
                    value={skin.partners}
                    onChange={(partners) => updateSkin({ partners })}
                />
            </>
        ),
        tiers: (
            <>
                <div className='flex flex-wrap gap-2'>
                    <button type='button' className={chip(!tier)} onClick={() => setTierId(null)}>
                        Базовый
                    </button>
                    {draft.tiers.map((t) => (
                        <button
                            key={t.id}
                            type='button'
                            className={chip(t.id === tier?.id)}
                            onClick={() => setTierId(t.id)}
                        >
                            {t.name || 'Без названия'}
                        </button>
                    ))}
                    <button
                        type='button'
                        onClick={addTier}
                        className='h-9 shrink-0 rounded-xl px-3 text-[13px] font-medium text-onSurfaceVariant border border-dashed border-onSurface/20 hover:text-onSurface hover:border-onSurface/40 transition-colors motion-reduce:transition-none'
                    >
                        + Уровень
                    </button>
                </div>
                {tier ? (
                    <>
                        <Field label='Название уровня'>
                            <Input
                                maxLength={16}
                                value={tier.name}
                                onChange={(e) =>
                                    setTiers(
                                        draft.tiers.map((t) =>
                                            t.id === tier.id ? { ...t, name: e.target.value } : t
                                        )
                                    )
                                }
                            />
                        </Field>
                        <div className='flex flex-wrap gap-2'>
                            <Button
                                variant='nothing'
                                size='sm'
                                className={QUIET_BTN}
                                disabled={Object.keys(tier.skin).length === 0}
                                onClick={() =>
                                    setTiers(
                                        draft.tiers.map((t) =>
                                            t.id === tier.id ? { ...t, skin: {} } : t
                                        )
                                    )
                                }
                            >
                                Как у базового
                            </Button>
                            <Button
                                variant='nothing'
                                size='sm'
                                className='text-error hover:bg-error/10'
                                onClick={() => {
                                    setTiers(draft.tiers.filter((t) => t.id !== tier.id));
                                    setTierId(null);
                                }}
                            >
                                Удалить уровень
                            </Button>
                        </div>
                    </>
                ) : null}
            </>
        ),
        after: (
            <Field label='Надпись штампа'>
                <Input maxLength={20} placeholder='Посещено' {...ev('stampText')} />
            </Field>
        )
    };

    return (
        <TooltipProvider>
            <div className='flex flex-col gap-y-6 pb-8'>
                <div className='flex flex-col gap-y-1'>
                    <h1 className='font-semibold text-[28px] text-onSurface'>Билеты</h1>
                    <p className='text-[13px] text-onSurfaceVariant'>
                        Черновики хранятся только в этом браузере, бэка пока нет
                    </p>
                </div>

                {/* Черновики; удаление — здесь же, рядом с тем, что удаляем */}
                <div className='flex flex-wrap items-center gap-x-4 gap-y-3'>
                    <div className='flex min-w-0 flex-1 gap-2 overflow-x-auto scrollbar-none -mx-1 px-1'>
                        {drafts.map((d) => (
                            <button
                                key={d.id}
                                type='button'
                                onClick={() => selectDraft(d.id)}
                                className={cn(
                                    'h-11 shrink-0 max-w-[240px] truncate rounded-2xl px-4 text-sm font-medium transition-colors motion-reduce:transition-none',
                                    d.id === draft.id
                                        ? 'bg-onSurface text-surface'
                                        : 'bg-surface text-onSurfaceVariant hover:text-onSurface'
                                )}
                            >
                                {d.event.name || 'Без названия'}
                            </button>
                        ))}
                        <button
                            type='button'
                            onClick={createDraft}
                            className='h-11 shrink-0 rounded-2xl px-4 text-sm font-medium text-onSurfaceVariant border border-dashed border-onSurface/20 hover:text-onSurface hover:border-onSurface/40 transition-colors motion-reduce:transition-none'
                        >
                            + Новый билет
                        </button>
                    </div>
                    {confirmDelete ? (
                        <div className='flex shrink-0 items-center gap-x-2'>
                            <span className='text-[13px] text-onSurfaceVariant'>
                                Удалить черновик?
                            </span>
                            <Button
                                variant='nothing'
                                size='sm'
                                className={QUIET_BTN}
                                onClick={() => setConfirmDelete(false)}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant='nothing'
                                size='sm'
                                className='text-error hover:bg-error/10'
                                onClick={() => {
                                    remove(draft.id);
                                    selectDraft(null);
                                }}
                            >
                                Удалить
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant='nothing'
                            size='sm'
                            className='shrink-0 text-onSurfaceVariant hover:text-error hover:bg-error/10'
                            onClick={() => setConfirmDelete(true)}
                        >
                            Удалить черновик
                        </Button>
                    )}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)] gap-x-10 gap-y-8 items-start'>
                    {/* Слева — шаги. px-1: кольцо фокуса полей выходит на 4px за поле */}
                    <div className='order-2 lg:order-1 flex flex-col md:flex-row gap-6 min-w-0 px-1'>
                        <nav
                            aria-label='Шаги'
                            className='flex md:flex-col gap-1 overflow-x-auto scrollbar-none md:w-[200px] md:shrink-0 -mx-1 px-1 md:mx-0 md:px-0'
                        >
                            {STEPS.map((s, i) => (
                                <button
                                    key={s.id}
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
                                    <span className='truncate'>{s.title}</span>
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
                                {tier && step.id !== 'event' && step.id !== 'lineup' && (
                                    <p className='mt-1 text-[13px] text-onSurface'>
                                        Правишь уровень «{tier.name}» ·{' '}
                                        <button
                                            type='button'
                                            className='text-primary hover:underline'
                                            onClick={() => setTierId(null)}
                                        >
                                            к базовому
                                        </button>
                                    </p>
                                )}
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
                                {stepIndex < STEPS.length - 1 ? (
                                    <Button size='sm' onClick={() => setStepIndex((i) => i + 1)}>
                                        Далее: {STEPS[stepIndex + 1].title}
                                    </Button>
                                ) : (
                                    <span className='text-[13px] text-onSurfaceVariant'>
                                        Готово. Черновик сохраняется сам
                                    </span>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Справа — карта; на узких экранах первой */}
                    <div className='order-1 lg:order-2 lg:sticky lg:top-[max(1rem,calc(50dvh-360px))] flex flex-col items-center gap-y-4'>
                        <TicketCard
                            className='w-full max-w-[380px]'
                            event={draft.event}
                            skin={skin}
                            tier={tier?.name}
                            past={step.past}
                            side={step.side ?? 'front'}
                            holder={{
                                username: currentUser.username,
                                avatar: coverUrl('user', currentUser.imageUrl, 100)
                            }}
                            serial={137}
                            code={`SU-${draft.id.slice(0, 4).toUpperCase()}`}
                        />
                        <p className='max-w-[380px] text-[13px] text-onSurfaceVariant text-center [text-wrap:balance]'>
                            Наведи, чтобы наклонить, кликни, чтобы перевернуть. Имя и номер у
                            каждого участника свои
                        </p>
                        {draft.event.lineup && draft.event.lineup.length > 0 && (
                            <p className='max-w-[380px] text-[13px] text-onSurfaceVariant text-center'>
                                Лайнап:{' '}
                                {draft.event.lineup.map((a, i) => (
                                    <span key={a.id}>
                                        {i > 0 && ', '}
                                        <Link
                                            to={`/user/${encodeURIComponent(a.username)}`}
                                            className='text-onSurface hover:underline'
                                        >
                                            {a.username}
                                        </Link>
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
