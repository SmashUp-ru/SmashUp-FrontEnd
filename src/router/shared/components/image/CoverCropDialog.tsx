import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { Slider } from '@/components/ui/slider.tsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog.tsx';
import {
    CONFIRM_CANCEL,
    CONFIRM_DIALOG,
    CONFIRM_FOOTER,
    focusDialogItself
} from '@/router/shared/components/confirmDialog.ts';

/** Длинная сторона рамки на экране. */
const VIEW = 320;
/** Короткая сторона кадра меньше не бывает: бэк не примет (режет 100/400/800, афишу 4:5 — от 800×1000). */
const MIN_SIDE = 800;
/** Длинная сторона результата больше не нужна: крупнее никто не показывает. */
const MAX_OUT = 1200;

/** Положение картинки относительно рамки: масштаб и левый верхний угол. */
export interface CropFrame {
    s: number; // экранных пикселей на пиксель картинки
    x: number;
    y: number;
}

type Point = { x: number; y: number };

/**
 * Превью обложки с квадратной рамкой (как у Telegram/Instagram): рамка неподвижна,
 * под ней двигаешь и масштабируешь картинку, всё за рамкой видно, но затемнено.
 * Мышь: тащить, колесо (и щипок на тачпаде) — масштаб к курсору. Тач: один палец
 * тащит, два — щипок. Клавиатура: стрелки и +/−.
 * `aspect` — ширина к высоте рамки (по умолчанию квадрат; 0.8 — вертикальная афиша 4:5).
 * На выходе кадр с короткой стороной не меньше 800: jpeg, а у png — png (прозрачность в jpeg
 * стала бы чёрной). Картинку меньше 800 по короткой стороне не кадрируем: отдаём
 * как есть, её отбракует проверка размеров у вызывающего.
 */
export default function CoverCropDialog({
    src,
    initialFrame,
    round,
    aspect = 1,
    minSide = MIN_SIDE,
    maxOut = MAX_OUT,
    title,
    onCancel,
    onDone
}: {
    /** Ширина к высоте рамки. */
    aspect?: number;
    /** Минимум короткой стороны кадра в пикселях картинки (по умолчанию 800). */
    minSide?: number;
    /** Максимум длинной стороны результата (по умолчанию 1200). */
    maxOut?: number;
    /** Заголовок окна; по умолчанию «Аватар» / «Обложка». */
    title?: string;
    /** Круглая рамка — для аватаров. Сохраняется всё равно квадрат: круг лишь маска. */
    round?: boolean;
    /** data-URL выбранной картинки; null — диалог закрыт. */
    src: string | null;
    /** Кадр прошлого раза — для «Изменить кадр». */
    initialFrame?: CropFrame;
    onCancel: () => void;
    /** frame нет, если картинка слишком мала и ушла без кадрирования. */
    onDone: (dataUrl: string, frame?: CropFrame) => void;
}) {
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [frame, setFrame] = useState<CropFrame>({ s: 1, x: 0, y: 0 });
    const boxRef = useRef<HTMLDivElement>(null);
    const boxW = aspect >= 1 ? VIEW : VIEW * aspect;
    const boxH = aspect >= 1 ? VIEW / aspect : VIEW;
    const fitS = (w: number, h: number) => Math.max(boxW / w, boxH / h);

    useEffect(() => {
        setImg(null);
        if (!src) return;
        const el = new Image();
        el.onload = () => {
            const s = fitS(el.naturalWidth, el.naturalHeight);
            // даже вписанный целиком кадр меньше минимума — отдаём как есть, отбракует вызывающий
            if (s > Math.min(boxW, boxH) / minSide) {
                onDone(src);
                return;
            }
            setFrame(
                initialFrame ?? {
                    s,
                    x: (boxW - el.naturalWidth * s) / 2,
                    y: (boxH - el.naturalHeight * s) / 2
                }
            );
            setImg(el);
        };
        el.src = src;
        // колбэки вызывающего новые на каждом рендере, нужен только src
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    const minS = img ? fitS(img.naturalWidth, img.naturalHeight) : 1;
    const maxS = Math.max(Math.min(boxW, boxH) / minSide, minS);

    const clampS = (s: number) => Math.min(Math.max(s, minS), maxS);
    const clamp = (f: CropFrame): CropFrame =>
        img
            ? {
                  s: f.s,
                  x: Math.min(0, Math.max(boxW - img.naturalWidth * f.s, f.x)),
                  y: Math.min(0, Math.max(boxH - img.naturalHeight * f.s, f.y))
              }
            : f;

    /** Масштаб s так, чтобы точка картинки под `from` оказалась под `to` (в координатах рамки). */
    const zoom = (f: CropFrame, s: number, from: Point, to: Point = from) => {
        const ns = clampS(s);
        return clamp({
            s: ns,
            x: to.x - ((from.x - f.x) / f.s) * ns,
            y: to.y - ((from.y - f.y) / f.s) * ns
        });
    };
    const center = { x: boxW / 2, y: boxH / 2 };
    const zoomCenter = (s: number) => setFrame((f) => zoom(f, s, center));

    /** Экранная точка → координаты рамки. */
    const local = (x: number, y: number): Point => {
        const r = boxRef.current!.getBoundingClientRect();
        return { x: x - r.left, y: y - r.top };
    };

    // Колесо: React вешает onWheel пассивным, а прокрутку страницы надо гасить, поэтому
    // слушатель свой. Вешаем по callback-ref: Radix монтирует содержимое диалога в
    // портал отдельным проходом, и обычный эффект успевал отработать, когда сцены
    // ещё не было, — колесо не работало вообще.
    // ctrlKey — это щипок на тачпаде: дельты у него мелкие, усиливаем.
    const [stage, setStage] = useState<HTMLDivElement | null>(null);
    const onWheel = useRef<(e: WheelEvent) => void>(() => {});
    onWheel.current = (e) => {
        e.preventDefault();
        const k = e.ctrlKey ? 0.01 : 0.002;
        const p = local(e.clientX, e.clientY);
        setFrame((f) => zoom(f, f.s * Math.exp(-e.deltaY * k), p));
    };
    useEffect(() => {
        if (!stage) return;
        const handler = (e: WheelEvent) => onWheel.current(e);
        stage.addEventListener('wheel', handler, { passive: false });
        return () => stage.removeEventListener('wheel', handler);
    }, [stage]);

    // Жест: при каждой смене числа пальцев запоминаем базу (кадр + точки), дальше
    // считаем от неё. Один палец — сдвиг, два — щипок вокруг середины между ними
    // (середина может и ехать — тогда заодно сдвиг).
    const pointers = useRef(new Map<number, Point>());
    const base = useRef<{ f: CropFrame; pts: Point[] } | null>(null);
    const rebase = () => {
        base.current = { f: frame, pts: [...pointers.current.values()] };
    };
    const mid = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

    const onPointerMove = (e: React.PointerEvent) => {
        if (!pointers.current.has(e.pointerId) || !base.current) return;
        pointers.current.set(e.pointerId, local(e.clientX, e.clientY));
        const now = [...pointers.current.values()];
        const { f, pts } = base.current;
        if (now.length === 1 && pts.length === 1) {
            setFrame(clamp({ ...f, x: f.x + now[0].x - pts[0].x, y: f.y + now[0].y - pts[0].y }));
        } else if (now.length >= 2 && pts.length >= 2) {
            const s = (f.s * dist(now[0], now[1])) / dist(pts[0], pts[1]);
            setFrame(zoom(f, s, mid(pts[0], pts[1]), mid(now[0], now[1])));
        }
    };
    const onPointerEnd = (e: React.PointerEvent) => {
        pointers.current.delete(e.pointerId);
        rebase();
    };

    const done = () => {
        if (!img || !src) return;
        // рамка в пикселях картинки, короткая сторона ≥ 800
        const cw = boxW / frame.s;
        const ch = boxH / frame.s;
        const k = Math.min(1, maxOut / Math.max(cw, ch));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(cw * k);
        canvas.height = Math.round(ch * k);
        const ctx = canvas.getContext('2d')!;
        // без этого при сжатии крупного фото лесенки и муар
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
            img,
            -frame.x / frame.s,
            -frame.y / frame.s,
            cw,
            ch,
            0,
            0,
            canvas.width,
            canvas.height
        );
        const png = src.startsWith('data:image/png');
        onDone(png ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92), frame);
    };

    const step = (dx: number, dy: number) =>
        setFrame((f) => clamp({ ...f, x: f.x + dx, y: f.y + dy }));

    return (
        <Dialog open={img !== null} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent
                className={CONFIRM_DIALOG.replace('max-w-[400px]', 'max-w-[480px]')}
                // фокус на окно, а не на сцену: иначе кольцо фокуса горит сразу при открытии
                onOpenAutoFocus={focusDialogItself}
            >
                <DialogHeader className='space-y-2'>
                    <DialogTitle className='p-0 text-xl'>
                        {title ?? (round ? 'Аватар' : 'Обложка')}
                    </DialogTitle>
                    <DialogDescription className='p-0 text-sm'>
                        Перетащи и приблизь, чтобы выбрать кадр
                    </DialogDescription>
                </DialogHeader>

                {img && (
                    <div
                        ref={setStage}
                        tabIndex={0}
                        role='application'
                        aria-label={`Кадр ${round ? 'аватара' : 'обложки'}. Стрелки двигают, плюс и минус масштабируют`}
                        className='relative h-[360px] w-full overflow-hidden rounded-2xl bg-surfaceVariant cursor-grab active:cursor-grabbing touch-none select-none outline outline-2 outline-transparent outline-offset-2 focus-visible:outline-primary'
                        onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId);
                            pointers.current.set(e.pointerId, local(e.clientX, e.clientY));
                            rebase();
                        }}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerEnd}
                        onPointerCancel={onPointerEnd}
                        onKeyDown={(e) => {
                            const k: Record<string, () => void> = {
                                ArrowLeft: () => step(10, 0),
                                ArrowRight: () => step(-10, 0),
                                ArrowUp: () => step(0, 10),
                                ArrowDown: () => step(0, -10),
                                '+': () => zoomCenter(frame.s * 1.1),
                                '=': () => zoomCenter(frame.s * 1.1),
                                '-': () => zoomCenter(frame.s / 1.1)
                            };
                            if (k[e.key]) {
                                e.preventDefault();
                                k[e.key]();
                            }
                        }}
                    >
                        {/* рамка по центру сцены; картинка позиционируется относительно неё */}
                        <div
                            ref={boxRef}
                            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                            style={{ width: boxW, height: boxH }}
                        >
                            <img
                                src={img.src}
                                alt=''
                                draggable={false}
                                className='absolute left-0 top-0 max-w-none origin-top-left'
                                style={{
                                    width: img.naturalWidth,
                                    height: img.naturalHeight,
                                    transform: `translate(${frame.x}px, ${frame.y}px) scale(${frame.s})`
                                }}
                            />
                            {/* всё за рамкой затемнено огромной тенью; скругление — как у обложек */}
                            <div
                                className={cn(
                                    'pointer-events-none absolute inset-0 shadow-[0_0_0_9999px_rgb(0_0_0/0.7)] ring-1 ring-white/20',
                                    round ? 'rounded-full' : 'rounded-[30px]'
                                )}
                            />
                        </div>
                    </div>
                )}

                {maxS > minS && (
                    <Slider
                        aria-label='Масштаб'
                        min={minS}
                        max={maxS}
                        step={(maxS - minS) / 100}
                        value={[frame.s]}
                        onValueChange={([s]) => zoomCenter(s)}
                    />
                )}

                <DialogFooter className={CONFIRM_FOOTER}>
                    <Button variant='nothing' className={CONFIRM_CANCEL} onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button className='flex-1' onClick={done}>
                        Готово
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
