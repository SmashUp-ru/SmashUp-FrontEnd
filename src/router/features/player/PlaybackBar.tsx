import { ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';
import MashupSeekSlider from '@/router/features/player/MashupSeekSlider.tsx';
import { Mashup } from '@/store/entities/mashup.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from '@/store/entities/vkMashup';

interface PlaybackBarProps {
    /** Источник для seek-слайдера (нужен только `duration`). */
    seekMashup: Mashup | UnpublishedMashup | VkMashup;
    /** Главный плеер — `absolute` (overlay в MainTab); превью-бары (модерация/VK) — `fixed`. */
    fixed?: boolean;
    left: ReactNode;
    center: ReactNode;
    right: ReactNode;
    /** ReactHowler / Player — рендерится внутри бара, но вне визуального лэйаута. */
    children?: ReactNode;
}

/**
 * Общий каркас бара воспроизведения: фон-капсула, seek-слайдер сверху и
 * три колонки (лево/центр/право). Содержимое колонок задаётся слотами —
 * различается между обычным / модерационным / VK-баром.
 */
export default function PlaybackBar({
    seekMashup,
    fixed,
    left,
    center,
    right,
    children
}: PlaybackBarProps) {
    return (
        <div
            className={cn(
                'bottom-4 left-4 right-4 h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px] shadow-lg z-10',
                'animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none',
                fixed ? 'fixed' : 'absolute'
            )}
        >
            <MashupSeekSlider mashup={seekMashup} />

            {/*
             * Раскладка НЕ на жёсткие трети: left/right — `flex-1`, center —
             * `shrink-0`. Центр остаётся ровно посередине (левый и правый берут
             * поровну остаток), но заголовку достаётся (ширина_бара − центр)/2
             * вместо фиксированной трети — правый блок (громкость + 2 иконки)
             * свою треть не заполнял, из-за чего длинное название обрезалось рано.
             */}
            <div className='w-full flex justify-between items-center gap-x-2 md:gap-x-6'>
                <div className='flex-1 min-w-0 flex items-center gap-x-2 md:gap-x-6'>{left}</div>
                {/* Гэп контролов маленький: кнопки-контролы теперь 44px (size='control')
                    с собственным полем вокруг иконки, поэтому большой gap разносил их. */}
                <div className='flex flex-row justify-center items-center gap-x-0.5 md:gap-x-1 shrink-0'>
                    {center}
                </div>
                <div className='hidden md:flex flex-1 min-w-0 justify-end items-center gap-x-1'>
                    {right}
                </div>
            </div>

            {children}
        </div>
    );
}
