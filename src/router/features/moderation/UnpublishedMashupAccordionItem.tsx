import { AccordionContent, AccordionItem } from '@/components/ui/accordion.tsx';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { useTrackStore } from '@/store/entities/track.ts';
import { axiosSession, cn, openExternal } from '@/lib/utils.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    loadSelectedTracks,
    SelectedTrack,
    TrackType,
    UploadMashupRequestBody
} from '@/router/shared/types/upload';
import { isExplicit, setExplicit, switchBit } from '@/lib/bitmask';
import { useToast } from '@/router/shared/hooks/use-toast';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
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
import { getToken } from '@/store/global';
import { format } from 'date-fns';
import WarningIcon from '@/components/icons/Warning';
import { RegEx } from '@/lib/regex';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { TooltipContent } from '@/components/ui/tooltip';
import { AxiosSmashUpResponse } from '@/router/shared/types/smashup';
import { UploadYouTubeTrackDialog } from '@/router/shared/components/track/UploadYouTubeTrackDialog';
import BaseToast from '@/router/shared/toasts/Base';
import { Mashup } from '@/store/entities/mashup';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { editUnpublishedMashup } from '@/router/features/moderation/editUnpublishedMashup.ts';
import ModerationGenresDialog from '@/router/features/moderation/ModerationGenresDialog.tsx';
import { useAccordionScroll } from '@/router/features/moderation/useAccordionScroll.ts';
import CoverEdit from '@/router/features/moderation/CoverEdit.tsx';
import EditTextDialog from '@/router/features/moderation/EditTextDialog.tsx';
import CoauthorsDialog from '@/router/features/moderation/CoauthorsDialog.tsx';
import AddSourceDialog from '@/router/features/moderation/AddSourceDialog.tsx';
import { TRACK_ICON } from '@/router/features/moderation/trackIcons.tsx';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import { StatusKind, statusKindFromLink, statusKindOf, withStatusKind } from '@/lib/statusLink.ts';

const STATUS_KIND_OPTIONS: { value: StatusKind; label: string }[] = [
    { value: 'base', label: 'Основа' },
    { value: 'alt', label: 'Альт' },
    { value: 'none', label: 'Нет' }
];

interface UnpublishedMashupAccordionItem {
    value: string;
    accordionValue?: string;
    mashup: UnpublishedMashup;
    /** Тоггл раскрытия — вешается на всю строку (не только на шеврон). */
    onToggle?: () => void;
}

export function UnpublishedMashupAccordionItem({
    mashup,
    accordionValue,
    value,
    onToggle
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
    }, [accordionValue, loading, mashup, trackStore, value]);

    useEffect(() => {
        if (accordionValue === value) {
            loadSelectedTracks(mashup, trackStore).then(setTracks);
        }
    }, [accordionValue, mashup, trackStore, value]);

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
            .catch(axiosCatcher(toast, 'при отклонении мешапа.'));
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
    const toggleExplicit = () => {
        if (switchingExplicit) return;
        setSwitchingExplicit(true);
        editUnpublishedMashup(mashup.id, {
            statuses: switchBit(mashup.statuses, isExplicit, setExplicit)
        })
            .catch(axiosCatcher(toast, 'при изменении статуса'))
            .catch(() => {})
            .finally(() => setSwitchingExplicit(false));
    };

    /** Пересобрать исходники и сохранить (tracks — SmashUp-id, tracksUrls — внешние ссылки). */
    const saveTracks = (list: SelectedTrack[], context: string) => {
        const body: UploadMashupRequestBody = { tracks: [], tracksUrls: [] };
        list.forEach((t) => t.addToBody(body));
        return editUnpublishedMashup(mashup.id, body).catch(axiosCatcher(toast, context));
    };

    // Ссылка, для которой вид уже выставлен (авто или вручную): авто-назначение
    // срабатывает один раз на ссылку и не перебивает выбор модератора.
    const kindSetFor = useRef<string | null>(null);

    const saveKind = (kind: StatusKind) => {
        kindSetFor.current = `${mashup.id}:${statusUrl}`;
        return editUnpublishedMashup(mashup.id, { statuses: withStatusKind(mashup.statuses, kind) })
            .catch(axiosCatcher(toast, 'при изменении статуса'))
            .catch(() => {});
    };

    // Ссылка и вид (основа/альт) сохраняются одним запросом: вид — по паблику VK.
    const saveLink = (link: string) => {
        const kind = statusKindFromLink(link);
        if (kind) kindSetFor.current = `${mashup.id}:${link}`;
        return editUnpublishedMashup(mashup.id, {
            statusesUrls: link ? [link] : [],
            ...(kind ? { statuses: withStatusKind(mashup.statuses, kind) } : {})
        }).catch(axiosCatcher(toast, 'при изменении ссылки'));
    };

    const linkKind = statusKindFromLink(statusUrl);

    const isOpen = accordionValue === value;

    // Вид по ссылке назначаем сразу: при раскрытии, если флажки с ней расходятся.
    useEffect(() => {
        if (!isOpen || !linkKind || statusKindOf(mashup.statuses) === linkKind) return;
        if (kindSetFor.current === `${mashup.id}:${statusUrl}`) return;
        saveKind(linkKind);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, linkKind, mashup.id, mashup.statuses, statusUrl]);

    const itemRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useAccordionScroll(itemRef, contentRef, isOpen);

    if (!unpublishedMashups) return null;

    return (
        <AccordionItem value={value} ref={itemRef}>
            {/* Клик по всей строке раскрывает; шеврон — в самом право. Всё редактирование — внутри строки. */}
            <div
                className='min-h-[60px] rounded-2xl p-[6px] bg-surfaceVariant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-x-4 cursor-pointer'
                onClick={onToggle}
            >
                <div className='flex flex-1 min-w-0 items-center gap-x-4'>
                    <ImageWithSkeleton
                        src={imageUrl}
                        alt={mashup.name}
                        className='w-12 h-12 shrink-0 rounded-[10px]'
                    />
                    <div className='flex flex-col items-start min-w-0'>
                        <span className='font-medium text-onSurface truncate max-w-full'>
                            {mashup.name}
                        </span>
                        <span className='font-medium text-onSurfaceVariant truncate max-w-full'>
                            {mashup.authors?.join(', ')}
                        </span>
                    </div>
                </div>

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
                            variant='nothing'
                            size='control'
                            className='group'
                            aria-label='Воспроизвести'
                            onClick={(e) => {
                                e.stopPropagation();
                                playModerationMashup(mashup);
                            }}
                        >
                            <PlayHollowIcon
                                className='group-hover:text-primary'
                                color='onSurface'
                                size={32}
                            />
                        </Button>

                        <Button
                            className='flex-1 md:flex-none py-[7px] font-medium text-sm rounded-xl'
                            onClick={(e) => {
                                e.stopPropagation();
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
                                                    before='Мешап'
                                                    field={`${uploadedMashup.authors.join(', ')} — ${uploadedMashup.name}`}
                                                    after='загружен'
                                                />
                                            ),
                                            duration: 2000
                                        });
                                    })
                                    .catch(axiosCatcher(toast, 'при публикации мешапа'));
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
                                <Button className='flex-1 md:flex-none py-[7px] font-medium text-sm rounded-xl bg-onPrimary text-onSurface hover:bg-onPrimary/90 hover:text-onSurface/90'>
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
                                        Отклонение мешапа
                                    </DialogTitle>
                                    <DialogDescription asChild className='pt-0 mt-0'>
                                        <div>
                                            <Textarea
                                                placeholder='Комментарий'
                                                value={rejectionValue}
                                                onChange={(e) => setRejectionValue(e.target.value)}
                                            />
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <Button onClick={() => rejectMashup()}>Сохранить</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Шеврон раскрытия — в самом право; вращается по состоянию */}
                    <ChevronDown
                        className={cn(
                            'h-7 w-7 shrink-0 text-onSurfaceVariant transition-transform duration-200',
                            isOpen && 'rotate-180'
                        )}
                    />
                </div>
            </div>
            <AccordionContent
                ref={contentRef}
                className='mt-4 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-x-6'
            >
                <CoverEdit mashupId={mashup.id} src={imageUrl} alt={mashup.name} />

                <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-x-6'>
                    {/*название, авторы*/}
                    <div className='flex flex-col gap-y-7 min-w-0'>
                        <div className='w-full flex flex-col gap-y-2.5'>
                            <Label className='font-medium text-onSurfaceVariant'>
                                Название мешапа
                            </Label>
                            <div className='flex items-start gap-x-1'>
                                <span className='font-semibold text-xl break-words min-w-0'>
                                    {mashup.name}
                                </span>
                                <EditTextDialog
                                    title='Название мешапа'
                                    ariaLabel='Изменить название'
                                    initial={mashup.name}
                                    maxLength={64}
                                    onSave={(name) =>
                                        editUnpublishedMashup(mashup.id, { name }).catch(
                                            axiosCatcher(toast, 'при изменении названия')
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className='w-full flex flex-col gap-y-2.5'>
                            <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                            <div className='flex items-start gap-x-1'>
                                <span className='font-semibold text-xl break-words min-w-0'>
                                    {mashup.authors?.join(', ')}
                                </span>
                                <CoauthorsDialog mashup={mashup} />
                            </div>
                        </div>
                    </div>

                    {/*Исходники*/}
                    <div className='w-full min-w-0'>
                        <Label className='font-medium text-onSurfaceVariant'>Исходники</Label>
                        <div className='w-full max-h-[180px] overflow-y-auto'>
                            {tracks &&
                                tracks.map((selectedTrack) => {
                                    const track = selectedTrack.track;
                                    const thumb = (
                                        <TrackSmallThumb
                                            key={`${selectedTrack.keyType}-${String(selectedTrack.key)}`}
                                            track={track}
                                            icon={TRACK_ICON[selectedTrack.keyType]}
                                            onRemove={
                                                tracks.length > 1
                                                    ? () =>
                                                          saveTracks(
                                                              tracks.filter(
                                                                  (t) => t !== selectedTrack
                                                              ),
                                                              'при удалении исходника'
                                                          ).catch(() => {})
                                                    : undefined
                                            }
                                        />
                                    );

                                    if (selectedTrack.keyType === TrackType.YouTube) {
                                        return (
                                            <UploadYouTubeTrackDialog
                                                key={`yt-${String(selectedTrack.key)}`}
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
                        {tracks && (
                            <div className='mt-3'>
                                <AddSourceDialog
                                    current={tracks}
                                    onAdd={(t) =>
                                        saveTracks([...tracks, t], 'при добавлении исходника')
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/*Жанры*/}
                    <div className='w-full'>
                        <Label className='font-medium text-onSurfaceVariant'>Жанры</Label>
                        <div className='w-full max-h-[180px] overflow-y-auto flex flex-col gap-y-3'>
                            {mashup.genres &&
                                mashup.genres.map((genre) => (
                                    <div
                                        key={genre}
                                        className={cn(
                                            'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                            'font-medium text-[15px] text-onBackground'
                                        )}
                                    >
                                        {genre}
                                    </div>
                                ))}
                        </div>
                        <div className='mt-3'>
                            <ModerationGenresDialog mashup={mashup} />
                        </div>
                    </div>

                    {/*дополнительно*/}
                    <div className='w-full flex flex-col gap-y-[5px] min-w-0'>
                        <Label className='font-medium text-onSurfaceVariant'>Дополнительно</Label>
                        <div className='w-full flex flex-col gap-y-3'>
                            <div className='flex items-center gap-x-4 py-[11px] px-5 bg-surfaceVariant rounded-2xl'>
                                <Checkbox
                                    checked={isExplicit(mashup.statuses)}
                                    onClick={toggleExplicit}
                                />
                                <Label className='font-medium text-[15px] text-onSurface'>
                                    Explicit (Мат)
                                </Label>
                            </div>

                            <SegmentedControl
                                aria-label='Основа или альт'
                                className='w-full'
                                options={STATUS_KIND_OPTIONS}
                                value={statusKindOf(mashup.statuses)}
                                onChange={(kind) => saveKind(kind)}
                            />
                            {linkKind && (
                                <span className='-mt-1 px-1 text-xs text-onSurfaceVariant'>
                                    По ссылке: {linkKind === 'base' ? 'основа' : 'альт'}
                                </span>
                            )}

                            <div className='flex items-center gap-x-1 min-w-0'>
                                <Button
                                    variant='nothing'
                                    className='flex-1 min-w-0 bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center justify-start gap-x-4 hover:bg-onSurface/10 disabled:opacity-100'
                                    aria-label='Открыть ссылку'
                                    disabled={!statusUrl}
                                    onClick={() => openExternal(statusUrl)}
                                >
                                    <LinkIcon />
                                    <span className='font-medium min-w-0 truncate'>
                                        {statusUrl || 'Ссылка на основу / альт'}
                                    </span>
                                </Button>
                                <EditTextDialog
                                    title='Ссылка на основу / альт'
                                    ariaLabel='Изменить ссылку'
                                    initial={statusUrl ?? ''}
                                    placeholder='https://vk.com/wall-…'
                                    allowEmpty
                                    onSave={saveLink}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
