import { useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

/**
 * Play ⇄ Pause одним морфом: две «полосы» паузы перетекают в две половины
 * треугольника (правая пара углов съезжается в остриё, скругление угла само
 * превращается в скруглённое остриё).
 *
 * Почему нельзя переиспользовать Play.tsx / Pause.tsx: интерполяция формы
 * требует ОДИНАКОВОЙ структуры команд в обоих путях, а там треугольник из дуг
 * против двух <rect>. Здесь оба состояния генерируются одним генератором
 * скруглённого четырёхугольника (`quadNums`) — структура совпадает по
 * построению, поэтому достаточно лерпить числа: ни CSS `d` (его не умеет
 * Firefox), ни SMIL, ни библиотек морфинга не нужно.
 *
 * Кадры пишутся прямо в атрибут `d` через ref — React не ре-рендерится.
 */

type Pt = readonly [number, number];
type Quad = { p: readonly [Pt, Pt, Pt, Pt]; r: readonly [number, number, number, number] };

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Единичный вектор из p в q (нулевой, если точки совпали). */
function unit(p: Pt, q: Pt): Pt {
    const d = dist(p, q);
    return d === 0 ? [0, 0] : [(q[0] - p[0]) / d, (q[1] - p[1]) / d];
}

/**
 * Скруглённый угол: точки касания + контрольные точки кубики, которая
 * аппроксимирует дугу радиуса `r` (ошибка < 0.02% радиуса). Контроли НЕ в
 * вершине — парабола с контролем в вершине заметно полнее дуги, из-за неё
 * фигура переставала совпадать с исходными иконками на углах.
 *
 * Срез вдоль ребра t = r/tg(θ/2) зажимается половиной каждого ребра, радиус
 * пересчитывается обратно — поэтому вырожденные рёбра (сходящиеся точки
 * острия) не ломают путь.
 */
function corner(prev: Pt, v: Pt, next: Pt, r: number) {
    const u1 = unit(v, prev);
    const u2 = unit(v, next);
    const cos = Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]));
    const theta = Math.acos(cos);
    const half = Math.tan(theta / 2);
    let t = r === 0 || half === 0 ? 0 : r / half;
    t = Math.min(t, dist(v, prev) / 2, dist(v, next) / 2);
    const rEff = t * half;
    // (4/3)·tg(α/4) — коэффициент кубической аппроксимации дуги, α = π − θ.
    const h = (4 / 3) * Math.tan((Math.PI - theta) / 4) * rEff;
    const at = (u: Pt, len: number): Pt => [v[0] + u[0] * len, v[1] + u[1] * len];
    return { entry: at(u1, t), c1: at(u1, t - h), c2: at(u2, t - h), exit: at(u2, t) };
}

/**
 * Числа скруглённого четырёхугольника В ПОРЯДКЕ КОМАНД пути:
 * M X₀, затем для углов 1,2,3,0 — L Eᵢ, C P1ᵢ P2ᵢ Xᵢ, и Z. Ровно 34 числа
 * при любых точках и радиусах — это и делает состояния интерполируемыми.
 */
function quadNums({ p, r }: Quad): number[] {
    const c = [0, 1, 2, 3].map((i) => corner(p[(i + 3) % 4], p[i], p[(i + 1) % 4], r[i]));
    const out: number[] = [c[0].exit[0], c[0].exit[1]];
    for (let i = 1; i <= 4; i++) {
        const k = c[i % 4];
        out.push(k.entry[0], k.entry[1], k.c1[0], k.c1[1], k.c2[0], k.c2[1], k.exit[0], k.exit[1]);
    }
    return out;
}

const QUAD_LEN = 34;

function quadPath(n: number[], offset: number): string {
    const f = (i: number) => n[offset + i].toFixed(2);
    let d = `M${f(0)} ${f(1)}`;
    for (let c = 0; c < 4; c++) {
        const b = 2 + c * 8;
        d += `L${f(b)} ${f(b + 1)}C${f(b + 2)} ${f(b + 3)} ${f(b + 4)} ${f(b + 5)} ${f(b + 6)} ${f(b + 7)}`;
    }
    return `${d}Z`;
}

/** Глиф целиком = две фигуры. Перекрытие по шву безопасно: fill-rule nonzero. */
const glyphPath = (n: number[]) => `${quadPath(n, 0)} ${quadPath(n, QUAD_LEN)}`;

const pair = (a: Quad, b: Quad) => [...quadNums(a), ...quadNums(b)];

// ── геометрия. Обычный глиф (viewBox 24) — под Play.tsx / Pause.tsx ──
const GLYPH = {
    viewBox: 24,
    pause: pair(
        {
            p: [
                [6, 5],
                [10, 5],
                [10, 19],
                [6, 19]
            ],
            r: [1.5, 1.5, 1.5, 1.5]
        },
        {
            p: [
                [14, 5],
                [18, 5],
                [18, 19],
                [14, 19]
            ],
            r: [1.5, 1.5, 1.5, 1.5]
        }
    ),
    // Треугольник (7,3.70)→(20.41,12)→(7,20.30) — это вершины ДО скругления,
    // восстановленные из Play.tsx пересечением рёбер (там углы срезаны дугами
    // r=1, поэтому сами вершины лежат за видимым краем — если брать видимые,
    // фигура получается мельче оригинала).
    // Радиусы — ровно из Play.tsx: дуги `a1 1` → r = 1.
    // Разрезан по x≈13: у левой половины правые углы без скругления, у правой —
    // левые, чтобы шов не «надкусывал» фигуру; половины перекрываются на 0.1
    // против антиалиасинга. Точки острия лежат НА рёбрах, поэтому крайняя
    // правая точка = x острия (19.51 — как у дуги оригинала).
    play: pair(
        {
            p: [
                [7, 3.7],
                [13.05, 7.44],
                [13.05, 16.56],
                [7, 20.3]
            ],
            r: [1, 0, 0, 1]
        },
        {
            p: [
                [12.95, 7.41],
                [19.51, 11.44],
                [19.51, 12.56],
                [12.95, 16.59]
            ],
            r: [0, 1, 1, 0]
        }
    )
} as const;

// ── hollow (viewBox 48): глиф вырезан из круга маской ──
const HOLLOW = {
    viewBox: 48,
    pause: pair(
        {
            p: [
                [16, 14],
                [22, 14],
                [22, 34],
                [16, 34]
            ],
            r: [2, 2, 2, 2]
        },
        {
            p: [
                [26, 14],
                [32, 14],
                [32, 34],
                [26, 34]
            ],
            r: [2, 2, 2, 2]
        }
    ),
    // То же для PlayHollowIcon: вершины до скругления (18,12.56)→(36.92,24)→
    // (18,35.44), радиусы дуг 1.92 (бок) и 2.06 (остриё); видимое остриё — x=35.
    play: pair(
        {
            p: [
                [18, 12.56],
                [26.55, 17.7],
                [26.55, 30.3],
                [18, 35.44]
            ],
            r: [1.92, 0, 0, 1.92]
        },
        {
            p: [
                [26.45, 17.68],
                [35, 22.84],
                [35, 25.16],
                [26.45, 30.32]
            ],
            r: [0, 2.06, 2.06, 0]
        }
    )
} as const;

// Критически задемпфированная пружина (ζ = 1) — та же кривая, что у пресса
// кнопок: перелёта нет, но затухание живее «механического» ease-out.
const W = 6.6;
const SPRING_NORM = 1 - (1 + W) * Math.exp(-W);
const spring = (t: number) => (1 - (1 + W * t) * Math.exp(-W * t)) / SPRING_NORM;

interface PlayPauseMorphIconProps extends IconProps {
    /** true — показываем «паузу» (идёт воспроизведение), false — «плей». */
    playing: boolean;
    /** Круглая версия с вырезанным глифом (как PlayHollowIcon, 48px). */
    hollow?: boolean;
    /** Время морфа, мс. */
    duration?: number;
}

export default function PlayPauseMorphIcon({
    playing,
    hollow = false,
    duration = 240,
    className,
    color = 'onSurface',
    hoverColor,
    size,
    width,
    height
}: PlayPauseMorphIconProps) {
    const geo = hollow ? HOLLOW : GLYPH;
    const pathRef = useRef<SVGPathElement>(null);
    const numsRef = useRef<number[]>(playing ? [...geo.pause] : [...geo.play]);
    const rafRef = useRef<number | null>(null);
    const maskId = useId();

    useEffect(() => {
        const el = pathRef.current;
        if (!el) return;
        const target = playing ? geo.pause : geo.play;
        const from = numsRef.current;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            numsRef.current = [...target];
            el.setAttribute('d', glyphPath(target));
            return;
        }

        const started = performance.now();
        const step = (now: number) => {
            const t = Math.min(1, (now - started) / duration);
            const k = spring(t);
            const cur = from.map((v, i) => v + (target[i] - v) * k);
            numsRef.current = cur;
            el.setAttribute('d', glyphPath(cur));
            rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
        };
        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [playing, duration, geo]);

    const px = size ?? width ?? height ?? geo.viewBox;
    const initial = glyphPath(numsRef.current);

    return (
        <svg
            width={px}
            height={px}
            viewBox={`0 0 ${geo.viewBox} ${geo.viewBox}`}
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'fill-current transition-[color] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            {hollow ? (
                <>
                    <mask id={maskId}>
                        <rect width={geo.viewBox} height={geo.viewBox} fill='white' />
                        <path ref={pathRef} d={initial} fill='black' />
                    </mask>
                    <circle cx='24' cy='24' r='24' mask={`url(#${maskId})`} />
                </>
            ) : (
                <path ref={pathRef} d={initial} />
            )}
        </svg>
    );
}
