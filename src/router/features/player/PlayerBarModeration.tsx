import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import ReactHowler from 'react-howler';
import ImageWithAuth from '@/router/shared/image/imageWithAuth.tsx';
import { useEffect, useRef, useState } from 'react';
import MashupSeekSlider from '@/router/features/player/MashupSeekSlider.tsx';

export default function PlayerBarModeration() {
    const volume = usePlayerStore((state) => state.volume);
    const updateVolume = usePlayerStore((state) => state.updateVolume);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);
    const moderationIsPlaying = usePlayerStore((state) => state.moderationIsPlaying);
    const updateModerationIsPlaying = usePlayerStore((state) => state.updateModerationIsPlaying);
    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const updateSeek = usePlayerStore((state) => state.updateSeek);

    const [image, setImage] = useState<string>();
    const [imageFailed, setImageFailed] = useState<boolean>(false);

    const moderationPlayer = useRef<ReactHowler | null>(null);
    const moderationIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (moderationPlayer.current) {
            moderationPlayer.current.seek(changedSeek / 1000);
        }
    }, [changedSeek]);

    useEffect(() => {
        if (moderationIsPlaying) {
            moderationIntervalRef.current = window.setInterval(() => {
                if (moderationPlayer.current) {
                    updateSeek(moderationPlayer.current.seek() * 1000);
                }
            }, 500);
        } else if (moderationIntervalRef.current) {
            clearInterval(moderationIntervalRef.current);
        }

        return () => {
            if (moderationIntervalRef.current) {
                clearInterval(moderationIntervalRef.current);
            }
        };
    }, [moderationPlayer, updateSeek]);

    if (!moderationSrc) return null;

    return (
        <div className='fixed bottom-4 left-4 right-4 h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px] shadow-lg z-10'>
            <MashupSeekSlider mashup={moderationSrc} />

            <div className='w-full flex justify-between items-center'>
                {/*левая часть*/}
                <div className='w-1/3 flex items-center gap-x-6'>
                    <ImageWithAuth
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${moderationSrc.id}_800x800.png`}
                        alt={moderationSrc.name}
                        className='w-12 h-12 rounded-[10px]'
                        image={image}
                        setImage={setImage}
                        failed={imageFailed}
                        setFailed={setImageFailed}
                    />

                    <div className='flex flex-col min-w-0'>
                        <span className='font-bold text-[18px] text-onSurface truncate'>
                            {moderationSrc.name}
                        </span>
                        <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                            {moderationSrc.authors.map((author, index) => (
                                <div key={index}>
                                    <Link
                                        key={author}
                                        to={`/user/${author}`}
                                        className='font-medium text-onSurfaceVariant'
                                    >
                                        {author}
                                    </Link>

                                    {index !== moderationSrc.authors.length - 1 && (
                                        <span className='text-onSurfaceVariant'>, </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/*центральная часть*/}
                <div className='flex flex-row justify-center items-center gap-x-6'>
                    {moderationIsPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => updateModerationIsPlaying(false)}
                        >
                            <PauseHollowIcon color='onSurface' />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => updateModerationIsPlaying(true)}
                        >
                            <PlayHollowIcon color='onSurface' />
                        </Button>
                    )}
                </div>

                {/*правая часть*/}
                <div className='w-1/3 flex justify-end items-center gap-x-6'>
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
                </div>
            </div>

            <ReactHowler
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${moderationSrc.id}.mp3`}
                playing={moderationIsPlaying}
                volume={volume}
                ref={(ref) => (moderationPlayer.current = ref)}
            />
        </div>
    );
}
