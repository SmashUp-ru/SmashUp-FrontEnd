import { CSSProperties, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { formatTicketDate, TicketEvent, TicketFont, TicketSkin } from '@/store/ticketDrafts.ts';

const DEFAULT_STAMP = 'Посещено';
import TicketCode from '@/router/features/tickets/TicketCode.tsx';
import './ticketCard.css';

// Пружина чуть недодемпфирована: после ухода курсора карта «доходит» на место с лёгким покачиванием.
const STIFFNESS = 0.07;
const DAMPING = 0.78;

type Axis = { v: number; vel: number; to: number };
const axis = (to = 0): Axis => ({ v: to, vel: 0, to });

/** Наклон/блик/переворот. Пишет CSS-переменные в элемент каждый кадр, React не ре-рендерит. */
function useTilt(flipped: boolean, maxTilt: number) {
    const ref = useRef<HTMLDivElement>(null);
    const max = useRef(maxTilt);
    max.current = maxTilt;
    const axes = useRef({ mx: axis(), my: axis(), o: axis(), flip: axis(flipped ? 180 : 0) });
    const raf = useRef(0);
    const reduce = useRef(false);

    const tick = () => {
        const el = ref.current;
        if (!el) {
            raf.current = 0;
            return;
        }
        let moving = false;
        for (const a of Object.values(axes.current)) {
            if (reduce.current) {
                a.v = a.to;
                continue;
            }
            a.vel = (a.vel + (a.to - a.v) * STIFFNESS) * DAMPING;
            a.v += a.vel;
            if (Math.abs(a.to - a.v) > 0.001 || Math.abs(a.vel) > 0.001) moving = true;
            else {
                a.v = a.to;
                a.vel = 0;
            }
        }
        const { mx, my, o, flip } = axes.current;
        const s = el.style;
        s.setProperty('--mx', String(mx.v));
        s.setProperty('--my', String(my.v));
        s.setProperty('--o', String(o.v));
        s.setProperty('--px', `${(mx.v + 1) * 50}%`);
        s.setProperty('--py', `${(my.v + 1) * 50}%`);
        s.setProperty('--rx', `${-my.v * max.current}deg`);
        s.setProperty('--ry', `${mx.v * max.current + flip.v}deg`);
        raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
        if (!raf.current) raf.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        reduce.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
        return () => {
            cancelAnimationFrame(raf.current);
            raf.current = 0; // иначе kick() решит, что кадр уже запрошен, и пружина встанет
        };
    }, []);

    useEffect(() => {
        axes.current.flip.to = flipped ? 180 : 0;
        kick();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- kick стабилен по смыслу (refs)
    }, [flipped]);

    const set = (mx: number, my: number, o: number) => {
        const a = axes.current;
        a.mx.to = mx;
        a.my.to = my;
        a.o.to = o;
        kick();
    };

    return {
        ref,
        onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
            if (reduce.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            const clamp = (n: number) => Math.max(-1, Math.min(1, n));
            set(
                clamp(((e.clientX - r.left) / r.width) * 2 - 1),
                clamp(((e.clientY - r.top) / r.height) * 2 - 1),
                1
            );
        },
        onPointerLeave: () => set(0, 0, 0)
    };
}

let sparkleTex: string | undefined;
/** Текстура блёсток: случайные точки разного размера и яркости, генерируется один раз. */
function getSparkleTexture() {
    if (sparkleTex) return sparkleTex;
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 420; i++) {
        const r = Math.random() < 0.12 ? 2.4 : 1.2;
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
        ctx.fill();
    }
    return (sparkleTex = `url(${c.toDataURL()})`);
}

const STACK: Record<Exclude<TicketFont, 'custom' | 'custom2'>, string> = {
    sans: 'Manrope, system-ui, sans-serif',
    mono: "ui-monospace, 'SF Mono', Menlo, monospace",
    serif: "Georgia, 'Times New Roman', serif"
};

// data URL шрифта → имя семейства; FontFace регистрируем один раз на документ.
const loadedFonts = new Map<string, string>();

/** Регистрирует свой шрифт организатора, возвращает имя семейства (или undefined, пока грузится). */
function useCustomFont(font?: { data: string }) {
    const [family, setFamily] = useState<string>();
    useEffect(() => {
        if (!font) return setFamily(undefined);
        const known = loadedFonts.get(font.data);
        if (known) return setFamily(known);
        const name = `ticket-font-${loadedFonts.size + 1}`;
        let cancelled = false;
        new FontFace(name, `url(${font.data})`)
            .load()
            .then((face) => {
                document.fonts.add(face);
                loadedFonts.set(font.data, name);
                if (!cancelled) setFamily(name);
            })
            .catch(() => !cancelled && setFamily(undefined));
        return () => {
            cancelled = true;
        };
    }, [font]);
    return family;
}

/**
 * Лайнап на обороте: показываем ВСЕХ участников, без обрезки. Кегль подбирается под свободное
 * место средней зоны (после кода): начинаем с размера по длине списка и уменьшаем, пока весь
 * список не влезет. Многоточие и растворение не подходят: участник должен найти себя в лайнапе.
 *
 * Свободное место считаем от зоны-родителя (её высота от контента не зависит: flex-1), а не от
 * самого абзаца — иначе уменьшенный абзац ужимает зону и после освобождения места не растёт.
 */
function BackLineup({ text, className }: { text: string; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const base = text.length < 60 ? 4.2 : text.length < 120 ? 3.6 : 3.1;
    const [size, setSize] = useState(base);
    useEffect(() => {
        const el = ref.current;
        const zone = el?.parentElement;
        const p = el?.querySelector('p');
        if (!el || !zone || !p) return;
        const fit = () => {
            const gap = parseFloat(getComputedStyle(zone).rowGap) || 0;
            const others = [...zone.children].filter((c) => c !== el);
            const taken = others.reduce((h, c) => h + (c as HTMLElement).offsetHeight + gap, 0);
            const label = el.firstElementChild as HTMLElement;
            const room =
                zone.clientHeight -
                taken -
                label.offsetHeight -
                (parseFloat(getComputedStyle(el).rowGap) || 0);
            // двоичный поиск наибольшего кегля, при котором весь список помещается
            let lo = 1,
                hi = base;
            const prev = p.style.fontSize;
            for (let k = 0; k < 10; k++) {
                const mid = (lo + hi) / 2;
                p.style.fontSize = `${mid}cqw`;
                if (p.scrollHeight <= room) lo = mid;
                else hi = mid;
            }
            p.style.fontSize = prev;
            const best = Math.round(lo * 20) / 20; // шаг 0.05cqw — без дрожания от субпикселей
            setSize((s) => (s === best ? s : best));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(zone);
        [...zone.children].forEach((c) => ro.observe(c));
        return () => ro.disconnect();
    }, [text, base]);
    return (
        <div ref={ref} className={cn('min-h-0 flex flex-col gap-[0.8cqw]', className)}>
            <span className='shrink-0 text-[3cqw] font-medium opacity-60'>Лайнап</span>
            <p
                className='font-medium leading-snug [text-wrap:balance]'
                style={{ fontSize: `${size}cqw` }}
            >
                {text}
            </p>
        </div>
    );
}

interface TicketCardProps {
    event: TicketEvent;
    skin: TicketSkin;
    holder: { username: string; avatar?: string };
    serial: number;
    code: string;
    /** Название уровня (VIP…) — на карте рядом с номером. */
    tier?: string;
    /** Мероприятие прошло: штамп и фольга ярче. */
    past?: boolean;
    /** Какой стороной показать (редактор переворачивает на шагах про оборот); клик всё равно переворачивает. */
    side?: 'front' | 'back';
    className?: string;
}

export default function TicketCard({
    event,
    skin,
    holder,
    serial,
    code,
    tier,
    past,
    side,
    className
}: TicketCardProps) {
    const [flipped, setFlipped] = useState(side === 'back');
    useEffect(() => {
        if (side) setFlipped(side === 'back');
    }, [side]);
    const tilt = useTilt(flipped, skin.tilt);
    const custom = {
        custom: useCustomFont(skin.customFont),
        custom2: useCustomFont(skin.customFont2)
    };
    const fontOf = (f: TicketFont) => {
        if (f !== 'custom' && f !== 'custom2') return STACK[f];
        // пока шрифт грузится (или его убрали) — основной гротеск
        return custom[f] ? `'${custom[f]}', ${STACK.sans}` : STACK.sans;
    };

    // Прошедшее мероприятие: билет-память — фольга ярче, чем на пропуске.
    const foil = past ? Math.min(1, skin.foilStrength + 0.3) : skin.foilStrength;
    const vars = {
        '--bg': skin.bg,
        '--text': skin.text,
        '--foil': foil,
        '--glare': skin.glare,
        '--radius': skin.radius,
        '--depth': skin.depth,
        '--holo-hue': skin.holoHue,
        '--holo-angle': `${skin.holoAngle}deg`,
        fontFamily: fontOf(skin.bodyFont),
        '--mask': skin.mask ? `url(${skin.mask})` : undefined,
        '--emboss': skin.emboss ? `url(${skin.emboss})` : undefined,
        '--sparkle-tex': skin.foil === 'sparkle' ? getSparkleTexture() : undefined
    } as CSSProperties;

    const no = `№ ${String(serial).padStart(4, '0')}${event.capacity ? ` / ${event.capacity}` : ''}`;
    const when = formatTicketDate(event);
    const where = [event.city, event.venue].filter(Boolean).join(' · ');
    const lineup = event.lineup?.map((a) => a.username).join(', ');
    const top = skin.info === 'top';
    const minimal = skin.info === 'minimal';
    const align = { left: 'text-left', center: 'text-center', right: 'text-right' }[skin.align];
    const titleStyle: CSSProperties = {
        fontFamily: fontOf(skin.titleFont),
        fontSize: `${9 * skin.titleScale}cqw`,
        textTransform: skin.uppercase ? 'uppercase' : undefined
    };

    // Ник — по выравниванию карты; строкой ниже плашка уровня у левого края, номер с тиражом — у правого.
    // В одну строку с ником не ставим: «№ 0137 / 1000» не сжимается (в моноширинном он широкий)
    // и выдавливал ник в ноль. Длинный ник ещё и мельче, а не только обрезан.
    const n = holder.username.length;
    const nameSize = n > 24 ? 3.2 : n > 20 ? 3.6 : n > 14 ? 4 : 4.4;
    const holderRow = (
        <div className='shrink-0 flex flex-col gap-[1.2cqw]'>
            <div
                className={cn(
                    'flex items-center gap-[2.5cqw] min-w-0',
                    skin.align === 'center' && 'justify-center',
                    skin.align === 'right' && 'flex-row-reverse'
                )}
            >
                {skin.showAvatar && holder.avatar && (
                    <img
                        src={holder.avatar}
                        alt=''
                        className='w-[9cqw] h-[9cqw] rounded-full object-cover shrink-0'
                    />
                )}
                <span
                    className='min-w-0 truncate font-semibold leading-tight'
                    style={{ fontSize: `${nameSize}cqw` }}
                >
                    {holder.username}
                </span>
            </div>
            {/* плашка уровня — у левого края, номер с тиражом — у правого */}
            <span className='flex items-center gap-[1.5cqw] text-[3.2cqw] font-medium tabular-nums leading-none'>
                {tier && (
                    <span className='shrink-0 rounded-[1.2cqw] border border-current px-[1.2cqw] py-[0.4cqw] text-[2.8cqw] font-semibold'>
                        {tier}
                    </span>
                )}
                <span className='ml-auto opacity-80'>{no}</span>
            </span>
        </div>
    );

    const frame = skin.frameWidth > 0 && (
        <div
            className='ticket-layer ticket-frame'
            style={{ boxShadow: `inset 0 0 0 ${skin.frameWidth}cqw ${skin.frameColor}` }}
        />
    );

    // ponytail: QR — когда будет бэк с настоящим кодом прохода; сейчас код текстом
    // После мероприятия штамп встаёт на место кода: код уже использован, а поверх белой
    // плашки «чернила» цвета текста карты не видны.
    const codeBox = past ? (
        <div className='self-center shrink-0 flex flex-col items-center gap-[6cqw] py-[3cqw]'>
            <span className='ticket-stamp'>{event.stampText || DEFAULT_STAMP}</span>
            <span className='text-[3cqw] tabular-nums opacity-60'>{code} · погашен</span>
        </div>
    ) : (
        <div className='self-center shrink-0 flex flex-col items-center gap-[1.5cqw] rounded-[4cqw] bg-white px-[5cqw] py-[3.5cqw] text-black'>
            <TicketCode type={skin.codeType} value={code} />
            {/* одна строка вместо двух: место на обороте нужнее лайнапу */}
            <span className='text-[2.8cqw] tabular-nums'>
                {skin.codeType !== 'text' && (
                    <span className='font-medium tracking-wider'>{code} · </span>
                )}
                <span className='opacity-60'>
                    {skin.codeType === 'text' ? 'Покажи на входе' : 'покажи на входе'}
                </span>
            </span>
        </div>
    );

    return (
        <div
            role='button'
            tabIndex={0}
            aria-label={flipped ? 'Показать лицевую сторону билета' : 'Перевернуть билет'}
            aria-pressed={flipped}
            className={cn('ticket-scene select-none outline-none', className)}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFlipped((f) => !f);
                }
            }}
        >
            <div ref={tilt.ref} className='ticket' style={vars}>
                {/* Лицо */}
                <div className='ticket-face'>
                    {skin.art && (
                        <div
                            className='ticket-layer ticket-art'
                            style={{ backgroundImage: `url(${skin.art})` }}
                        />
                    )}
                    {skin.emboss && (
                        <div className='ticket-layer ticket-emboss'>
                            <div className='ticket-layer' />
                        </div>
                    )}
                    {skin.foil !== 'none' && (
                        <div
                            className={cn(
                                'ticket-layer ticket-masked',
                                skin.foil === 'holo' ? 'ticket-holo' : 'ticket-sparkle'
                            )}
                        />
                    )}
                    {skin.foreground && (
                        <div
                            className='ticket-layer ticket-fg'
                            style={{ backgroundImage: `url(${skin.foreground})` }}
                        />
                    )}

                    <div
                        className={cn(
                            'ticket-layer flex flex-col p-[6cqw] gap-[3cqw]',
                            top ? 'justify-start' : 'justify-end'
                        )}
                        style={
                            skin.scrim
                                ? {
                                      background: `linear-gradient(${top ? 'to bottom' : 'to top'}, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.35) ${minimal ? 22 : 45}%, transparent ${minimal ? 35 : 65}%)`
                                  }
                                : undefined
                        }
                    >
                        {!minimal && (
                            <div className={cn('flex flex-col gap-[1.5cqw]', align)}>
                                <span
                                    className='leading-[1.02] font-semibold [overflow-wrap:anywhere] [text-wrap:balance]'
                                    style={titleStyle}
                                >
                                    {event.name}
                                </span>
                                {(when || where) && (
                                    <span className='text-[3.8cqw] font-medium opacity-85'>
                                        {[when, where].filter(Boolean).join(' · ')}
                                    </span>
                                )}
                                {skin.lineupOnFront && lineup && (
                                    <span className='text-[3.6cqw] font-medium opacity-85 line-clamp-2'>
                                        {lineup}
                                    </span>
                                )}
                            </div>
                        )}
                        {holderRow}
                    </div>

                    {frame}
                    <div className='ticket-layer ticket-glare' />
                </div>

                {/* Оборот */}
                <div className='ticket-face ticket-back'>
                    {skin.back && (
                        <div
                            className='ticket-layer bg-cover bg-center'
                            style={{ backgroundImage: `url(${skin.back})` }}
                        />
                    )}
                    <div
                        className={cn(
                            'ticket-layer flex flex-col gap-[4cqw] p-[7cqw]',
                            // затемнение — только для читаемости поверх картинки; на чистом цвете оно его пачкает
                            skin.back && 'bg-black/35'
                        )}
                    >
                        <div className={cn('shrink-0 flex flex-col gap-[1.2cqw]', align)}>
                            <span
                                className='leading-tight font-semibold [overflow-wrap:anywhere]'
                                style={{ ...titleStyle, fontSize: `${7 * skin.titleScale}cqw` }}
                            >
                                {event.name}
                            </span>
                            {when && <span className='text-[3.8cqw] font-medium'>{when}</span>}
                            {where && <span className='text-[3.8cqw] opacity-85'>{where}</span>}
                        </div>

                        {skin.backCodePos === 'top' && codeBox}

                        {/* Текст — до 3 строк и не сжимается: правила входа важнее лайнапа */}
                        {event.backText && (
                            <p
                                className={cn(
                                    'shrink-0 text-[3.4cqw] leading-snug opacity-85 whitespace-pre-line line-clamp-3',
                                    align
                                )}
                            >
                                {event.backText}
                            </p>
                        )}

                        {/* Середина: лайнап берёт оставшееся место и сжимается первым, код — никогда */}
                        <div className='flex-1 min-h-0 flex flex-col justify-center gap-[4cqw]'>
                            {lineup && <BackLineup text={lineup} className={align} />}
                            {skin.backCodePos === 'center' && codeBox}
                        </div>

                        {skin.partners && (
                            <div
                                className='h-[10cqw] shrink-0 bg-contain bg-center bg-no-repeat'
                                style={{ backgroundImage: `url(${skin.partners})` }}
                                role='img'
                                aria-label='Партнёры'
                            />
                        )}
                        {skin.backCodePos === 'bottom' && codeBox}
                        {holderRow}
                    </div>
                    {frame}
                    <div className='ticket-layer ticket-glare' />
                </div>
            </div>
        </div>
    );
}
