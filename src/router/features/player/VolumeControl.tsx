import { useEffect, useRef } from 'react';

import VolumeIcon from '@/components/icons/Volume.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { usePlayerStore } from '@/store/player.ts';

/** Иконка громкости + слайдер. Идентичен во всех трёх барах плеера. */
export default function VolumeControl() {
    const volume = usePlayerStore((state) => state.volume);
    const updateVolume = usePlayerStore((state) => state.updateVolume);

    // Уровень, на который возвращаемся при снятии мьюта. Если замьютили с нуля
    // (звук и так был выключен) — возвращаем полную громкость, иначе кнопка
    // выглядела бы сломанной.
    const lastAudible = useRef(volume > 0 ? volume : 1);
    useEffect(() => {
        if (volume > 0) lastAudible.current = volume;
    }, [volume]);

    const muted = volume <= 0;

    return (
        // Громкость скрыта на мобильном (нет смысла на тач-устройстве, экономит место в баре).
        <div className='hidden md:flex items-center gap-x-6'>
            <Button
                variant='ghost'
                size='icon'
                aria-label={muted ? 'Включить звук' : 'Выключить звук'}
                onClick={() => updateVolume(muted ? lastAudible.current : 0)}
            >
                <VolumeIcon color='onSurface' level={volume} />
            </Button>

            <Slider
                className='w-[150px]'
                trackClassName='h-[5px]'
                min={0.0}
                max={1.0}
                step={0.01}
                value={[volume]}
                onValueChange={(value) => updateVolume(value[0])}
            />
        </div>
    );
}
