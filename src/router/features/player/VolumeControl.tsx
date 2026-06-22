import VolumeIcon from '@/components/icons/Volume.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { usePlayerStore } from '@/store/player.ts';

/** Иконка громкости + слайдер. Идентичен во всех трёх барах плеера. */
export default function VolumeControl() {
    const volume = usePlayerStore((state) => state.volume);
    const updateVolume = usePlayerStore((state) => state.updateVolume);

    return (
        <>
            <div>
                <VolumeIcon color='onSurface' />
            </div>

            <Slider
                className='w-[150px]'
                trackClassName='h-[5px]'
                min={0.0}
                max={1.0}
                step={0.01}
                value={[volume]}
                onValueChange={(value) => updateVolume(value[0])}
            />
        </>
    );
}
