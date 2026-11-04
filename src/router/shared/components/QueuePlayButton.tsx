import { Button } from '@/components/ui/button.tsx';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';

interface QueuePlayButtonProps {
    /** Состав очереди; explicit отфильтруется по настройкам пользователя. */
    mashupIds: number[];
    queueName: string;
    queueId: string;
    hoverColor?: string;
}

/** Play/pause для hero-шапок страниц (плейлист, мешап, любимое, рекомендации, мешапы автора). */
export default function QueuePlayButton({
    mashupIds,
    queueName,
    queueId,
    hoverColor
}: QueuePlayButtonProps) {
    const { isThisPlaying, togglePlay } = useEntityThumb(mashupIds, queueName, queueId);

    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label={isThisPlaying ? 'Пауза' : 'Воспроизвести'}
            onClick={togglePlay}
        >
            <PlayPauseMorphIcon
                hollow
                playing={isThisPlaying}
                color='primary'
                hoverColor={hoverColor}
                size={32}
            />
        </Button>
    );
}
