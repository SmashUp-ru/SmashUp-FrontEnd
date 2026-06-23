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

            <div className='w-full flex justify-between items-center'>
                <div className='flex-1 min-w-0 md:flex-none md:w-1/3 flex items-center gap-x-2 md:gap-x-6'>
                    {left}
                </div>
                <div className='flex flex-row justify-center items-center gap-x-2 md:gap-x-6 shrink-0'>
                    {center}
                </div>
                <div className='hidden md:flex md:w-1/3 justify-end items-center gap-x-2 md:gap-x-6'>
                    {right}
                </div>
            </div>

            {children}
        </div>
    );
}
