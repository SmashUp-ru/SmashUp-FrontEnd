import { axiosSession, cn, validateImageDimensions } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { Button } from '@/components/ui/button.tsx';
import { AxiosResponse } from 'axios';
import { RegEx } from '@/lib/regex.ts';
import {
    GenresResponse,
    SelectedTrack,
    UploadMashupRequestBody
} from '@/router/shared/types/upload.ts';
import { User } from '@/store/entities/user.ts';
import {
    isAlt,
    isExplicit,
    setExplicit as setIsExplicit,
    isHashtagMashup,
    isTwitchBanned,
    setTwitchBanned,
    setHashtagMashup,
    setAlt
} from '@/lib/bitmask.ts';
import { useBase64 } from '@/router/shared/hooks/useBase64.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import MashupFormSkeleton from './MashupFormSkeleton.tsx';
import {
    CoauthorsPicker,
    CoverPicker,
    GenrePicker,
    PublishBar,
    StatusCheckbox,
    StatusLinkInput,
    TrackSourcesPicker
} from './MashupFormParts.tsx';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import ExplicitIcon from '@/components/icons/explicit/Explicit24.tsx';
import AltIcon from '@/components/icons/alt/Alt24.tsx';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { coverUrl } from '@/lib/cdn.ts';

interface MashupFormProps {
    initial: MashupFormInitialProps;
    text: MashupFormTextProps;

    handleLoggedUser: boolean;
    handleTracksUrls: boolean;
    handleMashupFile: boolean;
    requireImageFile: boolean;
    showTracksIcons: boolean;
    lockStatusLink: boolean;

    onClick(body: MashupFormBody): Promise<unknown>;
}

interface MashupFormInitialProps {
    name: string;
    originalName?: string;
    explicit?: boolean;
    banWords?: boolean;
    statuses?: number;
    selectedGenres: string[];
    selectedTracks: SelectedTrack[];
    selectedUsers: User[];
    statusLink?: string;
    agree: boolean;
    basedImage?: string;
}

export interface MashupFormBody {
    name: string;
    authors: number[];
    explicit: boolean;
    banWords: boolean;
    statuses: number;
    tracks: number[];
    tracksUrls: string[] | null;
    statusesUrls: string[] | null;
    genres: string[];
    basedMashupFile: string | null;
    basedImageFile: string | null;
}

interface MashupFormTextProps {
    title: string;
    button: string;

    toast: {
        before: string;
        field: string;
        after: string;
    };
}

export default function MashupForm({
    initial,
    text,
    handleLoggedUser,
    handleTracksUrls,
    handleMashupFile,
    requireImageFile,
    showTracksIcons,
    lockStatusLink,
    onClick
}: MashupFormProps) {
    const { toast, dismiss } = useToast();

    const hasStatusLink = initial.statusLink !== undefined;
    const hasExplicit = initial.explicit !== undefined;
    const hasBanWords = initial.banWords !== undefined;
    const hasStatuses = initial.statuses !== undefined;
    const hasOriginalName = initial.originalName !== undefined;

    // Inputs

    const [name, setName] = useState<string>(initial.name);
    const [statusLink, setStatusLink] = useState(initial.statusLink || '');
    const [explicit, setExplicit] = useState(initial.explicit || false);
    const [banWords, setBanWords] = useState(initial.banWords || false);
    const [statuses, setStatuses] = useState(initial.statuses || 0);
    const [agree, setAgree] = useState(initial.agree);

    // Genre selection

    const globalAllGenres = useGlobalStore((state) => state.allGenres);
    const globalUpdateAllGenres = useGlobalStore((state) => state.updateAllGenres);
    const [allGenres, setAllGenres] = useState<string[]>(globalAllGenres || []);
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(
        new Set(initial.selectedGenres)
    );

    useEffect(() => {
        if (allGenres.length === 0) {
            axiosSession.get('/const/genres').then((r: AxiosResponse<GenresResponse>) => {
                setAllGenres(r.data.response);
                globalUpdateAllGenres(r.data.response);
                setLoading(false);
            });
        }
    }, [allGenres.length, globalUpdateAllGenres]);

    // Исходники и авторы — состояние формы; поиск и отрисовка в MashupFormParts

    const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>(initial.selectedTracks);
    const [selectedUsers, setSelectedUsers] = useState<User[]>(initial.selectedUsers);

    // Mashup file handle

    const [mashupFile, setMashupFile] = useState<File | null>(null);
    const [mashupFileProgress, setMashupFileProgress] = useState<number>(0);
    const [basedMashupFile, setBasedMashupFile] = useState<string | null>(null);

    useBase64(
        mashupFile,
        (processed: number, total: number) =>
            setMashupFileProgress(Math.round((processed / total) * 100)),
        setBasedMashupFile
    );

    // Image file handle

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [basedImageFile, setBasedImageFile] = useState<string | null>(initial.basedImage || null);

    useBase64(imageFile, undefined, setBasedImageFile);

    useEffect(() => {
        if (!imageFile) {
            setBasedImageFile(initial.basedImage || null);
        }
    }, [imageFile, initial.basedImage]);

    const imageSrc = useMemo(() => {
        if (!basedImageFile) {
            return null;
        }

        if (basedImageFile.startsWith('http') || basedImageFile.startsWith('blob:')) {
            return basedImageFile;
        } else {
            return `data:image/png;base64,${basedImageFile}`;
        }
    }, [basedImageFile]);

    // Send

    const send = async () => {
        if (handleMashupFile) {
            if (!basedMashupFile || !mashupFile) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке мешапа.'
                            after='Нужен .mp3 с мешапом'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }

            if (mashupFile.size > 20 * 1024 * 1024) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке мешапа.'
                            after='Мешап должен весить не более, чем 20мб.'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }
        }

        const finalBasedImageFile =
            basedImageFile &&
            (basedImageFile.startsWith('http') || basedImageFile.startsWith('blob:'))
                ? null
                : basedImageFile;

        if (requireImageFile) {
            if (!finalBasedImageFile || !imageFile || !imageSrc) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке обложки.'
                            after='Нужна обложка'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }

            const validSize = await validateImageDimensions(imageSrc, 800);
            if (!validSize) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке обложки.'
                            after='Обложка мешапа должна быть размером больше 800px.'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке обложки.'
                            after='Обложка мешапа должна весить не более, чем 5мб.'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }
        }

        if (!RegEx.MASHUP.test(name)) {
            toast({
                element: (
                    <ErrorToast
                        image={imageSrc || undefined}
                        before='Ошибка'
                        field='при загрузке названия.'
                        after='Название может быть длиной от 2 до 48 символов из букв, цифр, некоторых специальных символов.'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        if (selectedGenres.size === 0) {
            toast({
                element: (
                    <ErrorToast
                        image={imageSrc || undefined}
                        before='Ошибка'
                        field='при загрузке жанров.'
                        after='Выбери хотя бы один жанр.'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        if (selectedUsers.length === 0) {
            toast({
                element: (
                    <ErrorToast
                        image={imageSrc || undefined}
                        before='Ошибка'
                        field='при загрузке авторов.'
                        after='Выбери хотя бы одного автора.'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        if (selectedTracks.length < 2) {
            toast({
                element: (
                    <ErrorToast
                        image={imageSrc || undefined}
                        before='Ошибка'
                        field='при загрузке сурсов.'
                        after='Выбери хотя бы два трека.'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        const bodyPart: UploadMashupRequestBody = {
            tracks: [],
            tracksUrls: []
        };

        selectedTracks.forEach((track) => track.addToBody(bodyPart));

        const body: MashupFormBody = {
            name,
            authors: selectedUsers.map((user) => user.id),
            explicit,
            banWords,
            statuses,
            tracks: bodyPart.tracks,
            tracksUrls: bodyPart.tracksUrls,
            // пустую ссылку не шлём: бэк отвечает 400 bad_statuses_urls и на "", и на null
            statusesUrls: hasStatusLink && statusLink.trim() ? [statusLink.trim()] : [],
            genres: [...selectedGenres],
            basedMashupFile: basedMashupFile,
            basedImageFile: finalBasedImageFile
        };

        return onClick(body);
    };

    //

    const [loading, setLoading] = useState(allGenres.length === 0);
    const [sending, setSending] = useState(false);

    if (loading) return <MashupFormSkeleton />;

    return (
        <section className='flex flex-col gap-y-6 md:pr-[35px] h-full'>
            {text.title && (
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold text-[28px] text-onSurface'>{text.title}</h1>
                </div>
            )}
            <div className='w-full flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-12 flex-1'>
                {/*картинка*/}
                <CoverPicker
                    src={imageSrc}
                    alt='Обложка загружаемого мешапа'
                    onFile={(file) => {
                        if (file) setImageFile(file);
                        else if (initial.basedImage !== undefined) setImageFile(null);
                    }}
                />

                <div className='w-full flex flex-col flex-1'>
                    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-y-[35px] md:gap-y-0 gap-x-10 flex-grow'>
                        {/*использованные треки*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <TrackSourcesPicker
                                selectedTracks={selectedTracks}
                                setSelectedTracks={setSelectedTracks}
                                handleTracksUrls={handleTracksUrls}
                                showTracksIcons={showTracksIcons}
                            />
                        </div>

                        {/*название, mp3, ссылка, жанр*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мешапа
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Название мешапа'
                                />
                            </div>

                            {hasOriginalName && (
                                <div className='flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Оригинальное название
                                    </Label>
                                    {initial.originalName}
                                </div>
                            )}

                            {handleMashupFile && (
                                <div className='flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Файл мешапа (.mp3)
                                    </Label>

                                    <label className='relative'>
                                        <span className='text-[15px] font-medium text-primary cursor-pointer hover:underline underline-offset-4'>
                                            {mashupFile === null || mashupFile === undefined
                                                ? 'Выбрать файл'
                                                : mashupFile.name}
                                        </span>
                                        <Input
                                            type='file'
                                            className='hidden'
                                            accept='.mp3'
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setMashupFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </label>

                                    {mashupFileProgress > 0 && (
                                        <div
                                            className='h-1 bg-primary rounded'
                                            style={{ width: `${mashupFileProgress}%` }}
                                        />
                                    )}
                                </div>
                            )}

                            {hasStatusLink &&
                                (!lockStatusLink ? (
                                    <StatusLinkInput value={statusLink} onChange={setStatusLink} />
                                ) : (
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='cursor-pointer'
                                        onClick={() => {
                                            if (statusLink) {
                                                navigator.clipboard
                                                    .writeText(statusLink)
                                                    .then(() => {
                                                        toast({
                                                            element: (
                                                                <CopiedToast
                                                                    img={coverUrl(
                                                                        'mashup',
                                                                        'default',
                                                                        100
                                                                    )}
                                                                    name={'undefined'}
                                                                />
                                                            ),
                                                            duration: 2000
                                                        });
                                                    });
                                            }
                                        }}
                                    >
                                        <div className='w-full bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center gap-x-4'>
                                            <LinkIcon />
                                            <span className='font-medium text-onSurfaceVariant'>
                                                {statusLink || 'Ссылка на основу / альт'}
                                            </span>
                                        </div>
                                    </Button>
                                ))}

                            <GenrePicker
                                allGenres={allGenres}
                                selected={selectedGenres}
                                onChange={setSelectedGenres}
                            />
                        </div>

                        {/*авторы, статусы*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <CoauthorsPicker
                                selectedUsers={selectedUsers}
                                setSelectedUsers={setSelectedUsers}
                                handleLoggedUser={handleLoggedUser}
                            />

                            <div className='flex flex-col gap-y-2.5'>
                                {hasExplicit && (
                                    <StatusCheckbox
                                        label='Explicit (Мат)'
                                        checked={explicit}
                                        onChange={setExplicit}
                                    />
                                )}

                                {hasBanWords && (
                                    <StatusCheckbox
                                        label='Бан-ворды Twitch'
                                        checked={banWords}
                                        onChange={setBanWords}
                                    />
                                )}

                                {hasStatuses && (
                                    <div className='flex flex-col gap-y-2.5'>
                                        <Label className='font-medium text-onSurfaceVariant'>
                                            Выбери статусы
                                        </Label>
                                        <div className='grid grid-cols-4 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                            <div
                                                className={cn(
                                                    'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                    isExplicit(statuses)
                                                        ? 'bg-badge text-primary'
                                                        : ''
                                                )}
                                                onClick={() =>
                                                    setStatuses(
                                                        setIsExplicit(
                                                            statuses,
                                                            !isExplicit(statuses)
                                                        )
                                                    )
                                                }
                                            >
                                                <ExplicitIcon />
                                            </div>

                                            <div
                                                className={cn(
                                                    'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                    isTwitchBanned(statuses)
                                                        ? 'bg-badge text-primary'
                                                        : ''
                                                )}
                                                onClick={() =>
                                                    setStatuses(
                                                        setTwitchBanned(
                                                            statuses,
                                                            !isTwitchBanned(statuses)
                                                        )
                                                    )
                                                }
                                            >
                                                B
                                            </div>

                                            <div
                                                className={cn(
                                                    'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                    isHashtagMashup(statuses)
                                                        ? 'bg-badge text-primary'
                                                        : ''
                                                )}
                                                onClick={() =>
                                                    setStatuses(
                                                        setHashtagMashup(
                                                            statuses,
                                                            !isHashtagMashup(statuses)
                                                        )
                                                    )
                                                }
                                            >
                                                <HashtagMashupIcon />
                                            </div>

                                            <div
                                                className={cn(
                                                    'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                    isAlt(statuses) ? 'bg-badge text-primary' : ''
                                                )}
                                                onClick={() =>
                                                    setStatuses(setAlt(statuses, !isAlt(statuses)))
                                                }
                                            >
                                                <AltIcon />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    <PublishBar
                        button={text.button}
                        disabled={sending}
                        agree={agree}
                        setAgree={setAgree}
                        showAgree={!initial.agree}
                        onClick={() => {
                            toast({
                                element: (
                                    <BaseToast
                                        icon
                                        before='Твой'
                                        field='мешап'
                                        after='загружается...'
                                    />
                                ),
                                duration: 60000
                            });

                            setSending(true);

                            const promise = send();
                            if (promise) {
                                // ошибку уже показал axiosCatcher тостом; без catch она
                                // всплывала бы в консоль как необработанная
                                promise
                                    .catch(() => undefined)
                                    .finally(() => {
                                        dismiss();
                                        setSending(false);
                                    });
                            } else {
                                setSending(false);
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
