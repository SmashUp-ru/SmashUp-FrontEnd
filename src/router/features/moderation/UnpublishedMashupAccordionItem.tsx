import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import EditIcon from '@/components/icons/edit/Edit24';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { useTrackStore } from '@/store/entities/track.ts';
import { axiosSession, cn } from '@/lib/utils.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation.ts';
import { useCallback, useEffect, useState } from 'react';
import { loadSelectedTracks, SelectedTrack, TrackType } from '@/router/shared/types/upload';
import { isExplicit, isTwitchBanned, setExplicit, setTwitchBanned, switchBit } from '@/lib/bitmask';
import { useToast } from '@/router/shared/hooks/use-toast';
import { Link } from 'react-router-dom';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import YouTubeIcon from '@/components/icons/YouTube';
import YandexMusicIcon from '@/components/icons/YandexMusic';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea.tsx';
import SpotifyIcon from '@/components/icons/Spotify';
import { getToken } from '@/store/global';
import { format } from 'date-fns';
import WarningIcon from '@/components/icons/Warning';
import { RegEx } from '@/lib/regex';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { TooltipContent } from '@/components/ui/tooltip';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup';
import { SmashUpIcon } from '@/components/icons/SmashUp';
import { UploadYouTubeTrackDialog } from '@/router/shared/components/track/UploadYouTubeTrackDialog';
import BaseToast from '@/router/shared/toasts/Base';
import { Mashup } from '@/store/entities/mashup';

interface UnpublishedMashupAccordionItem {
    value: string;
    accordionValue?: string;
    mashup: UnpublishedMashup;
}

export function UnpublishedMashupAccordionItem({
    mashup,
    accordionValue,
    value
}: UnpublishedMashupAccordionItem) {
    const { playModerationMashup } = usePlayer();
    const { toast } = useToast();
    const unpublishedMashups = useModerationStore((state) => state.unpublishedMashups);
    const updateUnpublishedMashups = useModerationStore((state) => state.updateUnpublishedMashups);

    const [loading, setLoading] = useState<boolean>(false);
    const [tracks, setTracks] = useState<SelectedTrack[]>();

    const trackStore = useTrackStore();

    useEffect(() => {
        if (!loading && accordionValue === value) {
            setLoading(true);

            loadSelectedTracks(mashup, trackStore).then(setTracks);
        }
    }, [accordionValue]);

    useEffect(() => {
        if (accordionValue === value) {
            loadSelectedTracks(mashup, trackStore).then(setTracks);
        }
    }, [mashup]);

    const statusUrl = mashup.statusesUrls ? mashup.statusesUrls[0] : undefined;

    const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${mashup.id}_800x800.png?token=${getToken()}`;

    const [rejectionValue, setRejectionValue] = useState('');
    const rejectMashup = useCallback(() => {
        axiosSession
            .post(`/moderation/unpublished_mashup/reject`, {
                id: mashup.id,
                reason: rejectionValue
            })
            .then(() => {
                if (unpublishedMashups) {
                    updateUnpublishedMashups([
                        ...unpublishedMashups.filter((um) => um.id !== mashup.id)
                    ]);
                }
            })
            .catch(axiosCatcher(toast, 'при отклонении мэшапа.'));
    }, [mashup.id, rejectionValue, toast, unpublishedMashups, updateUnpublishedMashups]);

    const [hasYouTube, setHasYoutube] = useState(false);

    useEffect(() => {
        let hasYouTube = false;
        for (const trackUrl of mashup.tracksUrls) {
            if (RegEx.YOUTUBE.test(trackUrl)) {
                hasYouTube = true;
                break;
            }
        }

        setHasYoutube(hasYouTube);
    }, [mashup]);

    const [switchingExplicit, setSwitchingExplicit] = useState<boolean>(false);
    const [switchingBanWords, setSwitchingBanWords] = useState<boolean>(false);

    const switchStatus = useCallback(
        (
            isSwitching: boolean,
            setSwitching: (s: boolean) => unknown,
            isStatus: (b: number) => boolean,
            setStatus: (b: number, s: boolean) => number
        ) => {
            if (isSwitching) {
                return;
            }

            setSwitching(true);

            axiosSession
                .post('/moderation/unpublished_mashup/edit', {
                    id: mashup.id,
                    statuses: switchBit(mashup.statuses, isStatus, setStatus)
                })
                .then((r: AxiosSmashUpResponse<UnpublishedMashup>) => {
                    const newMashup = r.data.response;

                    if (unpublishedMashups) {
                        updateUnpublishedMashups(
                            unpublishedMashups.map((mashup) =>
                                mashup.id === newMashup.id ? newMashup : mashup
                            )
                        );
                    }
                })
                .finally(() => setSwitching(false));
        },
        [mashup.id, mashup.statuses, unpublishedMashups, updateUnpublishedMashups]
    );

    if (!unpublishedMashups) return null;

    return (
        <AccordionItem value={value}>
            <div className='min-h-[60px] rounded-2xl p-[6px] bg-surfaceVariant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-x-4'>
                <AccordionTrigger className='flex-1 min-w-0 h-auto p-0 bg-transparent rounded-none'>
                    <div className='flex items-center gap-x-4 min-w-0'>
                        <img
                            src={imageUrl}
                            alt={mashup.name}
                            className='w-12 h-12 rounded-[10px]'
                        />
                        <div className='flex flex-col items-start'>
                            <span className='font-bold text-onSurface'>{mashup.name}</span>
                            <span className='font-medium text-onSurfaceVariant'>
                                {mashup.authors?.join(', ')}
                            </span>
                        </div>
                    </div>
                </AccordionTrigger>

                <div className='flex items-center gap-2 md:flex-wrap md:justify-start md:gap-x-7'>
                    <div className='flex flex-1 md:flex-none items-center gap-2 md:gap-x-3'>
                        {hasYouTube && (
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger>
                                        <WarningIcon />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className='max-w-[300px] text-center'
                                        side='top'
                                        sideOffset={16}
                                    >
                                        <p>В треках есть непривязанная ссылка с YouTube</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <div className='hidden md:flex items-center justify-center text-onSurfaceVariant md:min-w-[150px]'>
                            {format(new Date(mashup.publishTime * 1000), 'dd.MM.yyyy HH:mm')}
                        </div>

                        <Button
                            variant='ghost'
                            size='icon'
                            className=''
                            aria-label='Воспроизвести'
                            onClick={(e) => {
                                playModerationMashup(mashup);
                                e.preventDefault();
                            }}
                        >
                            <PlayHollowIcon color='primary' size={36} />
                        </Button>

                        <Button
                            className='flex-1 md:flex-none py-[7px] font-bold text-base rounded-xl'
                            onClick={(e) => {
                                e.preventDefault();
                                axiosSession
                                    .post(`/moderation/unpublished_mashup/publish?id=${mashup.id}`)
                                    .then((r: AxiosSmashUpResponse<Mashup>) => {
                                        updateUnpublishedMashups([
                                            ...unpublishedMashups.filter(
                                                (um) => um.id !== mashup.id
                                            )
                                        ]);

                                        const uploadedMashup = r.data.response;

                                        toast({
                                            element: (
                                                <BaseToast
                                                    image={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${uploadedMashup.imageUrl}_100x100.png`}
                                                    before='Мэшап'
                                                    field={`${uploadedMashup.authors.join(', ')} — ${uploadedMashup.name}`}
                                                    after='успешно загружен!'
                                                />
                                            ),
                                            duration: 2000
                                        });
                                    })
                                    .catch(axiosCatcher(toast, 'при публикации мэшапа'));
                            }}
                        >
                            Принять
                        </Button>

                        <Dialog>
                            <DialogTrigger
                                asChild
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Button className='flex-1 md:flex-none py-[7px] font-bold text-base rounded-xl bg-onPrimary text-onSurface hover:bg-onPrimary/90 hover:text-onSurface/90'>
                                    Отклонить
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className='w-[calc(100vw-2rem)] max-w-[765px] md:w-[765px]'
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <DialogHeader>
                                    <DialogTitle className='pb-0 mb-0'>
                                        Отклонение мэшапа
                                    </DialogTitle>
                                    <DialogDescription className='pt-0 mt-0'>
                                        <Textarea
                                            placeholder='Комментарий'
                                            value={rejectionValue}
                                            onChange={(e) => setRejectionValue(e.target.value)}
                                        />
                                    </DialogDescription>
                                </DialogHeader>
                                <Button onClick={() => rejectMashup()}>Сохранить</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Button className='md:mr-7' variant='ghost' size='icon' asChild>
                        <Link
                            to={`/mashup/moderation/${mashup.id}`}
                            aria-label='Редактировать мэшап'
                        >
                            <EditIcon />
                        </Link>
                    </Button>
                </div>
            </div>
            <AccordionContent className='mt-4 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-x-6'>
                <img
                    src={imageUrl}
                    alt={mashup.name}
                    className='w-[216px] h-[216px] max-w-full rounded-[30px] shrink-0'
                />

                <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-x-6'>
                    {/*название, авторы*/}
                    <div className='flex flex-col gap-y-7'>
                        <div className='w-full flex flex-col gap-y-2.5'>
                            <Label className='font-medium text-onSurfaceVariant'>
                                Название мэшапа
                            </Label>
                            <span className='font-bold text-[24px]'>{mashup.name}</span>
                        </div>

                        <div className='w-full flex flex-col gap-y-2.5'>
                            <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                            <span className='font-bold text-[24px]'>
                                {mashup.authors?.join(', ')}
                            </span>
                        </div>
                    </div>

                    {/*Исходники*/}
                    <div className='w-full'>
                        <Label className='font-medium text-onSurfaceVariant'>Исходники</Label>
                        <div className='w-full max-h-[180px] overflow-y-scroll'>
                            {tracks &&
                                tracks.map((selectedTrack) => {
                                    const type = selectedTrack.keyType;

                                    let icon;
                                    if (type === TrackType.SmashUp) {
                                        icon = <SmashUpIcon />;
                                    } else if (type === TrackType.YouTube) {
                                        icon = <YouTubeIcon />;
                                    } else if (type === TrackType.YandexMusic) {
                                        icon = <YandexMusicIcon />;
                                    } else if (type === TrackType.Spotify) {
                                        icon = <SpotifyIcon />;
                                    } else {
                                        throw new Error(`${type} not supported`);
                                    }

                                    const track = selectedTrack.track;
                                    const thumb = (
                                        <TrackSmallThumb key={track.id} track={track} icon={icon} />
                                    );

                                    if (type === TrackType.YouTube) {
                                        return (
                                            <UploadYouTubeTrackDialog
                                                mashup={mashup}
                                                track={track}
                                                className='w-full'
                                            >
                                                {thumb}
                                            </UploadYouTubeTrackDialog>
                                        );
                                    }

                                    return thumb;
                                })}
                        </div>
                    </div>

                    {/*Жанры*/}
                    <div className='w-full'>
                        <Label className='font-medium text-onSurfaceVariant'>Жанры</Label>
                        <div className='w-full max-h-[180px] overflow-y-scroll flex flex-col gap-y-3'>
                            {mashup.genres &&
                                mashup.genres.map((genre) => (
                                    <div
                                        key={genre}
                                        className={cn(
                                            'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                            'font-bold text-[18px] text-onBackground'
                                        )}
                                    >
                                        {genre}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/*дополнительно*/}
                    <div className='w-full flex flex-col gap-y-[5px]'>
                        <Label className='font-medium text-onSurfaceVariant'>Дополнительно</Label>
                        <div className='w-full flex flex-col gap-y-3'>
                            <div className='flex items-center gap-x-4 py-[11px] px-5 bg-surfaceVariant rounded-2xl'>
                                <Checkbox
                                    checked={isExplicit(mashup.statuses)}
                                    onClick={() => {
                                        switchStatus(
                                            switchingExplicit,
                                            setSwitchingExplicit,
                                            isExplicit,
                                            setExplicit
                                        );
                                    }}
                                />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Explicit (Мат)
                                </Label>
                            </div>

                            <div className='flex items-center gap-x-4 py-[11px] px-5 bg-surfaceVariant rounded-2xl'>
                                <Checkbox
                                    checked={isTwitchBanned(mashup.statuses)}
                                    onClick={() => {
                                        switchStatus(
                                            switchingBanWords,
                                            setSwitchingBanWords,
                                            isTwitchBanned,
                                            setTwitchBanned
                                        );
                                    }}
                                />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Бан-ворды Twitch
                                </Label>
                            </div>

                            <Button
                                variant='ghost'
                                size='icon'
                                className='cursor-pointer'
                                aria-label='Открыть ссылку'
                                onClick={() => {
                                    if (statusUrl) {
                                        window.open(statusUrl, '_blank');
                                    }
                                }}
                            >
                                <div className='w-full min-w-0 bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center gap-x-4'>
                                    <LinkIcon />
                                    <span className='font-medium text-onSurfaceVariant min-w-0 truncate'>
                                        {statusUrl || 'Ссылка на основу / альт'}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
