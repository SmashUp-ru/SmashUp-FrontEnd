import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import ReactHowler from 'react-howler';
import { usePlaybackEngine } from '@/router/features/player/usePlaybackEngine.ts';
import PlaybackBar from '@/router/features/player/PlaybackBar.tsx';
import VolumeControl from '@/router/features/player/VolumeControl.tsx';
import { getToken } from '@/store/global';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function PlayerBarModeration() {
    const volume = usePlayerStore((state) => state.volume);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);
    const moderationIsPlaying = usePlayerStore((state) => state.moderationIsPlaying);
    const updateModerationIsPlaying = usePlayerStore((state) => state.updateModerationIsPlaying);

    const moderationPlayer = usePlaybackEngine(moderationIsPlaying);

    if (!moderationSrc) return null;

    return (
        <PlaybackBar
            fixed
            seekMashup={moderationSrc}
            left={
                <>
                    <ImageWithSkeleton
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${moderationSrc.id}_800x800.png?token=${getToken()}`}
                        alt={moderationSrc.name}
                        className='w-12 h-12 rounded-[10px]'
                    />

                    <div className='flex flex-col min-w-0'>
                        <span className='font-bold text-[15px] text-onSurface truncate'>
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
                </>
            }
            center={
                moderationIsPlaying ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Пауза'
                        onClick={() => updateModerationIsPlaying(false)}
                    >
                        <PauseHollowIcon color='onSurface' size={32} />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Воспроизвести'
                        onClick={() => updateModerationIsPlaying(true)}
                    >
                        <PlayHollowIcon color='onSurface' size={32} />
                    </Button>
                )
            }
            right={<VolumeControl />}
        >
            <ReactHowler
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${moderationSrc.id}.mp3?token=${getToken()}`}
                playing={moderationIsPlaying}
                volume={volume}
                ref={(ref) => (moderationPlayer.current = ref)}
                html5={true}
            />
        </PlaybackBar>
    );
}
