/**
 * Блоки формы загрузки мешапа. Вынесены из MashupForm без изменения вида и логики,
 * чтобы загрузка альбома собиралась из тех же элементов, а не из своих копий.
 */
import {
    Dispatch,
    Fragment,
    ReactNode,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { X } from 'lucide-react';
import { AxiosResponse } from 'axios';
import { axiosSession, cn, convertToBase64, removeItem } from '@/lib/utils.ts';
import CoverCropDialog, { CropFrame } from '@/router/shared/components/image/CoverCropDialog.tsx';
import { isModerator } from '@/lib/bitmask.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { User } from '@/store/entities/user.ts';
import { useGlobalStore } from '@/store/global.ts';
import EditIcon from '@/components/icons/edit/Edit32.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import YouTubeIcon from '@/components/icons/YouTube.tsx';
import YandexMusicIcon from '@/components/icons/YandexMusic.tsx';
import SpotifyIcon from '@/components/icons/Spotify.tsx';
import { SmashUpIcon } from '@/components/icons/SmashUp.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import TrackSmallThumbSkeleton from '@/router/shared/components/track/TrackSmallThumbSkeleton.tsx';
import YouTubeTrackSmallThumb from '@/router/shared/components/track/YouTubeTrackSmallThumb.tsx';
import { useTrackSearch } from '@/router/shared/hooks/useTrackSearch.ts';
import { useFlip } from '@/router/shared/hooks/useFlip.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { UsersSearchResponse } from '@/router/shared/types/search.ts';
import {
    areTracksEqual,
    areUsersEqual,
    isTrackSelected,
    isUserSelected,
    RenderTrack,
    RenderUser,
    SearchTrack,
    SelectedTrack,
    SmashUpSelectedTrack,
    SpotifySelectedTrack,
    TrackType,
    YandexMusicSelectedTrack
} from '@/router/shared/types/upload.ts';

/** Подпись поля — одна на всю форму загрузки. */
export const FORM_LABEL = 'font-medium text-onSurfaceVariant';

/** Подпись + поле с отступом формы загрузки. */
export function FormField({ label, children }: { label: ReactNode; children: ReactNode }) {
    return (
        <div className='flex flex-col gap-y-2.5'>
            <Label className={FORM_LABEL}>{label}</Label>
            {children}
        </div>
    );
}

// ---------- Обложка ----------

export function CoverPicker({
    src,
    alt,
    disabled,
    onFile,
    hintAside
}: {
    src: string | null;
    alt: string;
    disabled?: boolean;
    onFile: (file: File | null) => void;
    /** Подсказка про формат справа от обложки, а не под ней. */
    hintAside?: boolean;
}) {
    const [cropSrc, setCropSrc] = useState<string | null>(null);
    // исходник и кадр прошлого раза: «Изменить кадр» без повторного выбора файла
    const [last, setLast] = useState<{ src: string; frame: CropFrame } | null>(null);
    return (
        <div
            className={cn(
                'flex gap-2.5',
                hintAside ? 'flex-row items-end gap-x-5' : 'flex-col items-center md:items-start'
            )}
        >
            <label className={cn('relative h-fit', disabled ? 'cursor-default' : 'cursor-pointer')}>
                {src ? (
                    <img
                        src={src}
                        className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-[30px] brightness-50'
                        draggable={false}
                        alt={alt}
                    />
                ) : (
                    <div className='w-[200px] h-[200px] rounded-[30px] bg-surfaceVariant' />
                )}
                {!disabled && (
                    <EditIcon
                        size={70}
                        className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                        color='onSurface'
                    />
                )}
                <Input
                    type='file'
                    className='hidden'
                    accept='.png,.jpg,.jpeg'
                    disabled={disabled}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = ''; // тот же файл можно выбрать снова
                        if (file) setCropSrc(String(await convertToBase64(file)));
                    }}
                />
            </label>

            {/* сначала кадр, потом наружу уходит уже обрезанный квадрат */}
            <CoverCropDialog
                src={cropSrc}
                initialFrame={cropSrc === last?.src ? last.frame : undefined}
                onCancel={() => setCropSrc(null)}
                onDone={async (url, frame) => {
                    if (cropSrc && frame) setLast({ src: cropSrc, frame });
                    setCropSrc(null);
                    const blob = await (await fetch(url)).blob();
                    onFile(new File([blob], 'cover', { type: blob.type }));
                }}
            />

            <div className='flex max-w-[200px] flex-col items-start gap-y-2 text-onSurfaceVariant'>
                <span>
                    Обложка должна быть в формате <b>.png</b> или <b>.jpg</b> и быть равной или
                    больше <b>800x800px</b>
                </span>
                {last && !disabled && (
                    <Button
                        type='button'
                        variant='nothing'
                        size='sm'
                        className='px-0 text-primary hover:text-onSurface'
                        onClick={() => setCropSrc(last.src)}
                    >
                        Изменить кадр
                    </Button>
                )}
            </div>
        </div>
    );
}

// ---------- Исходники ----------

function calculateSelectedTracksKeys(selectedTracks: SelectedTrack[]) {
    const selectedTracksKeys = new Map<TrackType, Set<unknown>>();
    for (const selectedTrack of selectedTracks) {
        let keys = selectedTracksKeys.get(selectedTrack.keyType);
        if (keys === undefined) {
            keys = new Set();
            selectedTracksKeys.set(selectedTrack.keyType, keys);
        }

        keys.add(selectedTrack.key);
    }
    return selectedTracksKeys;
}

function calculateNonSelectedTracks(
    tracks: SearchTrack[],
    selectedTracks: SelectedTrack[]
): SearchTrack[] {
    const selectedTracksKeys = calculateSelectedTracksKeys(selectedTracks);
    return tracks.filter((track) => {
        const keys = selectedTracksKeys.get(track.keyType);
        return keys === undefined || keys === null || !keys.has(track.key);
    });
}

function iconOf(type: TrackType) {
    if (type === TrackType.SmashUp) return <SmashUpIcon />;
    if (type === TrackType.YouTube) return <YouTubeIcon />;
    if (type === TrackType.YandexMusic) return <YandexMusicIcon />;
    if (type === TrackType.Spotify) return <SpotifyIcon />;
    return undefined;
}

/**
 * «Добавь использованные треки»: поиск по SmashUp, Яндекс Музыке, Spotify и ссылке YouTube,
 * выбранные — сверху, по два лучших результата из каждого источника.
 * Выбранные хранит вызывающий (значение + React-сеттер). Чтобы сбросить поиск, перемонтируйте по key.
 */
export function TrackSourcesPicker({
    selectedTracks,
    setSelectedTracks,
    handleTracksUrls,
    showTracksIcons,
    disabled
}: {
    selectedTracks: SelectedTrack[];
    setSelectedTracks: Dispatch<SetStateAction<SelectedTrack[]>>;
    handleTracksUrls: boolean;
    showTracksIcons: boolean;
    disabled?: boolean;
}) {
    const [tracksQuery, setTracksQuery] = useState<string>('');
    const [debouncedTracksQuery] = useDebounce(tracksQuery, 500);

    const { tracks, tracksLoading, youTubeTrack, youTubeTrackLoading } = useTrackSearch(
        debouncedTracksQuery,
        handleTracksUrls
    );

    const initialSelectedTracksRef = useRef(selectedTracks);

    const [renderTracks, setRenderTracks] = useState<RenderTrack[]>([]);
    const [startSelectedTracksLength, setStartSelectedTracksLength] = useState<number>(0);
    const [renderTracksNodes, setRenderTracksNodes] = useState<ReactNode[]>([]);
    const [showMoreCategories, setShowMoreCategories] = useState<TrackType[]>([]);

    const trackStatefulOnClick = useCallback(
        (track: SelectedTrack, currentSelectedTracks: SelectedTrack[]) => {
            if (isTrackSelected(track, currentSelectedTracks)) {
                setSelectedTracks(removeItem(currentSelectedTracks, track, areTracksEqual));
            } else {
                setSelectedTracks(currentSelectedTracks.concat([track]));
            }
        },
        [setSelectedTracks]
    );

    const renderSelectedTracks = useCallback(
        (selectedTracks: SelectedTrack[]): RenderTrack[] => {
            return selectedTracks.map((track) => {
                const icon = iconOf(track.keyType);
                if (!icon) throw new Error(`${track.constructor.name} not supported`);

                return {
                    keyType: track.keyType,
                    key: track.key,
                    icon: icon,
                    track: track.track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        trackStatefulOnClick(track, selectedTracks)
                };
            });
        },
        [trackStatefulOnClick]
    );

    useEffect(() => {
        setRenderTracks(renderSelectedTracks(initialSelectedTracksRef.current));
    }, [renderSelectedTracks]);

    useEffect(() => {
        const nonSelectedTracks = calculateNonSelectedTracks(tracks, selectedTracks);

        const renderTracks = nonSelectedTracks.map((track) => {
            return {
                key: track.key,
                keyType: track.keyType,
                icon: iconOf(track.keyType),
                track: track.track,
                selected: false,
                statefulOnClick: (selectedTracks: SelectedTrack[]) => {
                    if (track.keyType === TrackType.SmashUp) {
                        trackStatefulOnClick(new SmashUpSelectedTrack(track.track), selectedTracks);
                    } else if (track.keyType === TrackType.YandexMusic) {
                        trackStatefulOnClick(
                            new YandexMusicSelectedTrack(track.track),
                            selectedTracks
                        );
                    } else if (track.keyType === TrackType.Spotify) {
                        trackStatefulOnClick(new SpotifySelectedTrack(track.track), selectedTracks);
                    } else {
                        throw new Error(`${track.constructor.name} not supported`);
                    }
                }
            };
        });

        setRenderTracks(renderSelectedTracks(selectedTracks).concat(renderTracks));
        setShowMoreCategories([]);
        setStartSelectedTracksLength(selectedTracks.length);
    }, [renderSelectedTracks, selectedTracks, trackStatefulOnClick, tracks]);

    useEffect(() => {
        const selectedTracksKeys = calculateSelectedTracksKeys(selectedTracks);
        setRenderTracks((currentRenderTracks) =>
            currentRenderTracks.map((renderTrack) => {
                const keys = selectedTracksKeys.get(renderTrack.keyType);
                const selected = keys !== undefined && keys !== null && keys.has(renderTrack.key);

                return {
                    ...renderTrack,
                    selected: selected
                };
            })
        );
    }, [selectedTracks]);

    useEffect(() => {
        const renderTracksNodes: ReactNode[] = [];

        const renderedAmount: Map<TrackType, number> = new Map();

        let index = -1;
        for (const renderTrack of renderTracks) {
            index++;

            const keyType = renderTracks[index].keyType;
            const showLess = showMoreCategories.indexOf(keyType) < 0;
            if (
                index === startSelectedTracksLength ||
                (index > startSelectedTracksLength && renderTracks[index - 1].keyType !== keyType)
            ) {
                let name;
                if (keyType === TrackType.SmashUp) {
                    name = 'SmashUp';
                } else if (keyType === TrackType.YandexMusic) {
                    name = 'Яндекс.Музыке';
                } else if (keyType === TrackType.Spotify) {
                    name = 'Spotify';
                } else {
                    name = keyType.toString();
                }

                renderTracksNodes.push(
                    <div
                        key={`head-${keyType}-${index}`}
                        className='flex flex-row items-center justify-between text-onSurfaceVariant mt-1'
                    >
                        <div className='flex flex-row items-center gap-1'>
                            {renderTrack.icon}
                            <Label>
                                Лучшие результаты в <span className='font-medium'>{name}</span>
                            </Label>
                        </div>

                        <Label
                            className='font-medium mr-1 cursor-pointer'
                            onClick={() => {
                                if (showLess) {
                                    setShowMoreCategories(showMoreCategories.concat([keyType]));
                                } else {
                                    setShowMoreCategories(removeItem(showMoreCategories, keyType));
                                }
                            }}
                        >
                            {showLess ? 'Показать ещё' : 'Свернуть'}
                        </Label>
                    </div>
                );
            }

            if (index >= startSelectedTracksLength && showLess) {
                let rendered = renderedAmount.get(keyType);
                if (rendered === undefined) {
                    rendered = 0;
                }
                if (rendered < 2) {
                    renderedAmount.set(keyType, rendered + 1);
                } else {
                    continue;
                }
            }

            renderTracksNodes.push(
                <TrackSmallThumb
                    key={`${keyType}-${String(renderTrack.key)}`}
                    track={renderTrack.track}
                    selected={renderTrack.selected}
                    icon={
                        showTracksIcons && keyType !== TrackType.SmashUp
                            ? renderTrack.icon
                            : undefined
                    }
                    onClick={() => renderTrack.statefulOnClick(selectedTracks)}
                />
            );
        }

        setRenderTracksNodes(renderTracksNodes);
    }, [
        renderTracks,
        selectedTracks,
        showMoreCategories,
        showTracksIcons,
        startSelectedTracksLength
    ]);

    return (
        <div
            className={cn('flex flex-col gap-y-2.5', disabled && 'pointer-events-none opacity-60')}
        >
            <Label className={FORM_LABEL}>Добавь использованные треки</Label>
            <Input
                placeholder='Название трека'
                startIcon={SearchIcon}
                value={tracksQuery}
                onChange={(e) => setTracksQuery(e.target.value)}
                disabled={disabled}
            />

            <div className='flex flex-col gap-y-2.5 max-h-[470px] overflow-y-scroll'>
                <div className='font-medium text-onSurfaceVariant flex flex-row items-center gap-1'>
                    <YouTubeIcon />
                    <Label>Для трека с YouTube вставь ссылку в поиск</Label>
                </div>

                <YouTubeTrackSmallThumb
                    track={youTubeTrack}
                    loading={youTubeTrackLoading}
                    selectedTracks={selectedTracks}
                    setSelectedTracks={setSelectedTracks}
                    renderTracks={renderTracks}
                />

                {renderTracksNodes}

                {tracksLoading &&
                    Array.from({ length: 5 }, (_, i) => <TrackSmallThumbSkeleton key={i} />)}
            </div>
        </div>
    );
}

// ---------- Название, ссылка, жанры ----------

export function StatusLinkInput({
    value,
    onChange,
    disabled
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <Input
            startIcon={LinkIcon}
            startIconClassName='text-onSurfaceVariant'
            placeholder='Ссылка на основу / альт (Если есть)'
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export function GenrePicker({
    allGenres,
    selected,
    onChange,
    disabled
}: {
    allGenres: string[];
    /** Жанры строчными — как их хранит бэк. */
    selected: Set<string>;
    onChange: (genres: Set<string>) => void;
    disabled?: boolean;
}) {
    return (
        <FormField label='Выбери жанр'>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-2.5 gap-y-3 max-h-[189px] overflow-y-scroll'>
                {allGenres.map((genre) => {
                    const isSelected = selected.has(genre.toLowerCase());

                    return (
                        <Button
                            key={genre}
                            type='button'
                            variant='nothing'
                            aria-pressed={isSelected}
                            disabled={disabled}
                            className={cn(
                                'h-[54px] rounded-2xl [transition-duration:200ms] disabled:opacity-100',
                                isSelected
                                    ? 'bg-badge text-primary hover:bg-primary/[0.3]'
                                    : 'bg-surfaceVariant text-onSurface hover:bg-onPrimary'
                            )}
                            onClick={() => {
                                const next = new Set(selected);
                                if (isSelected) next.delete(genre.toLowerCase());
                                else next.add(genre.toLowerCase());
                                onChange(next);
                            }}
                        >
                            {genre}
                        </Button>
                    );
                })}
            </div>
        </FormField>
    );
}

// ---------- Авторы ----------

/**
 * Появление (tailwindcss-animate). Длительность — арбитрарным animation-duration,
 * а не duration-*: тот поставил бы и transition-duration строки.
 */
const APPEAR =
    'animate-in fade-in-0 zoom-in-95 [animation-duration:240ms] motion-reduce:animate-none';

function calculateNonSelectedUsers(users: User[], selectedUsers: User[]): User[] {
    const selectedUsersSet = new Set<number>(selectedUsers.map((user) => user.id));
    return users.filter((user) => !selectedUsersSet.has(user.id));
}

/** «Авторы» + «Добавь соавторов»: выбранные подсвечены сверху, себя убрать нельзя. */
export function CoauthorsPicker({
    selectedUsers,
    setSelectedUsers,
    handleLoggedUser,
    searchLabel = 'Добавь соавторов мешапа',
    disabled
}: {
    selectedUsers: User[];
    setSelectedUsers: Dispatch<SetStateAction<User[]>>;
    /** Подставить текущего пользователя в авторы. */
    handleLoggedUser: boolean;
    searchLabel?: string;
    disabled?: boolean;
}) {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [renderUsers, setRenderUsers] = useState<RenderUser[]>([]);
    const [usersQuery, setUsersQuery] = useState<string>('');
    const [debouncedUserQuery] = useDebounce(usersQuery, 500);

    const loggedUser = useGlobalStore((state) => state.currentUser);
    // снятый крестиком соавтор сначала гаснет, потом уходит из списка; остальные доезжают
    const [leavingId, setLeavingId] = useState<number | null>(null);
    const flipRef = useFlip(renderUsers);

    const authorsRef = useRef<HTMLDivElement>(null);
    const [authorsHeight, setAuthorsHeight] = useState<number>();
    useEffect(() => {
        const el = authorsRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setAuthorsHeight(el.offsetHeight));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const userStatefulOnClick = useCallback(
        (user: User, currentSelectedUsers: User[]) => {
            if (isUserSelected(user, currentSelectedUsers)) {
                setSelectedUsers(removeItem(currentSelectedUsers, user, areUsersEqual));
            } else {
                setSelectedUsers(currentSelectedUsers.concat([user]));
            }
        },
        [setSelectedUsers]
    );

    // себя убрать нельзя (кроме модератора): иначе мешап ушёл бы без публикатора
    const canRemove = (user: User) =>
        !(loggedUser && loggedUser.id === user.id && !isModerator(loggedUser.permissions));

    const toggleUser = (user: User) => {
        if (isUserSelected(user, selectedUsers) && !canRemove(user)) {
            toast({
                element: (
                    <ErrorToast
                        icon
                        before='Ошибка в поле'
                        field='авторов.'
                        after='Себя из авторов убрать нельзя'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }
        userStatefulOnClick(user, selectedUsers);
    };

    useEffect(() => {
        if (debouncedUserQuery.length >= 2 && debouncedUserQuery.length <= 32) {
            axiosSession
                .get(`/user/search?query=${debouncedUserQuery}`)
                .then((r: AxiosResponse<UsersSearchResponse>) => setUsers(r.data.response));
        } else {
            setUsers([]);
        }
    }, [debouncedUserQuery]);

    useEffect(() => {
        const nonSelectedUsers = calculateNonSelectedUsers(users, selectedUsers);
        const toRender = (selected: boolean) => (user: User) => ({
            user: user,
            selected,
            statefulOnClick: (selectedUsers: User[]) => userStatefulOnClick(user, selectedUsers)
        });
        setRenderUsers(
            selectedUsers.map(toRender(true)).concat(nonSelectedUsers.map(toRender(false)))
        );
    }, [selectedUsers, userStatefulOnClick, users]);

    useEffect(() => {
        if (handleLoggedUser && loggedUser) {
            setSelectedUsers((currentSelectedUsers) =>
                isUserSelected(loggedUser, currentSelectedUsers)
                    ? currentSelectedUsers
                    : currentSelectedUsers.concat([loggedUser])
            );
        }
    }, [handleLoggedUser, loggedUser, setSelectedUsers]);

    return (
        <>
            <div className='w-full flex flex-col gap-y-2.5'>
                <Label className={FORM_LABEL}>Авторы</Label>
                {/* высота строки авторов анимируется: блок ниже не прыгает при переносе */}
                <div
                    style={{ height: authorsHeight }}
                    className='overflow-hidden transition-[height] [transition-duration:240ms] ease-spring motion-reduce:transition-none'
                >
                    <div ref={authorsRef} className='font-semibold text-xl text-onSurfaceVariant'>
                        {selectedUsers.map((user, i) => (
                            // новый автор проявляется, а не выскакивает
                            <Fragment key={user.id}>
                                {/* inline-block: иначе zoom не действует на строчный элемент */}
                                <span className={cn('inline-block', APPEAR)}>{user.username}</span>
                                {i < selectedUsers.length - 1 && ', '}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {!disabled && (
                <div className='flex flex-col gap-y-2.5'>
                    <Label className={FORM_LABEL}>{searchLabel}</Label>

                    <Input
                        placeholder='Ник мешапера'
                        startIcon={SearchIcon}
                        value={usersQuery}
                        onChange={(e) => setUsersQuery(e.target.value)}
                    />

                    <div className='flex flex-col gap-y-2.5 max-h-[200px] overflow-y-scroll'>
                        {renderUsers.map((renderUser) => {
                            const user = renderUser.user;
                            const selected = isUserSelected(user, selectedUsers);

                            return (
                                <div
                                    key={user.id}
                                    ref={flipRef(String(user.id))}
                                    className={cn(
                                        'flex items-center gap-x-4 rounded-2xl p-[6px] mr-[7px] cursor-pointer transition-[background-color,transform,opacity,scale] [transition-duration:240ms] ease-spring motion-reduce:transition-none',
                                        APPEAR,
                                        leavingId === user.id && 'opacity-0 scale-95',
                                        selected
                                            ? 'bg-badge'
                                            : 'hover:bg-onPrimary has-[[aria-expanded=true]]:bg-onPrimary'
                                    )}
                                    onClick={() => toggleUser(user)}
                                >
                                    <img
                                        src={coverUrl('user', user.imageUrl, 100)}
                                        alt={user.username}
                                        className='w-12 h-12 rounded-xl object-cover'
                                        draggable={false}
                                    />
                                    <span
                                        className={cn(
                                            'font-medium',
                                            selected ? 'text-primary' : 'text-onSurface'
                                        )}
                                    >
                                        {user.username}
                                    </span>
                                    {selected && canRemove(user) && (
                                        <Button
                                            variant='ghost'
                                            size='control'
                                            className='ml-auto'
                                            aria-label={`Убрать ${user.username} из авторов`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (leavingId !== null) return;
                                                setLeavingId(user.id);
                                                const ms = window.matchMedia(
                                                    '(prefers-reduced-motion: reduce)'
                                                ).matches
                                                    ? 0
                                                    : 200;
                                                setTimeout(() => {
                                                    toggleUser(user);
                                                    setLeavingId(null);
                                                }, ms);
                                            }}
                                        >
                                            <X size={18} strokeWidth={1.5} />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

// ---------- Explicit / бан-ворды ----------

export function StatusCheckbox({
    label,
    checked,
    onChange,
    disabled
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
            <Checkbox
                checked={checked}
                disabled={disabled}
                onCheckedChange={(v) => {
                    if (typeof v === 'boolean') onChange(v);
                }}
            />
            <Label className='font-medium text-[15px] text-onSurface'>{label}</Label>
        </div>
    );
}

// ---------- Отправка ----------

/** Нижняя плашка: кнопка отправки и согласие с пользовательским соглашением. */
export function PublishBar({
    button,
    disabled,
    onClick,
    agree,
    setAgree,
    showAgree
}: {
    button: ReactNode;
    disabled: boolean;
    onClick: () => void;
    agree: boolean;
    setAgree: (v: boolean) => void;
    showAgree: boolean;
}) {
    return (
        <div className='bg-surfaceVariant p-5 w-full md:w-fit rounded-[30px] flex flex-col md:flex-row items-stretch md:items-center gap-y-4 md:gap-y-0 md:gap-x-6'>
            <Button className='w-full md:w-[460px]' onClick={onClick} disabled={!agree || disabled}>
                {button}
            </Button>
            {showAgree && (
                <div className='flex items-center gap-x-4'>
                    <Checkbox
                        checked={agree}
                        onCheckedChange={(v) => {
                            if (typeof v === 'boolean') setAgree(v);
                        }}
                    />
                    <span>
                        Я прочитал(-а) и согласен(-на) с условиями{' '}
                        <Link className='text-primary' to='/user_agreement' draggable={false}>
                            пользовательского соглашения
                        </Link>
                    </span>
                </div>
            )}
        </div>
    );
}
