import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { GripVertical, Music, Plus, TriangleAlert, X } from 'lucide-react';
import {
    axiosSession,
    cn,
    convertToBase64,
    declOfNum,
    validateImageDimensions
} from '@/lib/utils.ts';
import { isAdmin, isMashuper, isVerified } from '@/lib/bitmask.ts';
import { useGlobalStore } from '@/store/global.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import { User } from '@/store/entities/user.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import {
    CoauthorsPicker,
    CoverPicker,
    FORM_LABEL,
    FormField,
    GenrePicker,
    PublishBar,
    StatusCheckbox,
    StatusLinkInput,
    TrackSourcesPicker
} from '@/router/shared/components/mashup/MashupFormParts.tsx';
import {
    GenresResponse,
    SelectedTrack,
    UploadMashupRequestBody
} from '@/router/shared/types/upload.ts';
import { SmashUpResponse } from '@/router/shared/types/smashup.ts';
import { StateView } from '@/router/shared/components/StateView.tsx';
import Hint from '@/router/shared/components/Hint.tsx';
import { useFlip } from '@/router/shared/hooks/useFlip.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';

const MAX_MP3 = 20 * 1024 * 1024;

type TrackState = 'idle' | 'uploading' | 'published' | 'moderation' | 'error';

/** Мешап альбома: жанры, исходники, статусы и ссылка — у каждого свои. */
interface AlbumTrack {
    key: string;
    file: File;
    name: string;
    genres: string[];
    sources: SelectedTrack[];
    explicit: boolean;
    banWords: boolean;
    statusLink: string;
    state: TrackState;
}

const STATE_TEXT: Record<TrackState, string> = {
    idle: '',
    uploading: 'Загружается',
    published: 'Опубликован',
    moderation: 'На модерации',
    error: 'Ошибка'
};

const sent = (t: AlbumTrack) => t.state === 'published' || t.state === 'moderation';
const ready = (t: AlbumTrack) =>
    t.name.trim() !== '' && t.genres.length > 0 && t.sources.length >= 2;

/** «03. Название.mp3» → «Название». */
const nameFromFile = (file: File) =>
    file.name
        .replace(/\.mp3$/i, '')
        .replace(/^\d+[\s.\-_)]+/, '')
        .trim()
        .slice(0, 64);

/** Чистый base64 без префикса data-URL — так его ждёт бэк. */
const toBase64 = async (file: File) => {
    const url = String(await convertToBase64(file));
    return url.slice(url.indexOf('base64,') + 'base64,'.length);
};

/**
 * Загрузка альбома из тех же блоков, что форма мешапа (MashupFormParts).
 * Альбом создаётся первым (`/playlist/create?type=ALBUM`), затем мешапы уходят по одному
 * обычным `/mashup/upload` с `albumId` и `albumPosition`. Мешапы альбома не идут в лимит
 * загрузок; альбом виден другим, когда одобрены все.
 *
 * Три колонки: альбом (обложка, название, авторы, описание) → список мешапов →
 * свойства выбранного мешапа (жанры, исходники, статусы, ссылка на пост).
 */
export default function UploadAlbumPage() {
    useDocumentTitle('Загрузка альбома');
    const { toast } = useToast();

    const currentUser = useGlobalStore((s) => s.currentUser);
    const allGenres = useGlobalStore((s) => s.allGenres);
    const updateAllGenres = useGlobalStore((s) => s.updateAllGenres);

    useEffect(() => {
        if (!allGenres) {
            axiosSession
                .get('/const/genres')
                .then((r: AxiosResponse<GenresResponse>) => updateAllGenres(r.data.response));
        }
    }, [allGenres, updateAllGenres]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState<string | null>(null);
    const [coverSrc, setCoverSrc] = useState<string | null>(null);
    const [authors, setAuthors] = useState<User[]>([]);
    const [agree, setAgree] = useState(false);

    const [tracks, setTracks] = useState<AlbumTrack[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    // перетаскивание строки списка; файлы с диска идут через dragOver зоны
    const [dragKey, setDragKey] = useState<string | null>(null);
    const [leavingKey, setLeavingKey] = useState<string | null>(null);

    const [albumId, setAlbumId] = useState<number | null>(null);
    const [sending, setSending] = useState(false);

    // вместо подсказки «не закрывай вкладку»: пока мешапы уходят, браузер переспросит
    useEffect(() => {
        if (!sending) return;
        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [sending]);

    const patch = useCallback(
        (key: string, part: Partial<AlbumTrack>) =>
            setTracks((ts) => ts.map((t) => (t.key === key ? { ...t, ...part } : t))),
        []
    );

    // Сеттер исходников выбранного мешапа в форме React-сеттера: так TrackSourcesPicker
    // работает с ним так же, как с useState в форме мешапа. Стабилен, пока не сменился мешап.
    const setSelectedSources: Dispatch<SetStateAction<SelectedTrack[]>> = useCallback(
        (action) =>
            setTracks((ts) =>
                ts.map((t) =>
                    t.key === selectedKey
                        ? {
                              ...t,
                              sources: typeof action === 'function' ? action(t.sources) : action
                          }
                        : t
                )
            ),
        [selectedKey]
    );

    const selected = useMemo(
        () => tracks.find((t) => t.key === selectedKey) ?? null,
        [tracks, selectedKey]
    );

    // строки, сменившие место, доезжают пружиной, а не прыгают
    const flipRef = useFlip(tracks);

    if (!currentUser) return null;

    const p = currentUser.permissions;
    if (!isVerified(p) && !isMashuper(p) && !isAdmin(p)) {
        return (
            <StateView
                title='Альбомы пока для мешаперов'
                description='Загружать альбомы могут мешаперы и верифицированные авторы'
            />
        );
    }

    const error = (field: string, after: string) =>
        toast({
            element: <ErrorToast icon before='Ошибка' field={field} after={after} />,
            duration: 3000,
            variant: 'destructive'
        });

    const pickCover = async (file: File | null) => {
        if (!file) return;
        const url = String(await convertToBase64(file));
        if (!(await validateImageDimensions(url, 800))) {
            error('в обложке.', 'Нужна картинка от 800×800');
            return;
        }
        setCoverSrc(url);
        setCover(url.slice(url.indexOf('base64,') + 'base64,'.length));
    };

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const all = [...files];
        const mp3 = all.filter((f) => f.type === 'audio/mpeg' || /\.mp3$/i.test(f.name));
        const fit = mp3.filter((f) => f.size <= MAX_MP3);
        // проверяем сразу при выборе, а не при публикации
        if (mp3.length < all.length) error('в файлах.', 'Подходят только .mp3');
        if (fit.length < mp3.length) error('в файлах.', 'Файл больше 20 МБ');
        const added = fit.map((file) => ({
            key: `${file.name}-${file.size}-${Math.random()}`,
            file,
            name: nameFromFile(file),
            genres: [],
            sources: [],
            explicit: false,
            banWords: false,
            statusLink: '',
            state: 'idle' as const
        }));
        setTracks((ts) => [...ts, ...added]);
        if (added.length > 0 && selectedKey === null) setSelectedKey(added[0].key);
    };

    const moveTo = (key: string, to: number) =>
        setTracks((ts) => {
            const next = [...ts];
            const from = next.findIndex((t) => t.key === key);
            const [t] = next.splice(from, 1);
            next.splice(to, 0, t);
            return next;
        });

    const problem = (): string | null => {
        if (!name.trim()) return 'Укажи название альбома';
        if (!cover) return 'Добавь обложку альбома';
        if (tracks.length === 0) return 'Добавь мешапы';
        for (const [i, t] of tracks.entries()) {
            const label = t.name.trim() ? `«${t.name.trim()}»` : `Мешап ${i + 1}`;
            if (!t.name.trim()) return `${label}: нет названия`;
            if (t.genres.length === 0) return `${label}: выбери жанр`;
            if (t.sources.length < 2) return `${label}: нужно минимум два исходника`;
        }
        return null;
    };

    const publish = async () => {
        const reason = problem();
        if (reason) {
            error('в альбоме.', reason);
            const bad = tracks.find((t) => !ready(t));
            if (bad) setSelectedKey(bad.key);
            return;
        }

        setSending(true);
        try {
            let id = albumId;
            if (id === null) {
                const r: AxiosResponse<SmashUpResponse<Playlist>> = await axiosSession.post(
                    '/playlist/create?type=ALBUM',
                    { name: name.trim(), description: description.trim(), basedImageFile: cover }
                );
                id = r.data.response.id;
                setAlbumId(id);
            }

            for (const [index, t] of tracks.entries()) {
                if (sent(t)) continue;
                patch(t.key, { state: 'uploading' });

                const part: UploadMashupRequestBody = { tracks: [], tracksUrls: [] };
                t.sources.forEach((s) => s.addToBody(part));

                try {
                    const r: AxiosResponse<SmashUpResponse<{ id: number } | undefined>> =
                        await axiosSession.post('/mashup/upload', {
                            name: t.name.trim(),
                            authors: authors.map((u) => u.id),
                            explicit: t.explicit,
                            banWords: t.banWords,
                            albumId: id,
                            albumPosition: index,
                            tracks: part.tracks,
                            tracksUrls: part.tracksUrls,
                            statusesUrls: t.statusLink.trim() ? [t.statusLink.trim()] : [],
                            genres: t.genres,
                            basedMashupFile: await toBase64(t.file),
                            basedImageFile: cover
                        });
                    // как в обычной загрузке: id есть — опубликован сразу, нет — ушёл на модерацию
                    patch(t.key, {
                        state: r.data.response?.id !== undefined ? 'published' : 'moderation'
                    });
                } catch (e) {
                    patch(t.key, { state: 'error' });
                    setSelectedKey(t.key);
                    axiosCatcher(toast, `при загрузке «${t.name}»`)(e as never);
                }
            }
        } catch (e) {
            axiosCatcher(toast, 'при создании альбома')(e as never);
        } finally {
            setSending(false);
        }
    };

    const albumLocked = albumId !== null;
    const done = tracks.length > 0 && tracks.every(sent);
    const onModeration = tracks.filter((t) => t.state === 'moderation').length;
    const selectedLocked = selected !== null && (sent(selected) || selected.state === 'uploading');

    return (
        <TooltipProvider>
            <section className='flex flex-col gap-y-7 pb-10 px-1'>
                <h1 className='font-semibold text-[28px] text-onSurface'>Загрузка альбома</h1>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-y-[35px] gap-x-10 items-start'>
                    {/* а) Альбом */}
                    <div className='flex flex-col gap-y-[35px]'>
                        <CoverPicker
                            src={coverSrc}
                            alt='Обложка альбома'
                            disabled={albumLocked}
                            onFile={pickCover}
                            hintAside
                        />

                        <FormField label='Название альбома'>
                            <Input
                                value={name}
                                maxLength={64}
                                placeholder='Название альбома'
                                disabled={albumLocked}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormField>

                        <CoauthorsPicker
                            selectedUsers={authors}
                            setSelectedUsers={setAuthors}
                            handleLoggedUser
                            searchLabel='Добавь соавторов альбома'
                            disabled={albumLocked}
                        />

                        <FormField label='Описание'>
                            <Textarea
                                value={description}
                                maxLength={1024}
                                disabled={albumLocked}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormField>
                    </div>

                    {/* б) Мешапы */}
                    <div className='flex flex-col gap-y-2.5'>
                        <span className={cn(FORM_LABEL, 'flex items-center gap-x-1 text-sm')}>
                            Мешапы
                            {tracks.length > 0 && (
                                <span className='ml-0.5 tabular-nums text-additionalText'>
                                    {tracks.length}
                                </span>
                            )}
                            <Hint text='Только .mp3 до 20 МБ. Обложка у мешапов как у альбома' />
                        </span>

                        {tracks.map((t, index) => {
                            const isSelected = t.key === selectedKey;
                            const locked = sent(t) || t.state === 'uploading';
                            const missing = [
                                t.genres.length === 0 && 'жанр',
                                t.sources.length < 2 && 'исходники'
                            ].filter(Boolean);
                            // та же строка, что MashupSmallThumb, только обложка альбома
                            return (
                                <div
                                    key={t.key}
                                    draggable={!albumLocked}
                                    onDragStart={(e) => {
                                        setDragKey(t.key);
                                        e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    ref={flipRef(t.key)}
                                    onDragOver={(e) => {
                                        if (dragKey === null) return;
                                        e.preventDefault();
                                        if (dragKey === t.key) return;
                                        // меняем местами, только когда курсор перешёл середину строки
                                        // по её месту в раскладке, а не по тому, где она сейчас
                                        // нарисована: иначе едущая строка снова оказывается под
                                        // курсором и пара начинает дёргаться туда-сюда
                                        const el = e.currentTarget;
                                        const r = el.getBoundingClientRect();
                                        const shift = new DOMMatrix(getComputedStyle(el).transform)
                                            .m42;
                                        const mid = r.top - shift + r.height / 2;
                                        const from = tracks.findIndex((x) => x.key === dragKey);
                                        if (from < index ? e.clientY >= mid : e.clientY <= mid)
                                            moveTo(dragKey, index);
                                    }}
                                    onDragEnd={() => setDragKey(null)}
                                    className={cn(
                                        'flex items-center gap-x-1 p-1.5 rounded-2xl cursor-pointer transition-[background-color,transform,opacity,scale] [transition-duration:240ms] ease-spring motion-reduce:transition-none',
                                        isSelected
                                            ? 'bg-primary/[0.3] hover:bg-hoverPrimary/[0.3]'
                                            : 'hover:bg-onPrimary',
                                        dragKey === t.key && 'opacity-40 scale-[0.97]',
                                        leavingKey === t.key && 'opacity-0 scale-95'
                                    )}
                                    onClick={() => setSelectedKey(t.key)}
                                >
                                    <div className='flex flex-1 min-w-0 items-center gap-x-4'>
                                        {coverSrc ? (
                                            <img
                                                src={coverSrc}
                                                alt=''
                                                draggable={false}
                                                className='w-11 h-11 min-w-11 rounded-xl object-cover'
                                            />
                                        ) : (
                                            <div className='w-11 h-11 min-w-11 rounded-xl bg-surface' />
                                        )}
                                        <div className='flex flex-col min-w-0'>
                                            <span
                                                className={cn(
                                                    'font-medium text-sm truncate',
                                                    isSelected ? 'text-primary' : 'text-onSurface'
                                                )}
                                            >
                                                {t.name.trim() || 'Без названия'}
                                            </span>
                                            <span
                                                className={cn(
                                                    'truncate font-medium text-[13px]',
                                                    t.state === 'error'
                                                        ? 'text-error'
                                                        : isSelected
                                                          ? 'text-primary'
                                                          : 'text-onSurfaceVariant'
                                                )}
                                            >
                                                {t.state === 'idle'
                                                    ? authors.map((u) => u.username).join(', ')
                                                    : STATE_TEXT[t.state]}
                                            </span>
                                        </div>
                                    </div>

                                    {t.state === 'idle' && missing.length > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span
                                                    aria-label={`Не заполнено: ${missing.join(', ')}`}
                                                    className='inline-flex size-11 shrink-0 items-center justify-center text-onSurfaceVariant'
                                                >
                                                    <TriangleAlert size={18} strokeWidth={1.5} />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Не заполнено: {missing.join(', ')}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {!albumLocked && (
                                        <Button
                                            variant='ghost'
                                            size='control'
                                            aria-label='Перетащи, чтобы поменять порядок. Стрелки вверх и вниз двигают с клавиатуры'
                                            className='cursor-grab active:cursor-grabbing'
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                const to =
                                                    e.key === 'ArrowUp'
                                                        ? index - 1
                                                        : e.key === 'ArrowDown'
                                                          ? index + 1
                                                          : -1;
                                                if (to < 0 || to >= tracks.length) return;
                                                e.preventDefault();
                                                moveTo(t.key, to);
                                            }}
                                        >
                                            <GripVertical size={18} strokeWidth={1.5} />
                                        </Button>
                                    )}
                                    {!locked && (
                                        <Button
                                            variant='ghost'
                                            size='control'
                                            aria-label='Убрать мешап'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (leavingKey !== null) return;
                                                // как у соавторов: строка гаснет, затем уходит,
                                                // остальные и зона файлов доезжают (useFlip)
                                                setLeavingKey(t.key);
                                                const ms = window.matchMedia(
                                                    '(prefers-reduced-motion: reduce)'
                                                ).matches
                                                    ? 0
                                                    : 200;
                                                setTimeout(() => {
                                                    setTracks((ts) =>
                                                        ts.filter((x) => x.key !== t.key)
                                                    );
                                                    setSelectedKey((k) => (k === t.key ? null : k));
                                                    setLeavingKey(null);
                                                }, ms);
                                            }}
                                        >
                                            <X size={18} strokeWidth={1.5} />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}

                        {!done && (
                            <label
                                ref={flipRef('dropzone')}
                                className={cn(
                                    'flex items-center justify-center gap-x-3 rounded-2xl border border-dashed border-onSurface/20 cursor-pointer text-onSurfaceVariant transition-[color,background-color,border-color,transform] [transition-duration:240ms] ease-spring motion-reduce:transition-none hover:bg-onSurface/[0.04] hover:text-onSurface outline outline-2 outline-transparent outline-offset-2 focus-within:outline-primary',
                                    tracks.length === 0 ? 'flex-col gap-y-2 py-16' : 'h-14',
                                    dragOver && 'bg-primary/10 border-primary text-onSurface'
                                )}
                                onDragOver={(e) => {
                                    if (dragKey !== null) return;
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(false);
                                    addFiles(e.dataTransfer.files);
                                }}
                            >
                                {tracks.length === 0 ? (
                                    <Music size={28} strokeWidth={1.5} />
                                ) : (
                                    <Plus size={18} strokeWidth={1.5} />
                                )}
                                <span className='text-[15px] font-medium'>
                                    {tracks.length === 0
                                        ? 'Перетащи .mp3 или выбери файлы'
                                        : 'Добавить мешапы'}
                                </span>
                                <input
                                    type='file'
                                    accept='.mp3,audio/mpeg'
                                    multiple
                                    aria-label='Добавить мешапы'
                                    className='sr-only'
                                    onChange={(e) => {
                                        addFiles(e.target.files);
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        )}
                    </div>

                    {/* в) Свойства выбранного мешапа — те же поля, что в форме мешапа */}
                    <div className='flex flex-col gap-y-[35px]'>
                        {!selected ? (
                            <span className='text-onSurfaceVariant'>
                                {tracks.length === 0
                                    ? 'Добавь мешапы, чтобы заполнить их свойства'
                                    : 'Выбери мешап в списке'}
                            </span>
                        ) : (
                            <>
                                <FormField label='Название мешапа'>
                                    <Input
                                        value={selected.name}
                                        maxLength={64}
                                        placeholder='Название мешапа'
                                        disabled={selectedLocked}
                                        onChange={(e) =>
                                            patch(selected.key, { name: e.target.value })
                                        }
                                    />
                                </FormField>

                                <GenrePicker
                                    allGenres={allGenres ?? []}
                                    selected={new Set(selected.genres)}
                                    disabled={selectedLocked}
                                    onChange={(genres) =>
                                        patch(selected.key, { genres: [...genres] })
                                    }
                                />

                                {/* key: при смене мешапа поиск и выдача сбрасываются */}
                                <TrackSourcesPicker
                                    key={selected.key}
                                    selectedTracks={selected.sources}
                                    setSelectedTracks={setSelectedSources}
                                    handleTracksUrls
                                    showTracksIcons
                                    disabled={selectedLocked}
                                />

                                <div className='flex flex-col gap-y-2.5'>
                                    <StatusCheckbox
                                        label='Explicit (Мат)'
                                        checked={selected.explicit}
                                        disabled={selectedLocked}
                                        onChange={(v) => patch(selected.key, { explicit: v })}
                                    />
                                    <StatusCheckbox
                                        label='Бан-ворды Twitch'
                                        checked={selected.banWords}
                                        disabled={selectedLocked}
                                        onChange={(v) => patch(selected.key, { banWords: v })}
                                    />
                                </div>

                                <StatusLinkInput
                                    value={selected.statusLink}
                                    disabled={selectedLocked}
                                    onChange={(v) => patch(selected.key, { statusLink: v })}
                                />
                            </>
                        )}
                    </div>
                </div>

                {done && albumId !== null ? (
                    <div className='bg-surfaceVariant p-5 w-full md:w-fit rounded-[30px] flex flex-col md:flex-row items-stretch md:items-center gap-y-4 md:gap-x-6'>
                        <Button asChild className='w-full md:w-[460px]'>
                            <Link to={`/playlist/${albumId}`}>Открыть альбом</Link>
                        </Button>
                        <span className='text-onSurfaceVariant'>
                            {onModeration > 0
                                ? `${onModeration} ${declOfNum(onModeration, ['мешап', 'мешапа', 'мешапов'])} на модерации, другие увидят альбом после проверки`
                                : 'Альбом опубликован'}
                        </span>
                    </div>
                ) : (
                    <PublishBar
                        button={
                            sending
                                ? `Загружаем ${tracks.filter(sent).length + 1} из ${tracks.length}`
                                : albumLocked
                                  ? 'Дозагрузить оставшиеся'
                                  : 'Опубликовать альбом'
                        }
                        disabled={sending || tracks.length === 0}
                        agree={agree}
                        setAgree={setAgree}
                        showAgree
                        onClick={publish}
                    />
                )}
            </section>
        </TooltipProvider>
    );
}
