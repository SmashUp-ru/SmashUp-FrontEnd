import { axiosSession, cn, removeItem } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/Edit.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import LinkIcon from '@/components/icons/Link.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { AxiosResponse } from 'axios';
import { TrackSearchResponse, UsersSearchResponse } from '@/router/shared/types/search.ts';
import { RegEx } from '@/lib/regex.ts';
import { YouTubeTrack } from '@/router/shared/types/youtube.ts';
import {
    areTracksEqual,
    areUsersEqual,
    GenresResponse,
    isTrackSelected,
    isUserSelected,
    RenderTrack,
    RenderUser,
    SearchTrack,
    SelectedTrack,
    SmashUpSelectedTrack,
    SpotifySelectedTrack,
    TrackType,
    UploadMashupRequestBody,
    YandexMusicSelectedTrack,
    YouTubeSelectedTrack
} from '@/router/shared/types/upload.ts';
import YouTubeTrackSmallThumb from '@/router/shared/components/track/YouTubeTrackSmallThumb.tsx';
import { User } from '@/store/entities/user.ts';
import {
    isAlt,
    isExplicit,
    setExplicit as setIsExplicit,
    isHashtagMashup,
    isModerator,
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
import { loadOEmbed } from '@/lib/youtube.ts';
import YouTubeIcon from '@/components/icons/YouTube.tsx';
import YandexMusicIcon from '@/components/icons/YandexMusic.tsx';
import { YandexTracksResponse } from '@/router/shared/types/yandex.ts';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import AltIcon from '@/components/icons/Alt.tsx';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import { SpotifyTracksResponse } from '@/types/api/spotify.ts';
import SpotifyIcon from '@/components/icons/Spotify.tsx';
import TrackSmallThumbSkeleton from '../track/TrackSmallThumbSkeleton.tsx';

interface MashupFormProps {
    initial: MashupFormInitialProps;
    text: MashupFormTextProps;

    handleLoggedUser: boolean;
    handleTracksUrls: boolean;
    handleMashupFile: boolean;
    requireImageFile: boolean;
    showTracksIcons: boolean;
    lockStatusLink: boolean;

    onClick(body: MashupFormBody): unknown;
}

interface MashupFormInitialProps {
    name: string;
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
    const { toast } = useToast();

    const hasStatusLink = initial.statusLink !== undefined;
    const hasExplicit = initial.explicit !== undefined;
    const hasBanWords = initial.banWords !== undefined;
    const hasStatuses = initial.statuses !== undefined;

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
    }, []);

    // Track search

    const [tracksQuery, setTracksQuery] = useState<string>('');
    const [debouncedTracksQuery] = useDebounce(tracksQuery, 500);

    const [tracks, setTracks] = useState<SearchTrack[]>([]);
    const [tracksLoading, setTracksLoading] = useState<boolean>(false);

    const [youTubeTrackLoading, setYouTubeTrackLoading] = useState<boolean>(false);
    const [youTubeTrack, setYouTubeTrack] = useState<YouTubeTrack | null>(null);

    const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>(initial.selectedTracks);

    const [renderTracks, setRenderTracks] = useState<RenderTrack[]>([]);

    const searchYouTube = (link: string) => {
        setYouTubeTrackLoading(true);

        loadOEmbed(link)
            .then(setYouTubeTrack)
            .then(() => setYouTubeTrackLoading(false));
    };

    function renderSelectedTracks(selectedTracks: SelectedTrack[]): RenderTrack[] {
        return selectedTracks.map((track) => {
            const type = track.keyType;
            if (type === TrackType.SmashUp) {
                return {
                    keyType: TrackType.SmashUp,
                    key: track.key,
                    track: (track as SmashUpSelectedTrack).track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        trackStatefulOnClick(track, selectedTracks)
                };
            } else if (type === TrackType.YouTube) {
                return {
                    keyType: TrackType.YouTube,
                    key: track.key,
                    icon: <YouTubeIcon />,
                    track: (track as YouTubeSelectedTrack).track as unknown as Track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        trackStatefulOnClick(track, selectedTracks)
                };
            } else if (type === TrackType.YandexMusic) {
                return {
                    keyType: TrackType.YandexMusic,
                    key: track.key,
                    icon: <YandexMusicIcon />,
                    track: (track as YandexMusicSelectedTrack).track as unknown as Track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        trackStatefulOnClick(track, selectedTracks)
                };
            } else if (type === TrackType.Spotify) {
                return {
                    keyType: TrackType.Spotify,
                    key: track.key,
                    icon: <SpotifyIcon />,
                    track: (track as SpotifySelectedTrack).track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        trackStatefulOnClick(track, selectedTracks)
                };
            } else {
                throw new Error(`${track.constructor.name} not supported`);
            }
        });
    }

    useEffect(() => {
        setRenderTracks(renderSelectedTracks(selectedTracks));
        setRenderUsers(
            selectedUsers.map((user) => {
                return {
                    user: user,
                    selected: true,
                    statefulOnClick: (selectedUsers: User[]) =>
                        userStatefulOnClick(user, selectedUsers)
                };
            })
        );
    }, []);

    useEffect(() => {
        if (handleTracksUrls && RegEx.YOUTUBE.test(debouncedTracksQuery)) {
            const link = RegEx.NORMALIZE_YOUTUBE_LINK(debouncedTracksQuery);
            searchYouTube(link);
            return;
        }

        if (debouncedTracksQuery.length >= 2 && debouncedTracksQuery.length <= 32) {
            const promises = [
                axiosSession
                    .get(`/track/search?query=${debouncedTracksQuery}`)
                    .then((r: AxiosResponse<TrackSearchResponse>) =>
                        r.data.response.map((track) => {
                            return {
                                key: track.id,
                                keyType: TrackType.SmashUp,
                                track: track
                            };
                        })
                    ),
                handleTracksUrls
                    ? axiosSession
                          .get(`/track/search/yandex_music?query=${debouncedTracksQuery}`)
                          .then((r: AxiosResponse<YandexTracksResponse>) =>
                              r.data.response.map((track) => {
                                  return {
                                      key: track.id,
                                      keyType: TrackType.YandexMusic,
                                      track: {
                                          id: track.id,
                                          name: track.name,
                                          authors: track.authors.map((author) => author.name),
                                          imageUrl: `https://${track.albums[0].coverUri.replace('%%', '100x100')}`,
                                          link: `https://music.yandex.ru/album/${track.albums[0].id}/track/${track.id}`
                                      } as Track
                                  };
                              })
                          )
                    : Promise.resolve([]),
                handleTracksUrls
                    ? axiosSession
                          .get(`/track/search/spotify?query=${debouncedTracksQuery}`)
                          .then((r: AxiosResponse<SpotifyTracksResponse>) =>
                              r.data.response.map((track) => {
                                  return {
                                      key: track.id,
                                      keyType: TrackType.Spotify,
                                      track: {
                                          id: track.id as unknown as number,
                                          name: track.name,
                                          authors: track.authors.map((author) => author.name),
                                          imageUrl: track.album.imageUrl,
                                          link: track.link
                                      } as Track
                                  };
                              })
                          )
                    : Promise.resolve([])
            ];

            setTracksLoading(true);

            Promise.all(promises).then((result) => {
                // TODO: more complex analyzation for identical tracks, including albums
                const keys = new Set();

                const trackToKey = (track: SearchTrack) => {
                    return (
                        track.track.authors.map((author) => author.trim()).join(', ') +
                        ' — ' +
                        track.track.name.trim()
                    ).toLowerCase();
                };

                for (const track of result[0]) {
                    keys.add(trackToKey(track));
                }

                const filteredYandex: SearchTrack[] = [];
                for (const track of result[1]) {
                    const key = trackToKey(track);
                    if (!keys.has(key)) {
                        filteredYandex.push(track);
                    }

                    keys.add(key);
                }

                const filteredSpotify: SearchTrack[] = [];
                for (const track of result[2]) {
                    if (!keys.has(trackToKey(track))) {
                        filteredSpotify.push(track);
                    }
                }

                setTracks((result[0].concat(result[1]) as SearchTrack[]).concat(filteredSpotify));
                setTracksLoading(false);
            });
        } else {
            setTracks([]);
            setTracksLoading(false);
            setYouTubeTrack(null);
        }
    }, [debouncedTracksQuery]);

    useEffect(() => {
        const nonSelectedTracks = calculateNonSelectedTracks(tracks, selectedTracks);

        const renderTracks = nonSelectedTracks.map((track) => {
            return {
                key: track.key,
                keyType: track.keyType,
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
    }, [tracks]);

    useEffect(() => {
        const selectedTracksKeys = calculateSelectedTracksKeys(selectedTracks);
        const newRenderTracks: RenderTrack[] = [];
        for (const renderTrack of renderTracks) {
            const keys = selectedTracksKeys.get(renderTrack.keyType);

            const selected = keys !== undefined && keys !== null && keys.has(renderTrack.key);

            newRenderTracks.push({
                ...renderTrack,
                selected: selected
            });
        }

        setRenderTracks(newRenderTracks);
    }, [selectedTracks]);

    const trackStatefulOnClick = (track: SelectedTrack, selectedTracks: SelectedTrack[]) => {
        if (isTrackSelected(track, selectedTracks)) {
            setSelectedTracks(removeItem(selectedTracks, track, areTracksEqual));
        } else {
            setSelectedTracks(selectedTracks.concat([track]));
        }
    };

    const calculateSelectedTracksKeys = (selectedTracks: SelectedTrack[]) => {
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
    };

    const calculateNonSelectedTracks = (
        tracks: SearchTrack[],
        selectedTracks: SelectedTrack[]
    ): SearchTrack[] => {
        const selectedTracksKeys = calculateSelectedTracksKeys(selectedTracks);

        const newNonSelectedTracks = tracks.filter((track) => {
            const keys = selectedTracksKeys.get(track.keyType);
            return keys === undefined || keys === null || !keys.has(track.key);
        });
        return newNonSelectedTracks;
    };

    // User search

    const [usersQuery, setUsersQuery] = useState<string>('');
    const [debouncedUserQuery] = useDebounce(usersQuery, 500);

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>(initial.selectedUsers);

    const [renderUsers, setRenderUsers] = useState<RenderUser[]>([]);

    const loggedUser = useGlobalStore((state) => state.currentUser);

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

        const renderSelectedUsers = selectedUsers.map((user) => {
            return {
                user: user,
                selected: true,
                statefulOnClick: (selectedUsers: User[]) => userStatefulOnClick(user, selectedUsers)
            };
        });

        const renderUsers = nonSelectedUsers.map((user) => {
            return {
                user: user,
                selected: false,
                statefulOnClick: (selectedUsers: User[]) => userStatefulOnClick(user, selectedUsers)
            };
        });

        setRenderUsers(renderSelectedUsers.concat(renderUsers));
    }, [users]);

    useEffect(() => {
        const selectedUsersSet = new Set<number>(selectedUsers.map((user) => user.id));
        const newRenderUsers: RenderUser[] = [];
        for (const renderUser of renderUsers) {
            const selected = selectedUsersSet.has(renderUser.user.id);

            newRenderUsers.push({
                ...renderUser,
                selected: selected
            });
        }

        setRenderUsers(newRenderUsers);
    }, [selectedUsers]);

    useEffect(() => {
        if (handleLoggedUser && loggedUser && !isUserSelected(loggedUser, selectedUsers)) {
            const newRenderUsers = [
                {
                    user: loggedUser,
                    selected: true,
                    statefulOnClick: (selectedUsers: User[]) =>
                        userStatefulOnClick(loggedUser, selectedUsers)
                }
            ].concat(renderUsers);

            setRenderUsers(newRenderUsers);
            setSelectedUsers(selectedUsers.concat([loggedUser]));
        }
    }, [loggedUser]);

    const userStatefulOnClick = (user: User, selectedUsers: User[]) => {
        if (isUserSelected(user, selectedUsers)) {
            setSelectedUsers(removeItem(selectedUsers, user, areUsersEqual));
        } else {
            setSelectedUsers(selectedUsers.concat([user]));
        }
    };

    const calculateNonSelectedUsers = (users: User[], selectedUsers: User[]): User[] => {
        const selectedUsersSet = new Set<number>(selectedUsers.map((user) => user.id));
        return users.filter((user) => !selectedUsersSet.has(user.id));
    };

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
    }, [imageFile]);

    // Send

    const send = () => {
        if (handleMashupFile) {
            if (!basedMashupFile || !mashupFile) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке мэшапа.'
                            after='Загрузите .mp3 с мэшапом!'
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
                            field='при загрузке мэшапа.'
                            after='Мэшап должен весить не более, чем 20мб.'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }
        }

        if (requireImageFile) {
            if (!basedImageFile || !imageFile) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке обложки.'
                            after='Загрузите обложку мэшапа!'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
                return;
            }

            const image = new Image();
            image.src = `data:image/png;base64,${basedImageFile}`;
            image.onload = () => {
                if (image.naturalHeight < 800 || image.naturalWidth < 800) {
                    toast({
                        element: (
                            <ErrorToast
                                icon
                                before='Ошибка'
                                field='при загрузке обложки.'
                                after='Обложка мэшапа должна быть размером больше 800px.'
                            />
                        ),
                        duration: 2000,
                        variant: 'destructive'
                    });
                    return;
                }
            };

            if (imageFile.size > 5 * 1024 * 1024) {
                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Ошибка'
                            field='при загрузке обложки.'
                            after='Обложка мэшапа должна весить не более, чем 5мб.'
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
                        image={`data:image/png;base64,${basedImageFile}`}
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
                        image={`data:image/png;base64,${basedImageFile}`}
                        before='Ошибка'
                        field='при загрузке жанров.'
                        after='Выберите хотя бы один жанр.'
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
                        image={`data:image/png;base64,${basedImageFile}`}
                        before='Ошибка'
                        field='при загрузке авторов.'
                        after='Выберите хотя бы одного автора.'
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
                        image={`data:image/png;base64,${basedImageFile}`}
                        before='Ошибка'
                        field='при загрузке сурсов.'
                        after='Выберите хотя бы два трека.'
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
            statusesUrls: hasStatusLink ? [statusLink] : null,
            genres: [...selectedGenres],
            basedMashupFile: basedMashupFile,
            basedImageFile: basedImageFile
        };

        onClick(body);
    };

    //

    const [loading, setLoading] = useState(allGenres.length === 0);

    if (loading) return <MashupFormSkeleton />;

    const normalizedBasedImageFile = basedImageFile
        ? basedImageFile.startsWith('blob:')
            ? basedImageFile
            : `data:image/png;base64,${basedImageFile}`
        : null;

    return (
        <section className='flex flex-col gap-y-6 pr-[35px] h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>{text.title}</h1>
            </div>
            <div className='w-full flex gap-x-12 flex-1'>
                {/*картинка, mp3*/}
                <div>
                    <label className='relative cursor-pointer h-fit'>
                        {normalizedBasedImageFile ? (
                            <img
                                src={normalizedBasedImageFile}
                                className={cn(
                                    'w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-[30px] brightness-50'
                                )}
                                draggable={false}
                                alt='Обложка загружаемого мэшапа'
                            />
                        ) : (
                            <div className='w-[200px] h-[200px] rounded-[30px] bg-surfaceVariant' />
                        )}
                        <EditIcon
                            size={70}
                            className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                            color='onSurface'
                        />
                        <Input
                            type='file'
                            className='hidden'
                            accept='.png,.jpg,.jpeg'
                            onChange={async (e) => {
                                if (e.target.files) {
                                    setImageFile(e.target.files[0]);
                                } else if (initial.basedImage !== undefined) {
                                    setImageFile(null);
                                }
                            }}
                        />
                    </label>
                </div>

                <div className='w-full flex flex-col flex-1'>
                    <div className='w-full grid grid-cols-3 gap-x-10 flex-grow'>
                        {/*название, использованные треки*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мэшапа
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Введите название мэшапа'
                                />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте использованные треки
                                </Label>
                                <Input
                                    placeholder='Введите название трека'
                                    startIcon={SearchIcon}
                                    value={tracksQuery}
                                    onChange={(e) => setTracksQuery(e.target.value)}
                                />

                                <div className='flex flex-col gap-y-2.5 max-h-[270px] overflow-y-scroll'>
                                    <YouTubeTrackSmallThumb
                                        track={youTubeTrack}
                                        loading={youTubeTrackLoading}
                                        selectedTracks={selectedTracks}
                                        setSelectedTracks={setSelectedTracks}
                                        renderTracks={renderTracks}
                                    />

                                    {renderTracks.map((renderTrack) => (
                                        <TrackSmallThumb
                                            key={renderTrack.track.id}
                                            track={renderTrack.track}
                                            selected={renderTrack.selected}
                                            icon={showTracksIcons ? renderTrack.icon : undefined}
                                            onClick={() =>
                                                renderTrack.statefulOnClick(selectedTracks)
                                            }
                                        />
                                    ))}

                                    {tracksLoading && (
                                        <>
                                            <TrackSmallThumbSkeleton />
                                            <TrackSmallThumbSkeleton />
                                            <TrackSmallThumbSkeleton />
                                        </>
                                    )}
                                </div>

                                {hasStatusLink &&
                                    (!lockStatusLink ? (
                                        <Input
                                            startIcon={LinkIcon}
                                            startIconClassName='text-onSurfaceVariant'
                                            placeholder='Ссылка на основу / альт (Если есть)'
                                            value={statusLink}
                                            onChange={(e) => setStatusLink(e.target.value)}
                                        />
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
                                                                        img={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/default_100x100.png`}
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
                            </div>
                        </div>

                        {/*жанр, банворды*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            {handleMashupFile && (
                                <div className='flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Загрузите ваш мэшап (.mp3)
                                    </Label>

                                    <label className='relative'>
                                        <span className='text-[24px] font-bold text-primary cursor-pointer'>
                                            {mashupFile === null || mashupFile === undefined
                                                ? 'Нажмите для загрузки'
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

                                    <div
                                        className='h-1 bg-primary rounded'
                                        style={{ width: `${mashupFileProgress}%` }}
                                    />
                                </div>
                            )}
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Выберите жанр
                                </Label>
                                <div className='grid grid-cols-3 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                    {allGenres?.map((genre) => {
                                        const selected = selectedGenres.has(genre.toLowerCase());

                                        return (
                                            <div
                                                key={genre}
                                                className={cn(
                                                    'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                    selected ? 'bg-badge text-primary' : ''
                                                )}
                                                onClick={() => {
                                                    const newSelectedGenres = new Set(
                                                        selectedGenres
                                                    );
                                                    if (selected) {
                                                        newSelectedGenres.delete(
                                                            genre.toLowerCase()
                                                        );
                                                    } else {
                                                        newSelectedGenres.add(genre.toLowerCase());
                                                    }
                                                    setSelectedGenres(newSelectedGenres);
                                                }}
                                            >
                                                {genre}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {hasExplicit && (
                                <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                    <Checkbox
                                        checked={explicit}
                                        onCheckedChange={(v) => {
                                            if (typeof v === 'boolean') setExplicit(v);
                                        }}
                                    />
                                    <Label className='font-bold text-[18px] text-onSurface'>
                                        Explicit (Мат)
                                    </Label>
                                </div>
                            )}

                            {hasBanWords && (
                                <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                    <Checkbox
                                        checked={banWords}
                                        onCheckedChange={(v) => {
                                            if (typeof v === 'boolean') setBanWords(v);
                                        }}
                                    />
                                    <Label className='font-bold text-[18px] text-onSurface'>
                                        Бан-ворды Twitch
                                    </Label>
                                </div>
                            )}

                            {hasStatuses && (
                                <div className='flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Выберите статусы
                                    </Label>
                                    <div className='grid grid-cols-4 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                        <div
                                            className={cn(
                                                'h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center cursor-pointer',
                                                isExplicit(statuses) ? 'bg-badge text-primary' : ''
                                            )}
                                            onClick={() =>
                                                setStatuses(
                                                    setIsExplicit(statuses, !isExplicit(statuses))
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

                        {/*авторы*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <span className='font-bold text-[24px] text-onSurfaceVariant'>
                                    {selectedUsers.map((user) => user.username).join(', ')}
                                </span>
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте соавторов мэшапа
                                </Label>

                                <Input
                                    placeholder='Введите ник мэшапера'
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
                                                className={cn(
                                                    'flex items-center gap-x-4 rounded-2xl p-[6px] mr-[7px] cursor-pointer',
                                                    selected ? 'bg-badge' : 'hover:bg-hover'
                                                )}
                                                onClick={() => {
                                                    if (
                                                        loggedUser &&
                                                        loggedUser.id === user.id &&
                                                        !isModerator(loggedUser.permissions)
                                                    ) {
                                                        toast({
                                                            element: (
                                                                <ErrorToast
                                                                    icon
                                                                    before='Ошибка в поле'
                                                                    field='авторов.'
                                                                    after='Вы не можете убрать себя!'
                                                                />
                                                            ),
                                                            duration: 2000,
                                                            variant: 'destructive'
                                                        });
                                                    } else {
                                                        userStatefulOnClick(user, selectedUsers);
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_100x100.png`}
                                                    alt={user.username}
                                                    className='w-12 h-12 rounded-xl object-cover'
                                                    draggable={false}
                                                />
                                                <span
                                                    className={cn(
                                                        'font-bold',
                                                        selected ? 'text-primary' : 'text-onSurface'
                                                    )}
                                                >
                                                    {user.username}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6'>
                        <Button className='w-[460px]' onClick={() => send()} disabled={!agree}>
                            {text.button}
                        </Button>
                        {!initial.agree && (
                            <div className='flex items-center gap-x-4'>
                                <Checkbox
                                    checked={agree}
                                    onCheckedChange={(v) => {
                                        if (typeof v === 'boolean') setAgree(v);
                                    }}
                                />
                                <span>
                                    Я прочитал(-а) и согласен(-на) с условиями{' '}
                                    <Link
                                        className='text-primary'
                                        to='/user_agreement'
                                        draggable={false}
                                    >
                                        пользовательского соглашения
                                    </Link>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
