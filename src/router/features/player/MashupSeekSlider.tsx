import { Slider } from '@/components/ui/slider.tsx';
import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/player.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from '@/store/entities/vkMashup';
import { SEEK_STEP_MS, useSmoothSeek } from '@/router/features/player/usePlaybackEngine.ts';

interface MashupSeekSliderProps {
    mashup: Mashup | UnpublishedMashup | VkMashup;
}

export default function MashupSeekSlider({ mashup }: MashupSeekSliderProps) {
    const duration = mashup.duration || 0;
    const position = useSmoothSeek(duration);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);

    // Пока тянут бегунок, показываем палец пользователя, а не позицию трека.
    const [dragValue, setDragValue] = useState<number | null>(null);

    useEffect(() => {
        updateSeek(0);
        updateChangedSeek(null);
    }, [updateChangedSeek, updateSeek]);

    return (
        <div className='absolute top-0 w-full pr-8'>
            <Slider
                min={0}
                max={duration}
                step={SEEK_STEP_MS}
                aria-label='Позиция в треке'
                value={[dragValue ?? position]}
                onValueChange={(value) => setDragValue(value[0])}
                onValueCommit={(value) => {
                    // Позицию ставим сразу, не дожидаясь опроса: иначе бегунок на миг
                    // отпрыгивал на старое место (а на паузе — оставался там).
                    updateSeek(value[0]);
                    updateChangedSeek(value[0]);
                    setDragValue(null);
                }}
            />
        </div>
    );
}
