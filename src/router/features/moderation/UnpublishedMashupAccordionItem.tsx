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
import { useEffect, useState } from 'react';
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
import { AxiosResponse } from 'axios';
import { SmashUpResponse } from '@/router/shared/types/smashup';
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
    const rejectMashup = () => {
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
    };

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

    if (!unpublishedMashups) return null;

    const switchStatus = (
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
            .then((r: AxiosResponse<SmashUpResponse<UnpublishedMashup>>) => {
                const newMashup = r.data.response;

                updateUnpublishedMashups(
                    unpublishedMashups.map((mashup) =>
                        mashup.id === newMashup.id ? newMashup : mashup
                    )
                );
            })
            .finally(() => setSwitching(false));
    };

    return (
        <AccordionItem value={value}>
            <AccordionTrigger>
                <div className='w-full flex items-center justify-between py-[6px] pl-[6px]'>
                    <div className='flex items-center gap-x-4'>
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

                    <div className='flex items-center gap-x-7'>
                        <div className='flex items-center gap-x-3'>
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

                            <div className='flex items-center justify-center text-onSurfaceVariant min-w-[150px]'>
                                {format(new Date(mashup.publishTime * 1000), 'dd.MM.yyyy HH:mm')}
                            </div>

                            <Button
                                variant='ghost'
                                size='icon'
                                className=''
                                onClick={(e) => {
                                    playModerationMashup(mashup);
                                    e.preventDefault();
                                }}
                            >
                                <PlayHollowIcon color='primary' size={36} />
                            </Button>

                            <Button
                                className='py-[7px] font-bold text-base rounded-xl'
                                onClick={(e) => {
                                    e.preventDefault();
                                    axiosSession
                                        .post(
                                            `/moderation/unpublished_mashup/publish?id=${mashup.id}`
                                        )
                                        .then((r: AxiosResponse<SmashUpResponse<Mashup>>) => {
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Button className='py-[7px] font-bold text-base rounded-xl bg-onPrimary text-onSurface hover:bg-onPrimary/90 hover:text-onSurface/90'>
                                        Отклонить
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    className='w-[765px]'
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

                        <Button className='mr-7' variant='ghost' size='icon'>
                            <Link to={`/mashup/moderation/${mashup.id}`}>
                                <EditIcon />
                            </Link>
                        </Button>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className='mt-4 flex gap-x-6'>
                <img
                    src={imageUrl}
                    alt={mashup.name}
                    className='w-[216px] h-[216px] rounded-[30px]'
                />

                <div className='w-full grid grid-cols-4 gap-x-6'>
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
                                onClick={() => {
                                    if (statusUrl) {
                                        window.open(statusUrl, '_blank');
                                    }
                                }}
                            >
                                <div className='w-full bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center gap-x-4'>
                                    <LinkIcon />
                                    <span className='font-medium text-onSurfaceVariant'>
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
