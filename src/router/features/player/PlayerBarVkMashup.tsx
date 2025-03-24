import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import ReactHowler from 'react-howler';
import { useEffect, useRef, useState } from 'react';
import MashupSeekSlider from '@/router/features/player/MashupSeekSlider.tsx';
import { axiosSession } from '@/lib/utils';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup';
import { useToast } from '@/router/shared/hooks/use-toast';
import ErrorToast from '@/router/shared/toasts/error';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useVkMashups } from '@/router/pages/vkMashup/useVkMashups';
import { VkMashup } from '@/store/entities/vkMashup';

export default function PlayerBarVkMashup() {
    const { toast } = useToast();

    const volume = usePlayerStore((state) => state.volume);
    const updateVolume = usePlayerStore((state) => state.updateVolume);
    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);
    const updateVkMashupSrc = usePlayerStore((state) => state.updateVkMashupSrc);
    const vkMashupIsPlaying = usePlayerStore((state) => state.vkMashupIsPlaying);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);
    const changedSeek = usePlayerStore((state) => state.changedSeek);
    const updateSeek = usePlayerStore((state) => state.updateSeek);

    const vkMashupPlayer = useRef<ReactHowler | null>(null);
    const vkMashupIntervalRef = useRef<number | null>(null);

    const { vkMashups, updateVkMashup, updateVkMashups } = useVkMashups();

    useEffect(() => {
        if (vkMashupPlayer.current) {
            vkMashupPlayer.current.seek(changedSeek / 1000);
        }
    }, [changedSeek]);

    useEffect(() => {
        if (vkMashupIsPlaying) {
            vkMashupIntervalRef.current = window.setInterval(() => {
                if (vkMashupPlayer.current) {
                    updateSeek(vkMashupPlayer.current.seek() * 1000);
                }
            }, 500);
        } else if (vkMashupIntervalRef.current) {
            clearInterval(vkMashupIntervalRef.current);
        }

        return () => {
            if (vkMashupIntervalRef.current) {
                clearInterval(vkMashupIntervalRef.current);
            }
        };
    }, [vkMashupIsPlaying, updateSeek]);

    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        if (vkMashups === null || vkMashupSrc === null) {
            setAudioUrl(null);
        } else {
            setAudioUrl(vkMashupSrc.audioUrl);
            if (vkMashupSrc.audioUrl === null) {
                axiosSession
                    .get(
                        `${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/vk/${vkMashupSrc.ownerId}_${vkMashupSrc.audioId}`
                    )
                    .then(
                        (
                            r: AxiosSmashUpResponse<{
                                audioUrl: string | null;
                                duration: number | null;
                            }>
                        ) => {
                            const audioUrl = r.data.response.audioUrl;
                            const duration = r.data.response.duration;

                            if (audioUrl === null || duration === null) {
                                toast({
                                    element: (
                                        <ErrorToast
                                            icon
                                            before='Ошибка'
                                            field='при загрузке аудио.'
                                            after='Свяжитесь с нами!'
                                        />
                                    ),
                                    duration: 2000,
                                    variant: 'destructive'
                                });
                            } else {
                                const newMashup: VkMashup = {
                                    ...vkMashupSrc,
                                    audioUrl,
                                    duration
                                };

                                updateVkMashupSrc(newMashup);

                                updateVkMashups(updateVkMashup(vkMashups, newMashup));
                            }
                        }
                    )
                    .catch(axiosCatcher(toast, 'при загрузке аудио'));
            }
        }
    }, [vkMashups, vkMashupSrc]);

    if (!vkMashupSrc) return null;

    return (
        <div className='fixed bottom-4 left-4 right-4 h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px] shadow-lg z-10'>
            <MashupSeekSlider mashup={vkMashupSrc} />

            <div className='w-full flex justify-between items-center'>
                {/*левая часть*/}
                <div className='w-1/3 flex items-center gap-x-6'>
                    <img
                        src={
                            vkMashupSrc.imageUrl ||
                            `${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/default_100x100.png`
                        }
                        alt={vkMashupSrc.name}
                        className='w-12 h-12 rounded-[10px]'
                    />

                    <div className='flex flex-col min-w-0'>
                        <span className='font-bold text-[18px] text-onSurface truncate'>
                            {vkMashupSrc.name}
                        </span>
                        <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                            {vkMashupSrc.artist}
                        </div>
                    </div>
                </div>

                {/*центральная часть*/}
                <div className='flex flex-row justify-center items-center gap-x-6'>
                    {vkMashupIsPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => updateVkMashupIsPlaying(false)}
                        >
                            <PauseHollowIcon color='onSurface' />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => updateVkMashupIsPlaying(true)}
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

            {audioUrl && (
                <ReactHowler
                    src={audioUrl}
                    playing={vkMashupIsPlaying}
                    volume={volume}
                    ref={(ref) => (vkMashupPlayer.current = ref)}
                    html5={true}
                />
            )}
        </div>
    );
}
