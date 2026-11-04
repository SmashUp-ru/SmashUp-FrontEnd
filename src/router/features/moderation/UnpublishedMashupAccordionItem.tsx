import { AccordionContent, AccordionItem } from '@/components/ui/accordion.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea.tsx';
import { getToken } from '@/store/global';
import { format } from 'date-fns';
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
import { FIELD_LABEL } from '@/router/features/moderation/moderationStyles.ts';
import {
    CONFIRM_CANCEL,
    CONFIRM_DIALOG,
    CONFIRM_FOOTER
} from '@/router/shared/components/confirmDialog.ts';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { ChevronDown, TriangleAlert } from 'lucide-react';
import CoverEdit from '@/router/features/moderation/CoverEdit.tsx';
import EditTextDialog from '@/router/features/moderation/EditTextDialog.tsx';
import CoauthorsDialog from '@/router/features/moderation/CoauthorsDialog.tsx';
import AddSourceDialog from '@/router/features/moderation/AddSourceDialog.tsx';
import { TRACK_ICON } from '@/router/features/moderation/trackIcons.tsx';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import {
    shortStatusLink,
    StatusKind,
    statusKindFromLink,
    statusKindOf,
    withStatusKind
} from '@/lib/statusLink.ts';

const TRACKS_PREVIEW = 4;

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
    const [rejectOpen, setRejectOpen] = useState(false);
    const rejectMashup = useCallback(() => {
        axiosSession
            .post(`/moderation/unpublished_mashup/reject`, {
                id: mashup.id,
                reason: rejectionValue.trim()
            })
            .then(() => {
                setRejectOpen(false);
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
    const [showAllTracks, setShowAllTracks] = useState(false);

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
                className='min-h-[64px] rounded-2xl p-2 bg-surfaceVariant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-x-4 cursor-pointer transition-colors motion-reduce:transition-none hover:bg-onSurface/[0.06]'
                onClick={onToggle}
            >
                <div className='flex flex-1 min-w-0 items-center gap-x-4'>
                    <ImageWithSkeleton
                        src={imageUrl}
                        alt={mashup.name}
                        className='w-12 h-12 shrink-0 rounded-xl'
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

                <div className='flex items-center gap-2 md:gap-x-4'>
                    <div className='flex flex-1 md:flex-none items-center gap-2'>
                        {hasYouTube && (
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger
                                        aria-label='Исходник с YouTube не привязан'
                                        className='flex h-11 w-11 items-center justify-center'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <TriangleAlert
                                            size={18}
                                            strokeWidth={1.5}
                                            className='text-onSurfaceVariant'
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className='max-w-[300px] text-center'
                                        side='top'
                                        sideOffset={16}
                                    >
                                        <p>Исходник с YouTube не привязан к треку SmashUp</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <div className='hidden md:block px-2 text-[13px] tabular-nums text-onSurfaceVariant'>
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
                            className='flex-1 md:flex-none'
                            size='sm'
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

                        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant='nothing'
                                    size='sm'
                                    className='flex-1 md:flex-none text-onSurface bg-onSurface/10 hover:bg-onSurface/15'
                                >
                                    Отклонить
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className={CONFIRM_DIALOG.replace('max-w-[400px]', 'max-w-[520px]')}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DialogHeader className='space-y-2'>
                                    <DialogTitle className='p-0 text-xl'>
                                        Отклонить мешап?
                                    </DialogTitle>
                                    <DialogDescription className='p-0 text-sm'>
                                        Причину увидит автор
                                    </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                    placeholder='Причина'
                                    value={rejectionValue}
                                    onChange={(e) => setRejectionValue(e.target.value)}
                                />
                                <DialogFooter className={CONFIRM_FOOTER}>
                                    <Button
                                        variant='nothing'
                                        className={CONFIRM_CANCEL}
                                        onClick={() => setRejectOpen(false)}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant='error'
                                        className='flex-1'
                                        disabled={rejectionValue.trim().length === 0}
                                        onClick={() => rejectMashup()}
                                    >
                                        Отклонить
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Шеврон раскрытия — в самом право; вращается по состоянию */}
                    <ChevronDown
                        className={cn(
                            'h-6 w-6 mx-2.5 shrink-0 text-onSurfaceVariant transition-transform duration-200 motion-reduce:transition-none',
                            isOpen && 'rotate-180'
                        )}
                    />
                </div>
            </div>
            <AccordionContent
                ref={contentRef}
                className='px-2 pt-4 flex flex-col md:flex-row items-center md:items-start gap-6'
            >
                <CoverEdit mashupId={mashup.id} src={imageUrl} alt={mashup.name} />

                {/* Исходникам — больше ширины: в них обложка, два ряда текста и значок источника. */}
                <div className='w-full grid grid-cols-1 md:grid-cols-[1.25fr_1.35fr_0.8fr_1.1fr] gap-6'>
                    {/*название, авторы*/}
                    <div className='flex flex-col gap-y-6 min-w-0'>
                        <div className='flex flex-col gap-y-2'>
                            <span className={FIELD_LABEL}>Название</span>
                            <div className='flex items-center gap-x-1 -my-2.5'>
                                <span className='min-w-0 text-[15px] font-medium text-onSurface [overflow-wrap:anywhere]'>
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

                        <div className='flex flex-col gap-y-2'>
                            <span className={FIELD_LABEL}>Авторы</span>
                            <div className='flex items-center gap-x-1 -my-2.5'>
                                <span className='min-w-0 text-[15px] font-medium text-onSurface [overflow-wrap:anywhere]'>
                                    {mashup.authors?.join(', ')}
                                </span>
                                <CoauthorsDialog mashup={mashup} />
                            </div>
                        </div>
                    </div>

                    {/*Исходники*/}
                    <div className='flex flex-col gap-y-2 min-w-0'>
                        <span className={FIELD_LABEL}>
                            Исходники
                            {tracks && tracks.length > 0 && (
                                <span className='ml-1.5 tabular-nums text-additionalText'>
                                    {tracks.length}
                                </span>
                            )}
                        </span>
                        <div className='-mx-1.5 flex flex-col'>
                            {tracks &&
                                (showAllTracks ? tracks : tracks.slice(0, TRACKS_PREVIEW)).map(
                                    (selectedTrack) => {
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
                                    }
                                )}
                        </div>
                        {tracks && (
                            <div className='flex flex-wrap items-center gap-2'>
                                <AddSourceDialog
                                    current={tracks}
                                    onAdd={(t) =>
                                        saveTracks([...tracks, t], 'при добавлении исходника')
                                    }
                                />
                                {tracks.length > TRACKS_PREVIEW && (
                                    <button
                                        type='button'
                                        className='h-8 px-2 rounded-xl text-[13px] font-medium text-onSurfaceVariant hover:text-onSurface transition-colors motion-reduce:transition-none'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAllTracks((v) => !v);
                                        }}
                                    >
                                        {showAllTracks
                                            ? 'Свернуть'
                                            : `Ещё ${tracks.length - TRACKS_PREVIEW}`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/*Жанры*/}
                    <div className='flex flex-col gap-y-2'>
                        <span className={FIELD_LABEL}>Жанры</span>
                        <div className='flex flex-wrap gap-2'>
                            {mashup.genres?.map((genre) => (
                                <span
                                    key={genre}
                                    className='inline-flex h-8 items-center rounded-xl bg-surface px-3 text-[13px] font-medium text-onSurface first-letter:uppercase'
                                >
                                    {genre}
                                </span>
                            ))}
                            <ModerationGenresDialog mashup={mashup} />
                        </div>
                    </div>

                    {/*Статус*/}
                    <div className='flex flex-col gap-y-2 min-w-0'>
                        <span className={FIELD_LABEL}>Статус</span>
                        <div className='flex flex-col gap-y-2'>
                            <label className='flex items-center gap-x-3 h-11 px-4 rounded-2xl bg-surface cursor-pointer'>
                                <Checkbox
                                    checked={isExplicit(mashup.statuses)}
                                    onClick={toggleExplicit}
                                />
                                <span className='text-[15px] font-medium text-onSurface'>
                                    Explicit (мат)
                                </span>
                            </label>

                            <SegmentedControl
                                aria-label='Основа или альт'
                                tone='neutral'
                                options={STATUS_KIND_OPTIONS}
                                value={statusKindOf(mashup.statuses)}
                                onChange={(kind) => saveKind(kind)}
                            />

                            <div className='flex items-center gap-x-1 min-w-0'>
                                <Button
                                    variant='nothing'
                                    className='flex-1 min-w-0 h-11 justify-start gap-x-3 rounded-2xl bg-surface px-4 text-onSurfaceVariant hover:text-onSurface disabled:opacity-100'
                                    aria-label='Открыть ссылку на основу или альт'
                                    disabled={!statusUrl}
                                    onClick={() => openExternal(statusUrl)}
                                >
                                    {linkKind === 'base' ? (
                                        <HashtagMashupIcon color='onSurfaceVariant' />
                                    ) : linkKind === 'alt' ? (
                                        <AltIcon color='onSurfaceVariant' />
                                    ) : (
                                        <LinkIcon />
                                    )}
                                    <span className='min-w-0 truncate text-[13px] font-medium'>
                                        {statusUrl
                                            ? shortStatusLink(statusUrl)
                                            : 'Ссылка на основу или альт'}
                                    </span>
                                </Button>
                                <EditTextDialog
                                    title='Ссылка на основу или альт'
                                    ariaLabel='Изменить ссылку'
                                    initial={statusUrl ?? ''}
                                    placeholder='https://vk.com/wall-…'
                                    allowEmpty
                                    onSave={saveLink}
                                />
                            </div>
                            {linkKind && statusKindOf(mashup.statuses) !== linkKind && (
                                <span className='px-1 text-[13px] text-onSurfaceVariant'>
                                    По ссылке — {linkKind === 'base' ? 'основа' : 'альт'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
