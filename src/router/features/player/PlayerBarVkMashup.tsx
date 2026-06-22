import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import ReactHowler from 'react-howler';
import { useEffect, useState } from 'react';
import { usePlaybackEngine } from '@/router/features/player/usePlaybackEngine.ts';
import PlaybackBar from '@/router/features/player/PlaybackBar.tsx';
import VolumeControl from '@/router/features/player/VolumeControl.tsx';
import { axiosSession } from '@/lib/utils';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup';
import { useToast } from '@/router/shared/hooks/use-toast';
import ErrorToast from '@/router/shared/toasts/error';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useVkMashups } from '@/router/pages/vkMashup/useVkMashups';
import { VkMashup } from '@/store/entities/vkMashup';
import { coverUrl } from '@/lib/cdn.ts';

export default function PlayerBarVkMashup() {
    const { toast } = useToast();

    const volume = usePlayerStore((state) => state.volume);
    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);
    const updateVkMashupSrc = usePlayerStore((state) => state.updateVkMashupSrc);
    const vkMashupIsPlaying = usePlayerStore((state) => state.vkMashupIsPlaying);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const vkMashupPlayer = usePlaybackEngine(vkMashupIsPlaying);

    const { vkMashups, updateVkMashup, updateVkMashups } = useVkMashups(false);

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
        <PlaybackBar
            fixed
            seekMashup={vkMashupSrc}
            left={
                <>
                    <img
                        src={vkMashupSrc.imageUrl || coverUrl('mashup', 'default', 100)}
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
                </>
            }
            center={
                vkMashupIsPlaying ? (
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
                )
            }
            right={<VolumeControl />}
        >
            {audioUrl && (
                <ReactHowler
                    src={audioUrl}
                    playing={vkMashupIsPlaying}
                    volume={volume}
                    ref={(ref) => (vkMashupPlayer.current = ref)}
                    html5={true}
                />
            )}
        </PlaybackBar>
    );
}
