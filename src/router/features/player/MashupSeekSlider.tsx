import { Slider } from '@/components/ui/slider.tsx';
import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/player.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';

interface MashupSeekSliderProps {
    mashup: Mashup | UnpublishedMashup;
}

export default function MashupSeekSlider({ mashup }: MashupSeekSliderProps) {
    const seek = usePlayerStore((state) => state.seek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);

    const [localSeekChanging, setLocalSeekChanging] = useState(false);
    const [localSeek, setLocalSeek] = useState(0);
    useEffect(() => {
        if (!localSeekChanging && seek !== localSeek) {
            setLocalSeek(seek);
        }
    }, [seek]);

    useEffect(() => {
        updateChangedSeek(0);
    }, []);

    return (
        <div className='absolute top-0 w-full pr-8'>
            <Slider
                min={0}
                max={mashup.duration}
                value={[localSeek]}
                onValueChange={(value) => {
                    setLocalSeekChanging(true);
                    setLocalSeek(value[0]);
                }}
                onValueCommit={(value) => {
                    updateChangedSeek(value[0]);
                    setLocalSeekChanging(false);
                }}
            />
        </div>
    );
}
