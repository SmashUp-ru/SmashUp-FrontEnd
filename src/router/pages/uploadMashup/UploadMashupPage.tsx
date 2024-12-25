import { axiosSession, cn, convertToBase64, removeItem, trim } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/Edit.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import LinkIcon from '@/components/icons/Link.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import axios, { AxiosResponse } from 'axios';
import { TrackSearchResponse } from '@/types/api/search';
import { RegEx } from '@/lib/regex';
import { YouTubeOEmbedResponse, YouTubeTrack } from '@/types/api/youtube';
import {
    areTracksEqual,
    GenresResponse,
    isSelected,
    RenderTrack,
    SelectedTrack,
    SmashUpSelectedTrack,
    YouTubeSelectedTrack
} from '@/types/api/upload';
import YouTubeTrackSmallThumb from '@/router/shared/track/YouTubeTrackSmallThumb';

export default function UploadMashupPage() {
    // if (isLoading) return <UploadMashupSkeletonPage />;

    const [image, setImage] = useState<null | string | ArrayBuffer>(null);
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

    useEffect(() => {
        axiosSession
            .get('/const/genres')
            .then((r: AxiosResponse<GenresResponse>) => setAllGenres(r.data.response));
    }, []);

    const [name, setName] = useState<string>('');
    const [tracksQuery, setTracksQuery] = useState<string>('');

    const [debouncedQuery] = useDebounce(tracksQuery, 500);

    const [tracks, setTracks] = useState<Track[]>([]);

    const [youTubeTrackLoading, setYouTubeTrackLoading] = useState<boolean>(false);
    const [youTubeTrack, setYouTubeTrack] = useState<null | YouTubeTrack>(null);

    const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);

    const [renderTracks, setRenderTracks] = useState<RenderTrack[]>([]);

    const searchYouTube = (link: string) => {
        setYouTubeTrackLoading(true);

        axios
            .get(`https://www.youtube.com/oembed?format=json&url=${link}`)
            .then((r: AxiosResponse<YouTubeOEmbedResponse>) => {
                const title = r.data.title;

                let data: string[] = [];
                for (const separator of ['-', '–', '—']) {
                    data = title.split(separator, 2);
                    if (data.length == 2) {
                        break;
                    }
                }

                if (data.length != 2) {
                    data = ['???', title];
                } else {
                    data = [trim(data[0]), trim(data[1])];
                }

                setYouTubeTrack({
                    authors: [data[0]],
                    name: data[1],
                    imageUrl: r.data.thumbnail_url,
                    link: link
                });
            })
            .then(() => setYouTubeTrackLoading(false));
    };

    useEffect(() => {
        if (RegEx.YOUTUBE.test(debouncedQuery)) {
            const link = RegEx.NORMALIZE_YOUTUBE_LINK(debouncedQuery);
            searchYouTube(link);
        }

        if (debouncedQuery.length >= 2 && debouncedQuery.length <= 32) {
            axiosSession
                .get(`/track/search?query=${debouncedQuery}`)
                .then((r: AxiosResponse<TrackSearchResponse>) => setTracks(r.data.response));
        } else {
            setTracks([]);
            setYouTubeTrack(null);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        const nonSelectedTracks = calculateNonSelectedTracks(tracks, selectedTracks);

        const statefulOnClick = (track: SelectedTrack, selectedTracks: SelectedTrack[]) => {
            if (isSelected(track, selectedTracks)) {
                setSelectedTracks(removeItem(selectedTracks, track, areTracksEqual));
            } else {
                setSelectedTracks(selectedTracks.concat([track]));
            }
        };

        const renderSelectedTracks = selectedTracks.map((track) => {
            if (track.constructor.name === 'SmashUpSelectedTrack') {
                return {
                    keyType: 'SmashUpSelectedTrack',
                    key: track.key,
                    track: (track as SmashUpSelectedTrack).track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        statefulOnClick(track, selectedTracks)
                };
            } else if (track.constructor.name === 'YouTubeSelectedTrack') {
                return {
                    keyType: 'YouTubeSelectedTrack',
                    key: track.key,
                    track: (track as YouTubeSelectedTrack).track as unknown as Track,
                    selected: true,
                    statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                        statefulOnClick(track, selectedTracks)
                };
            } else {
                throw new Error(`${track.constructor.name} not supported`);
            }
        });

        const renderTracks = nonSelectedTracks.map((track) => {
            return {
                keyType: 'SmashUpSelectedTrack',
                key: track.id,
                track: track,
                selected: false,
                statefulOnClick: (selectedTracks: SelectedTrack[]) =>
                    statefulOnClick(new SmashUpSelectedTrack(track), selectedTracks)
            };
        });

        setRenderTracks(renderSelectedTracks.concat(renderTracks));
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

    const calculateSelectedTracksKeys = (selectedTracks: SelectedTrack[]) => {
        const selectedTracksKeys = new Map<string, Set<unknown>>();
        for (const selectedTrack of selectedTracks) {
            const className = selectedTrack.constructor.name;

            let keys = selectedTracksKeys.get(className);
            if (keys === undefined) {
                keys = new Set();
                selectedTracksKeys.set(className, keys);
            }

            keys.add(selectedTrack.key);
        }
        return selectedTracksKeys;
    };

    const calculateNonSelectedTracks = (
        tracks: Track[],
        selectedTracks: SelectedTrack[]
    ): Track[] => {
        const selectedTracksKeys = calculateSelectedTracksKeys(selectedTracks);

        const smashUpKeys = selectedTracksKeys.get('SmashUpSelectedTrack');
        const newNonSelectedTracks = tracks.filter((track) => {
            return smashUpKeys === undefined || smashUpKeys === null || !smashUpKeys.has(track.id);
        });
        return newNonSelectedTracks;
    };

    return (
        <section className='flex flex-col gap-y-6 pr-[35px] h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>Настройки</h1>
            </div>
            <div className='w-full flex gap-x-12 flex-1'>
                <label className='relative cursor-pointer h-fit'>
                    {image && typeof image === 'string' ? (
                        <img
                            src={image}
                            className={cn(
                                'w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-[30px] brightness-50'
                            )}
                            draggable={false}
                            alt='uploaded mashup cover'
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
                        onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(await convertToBase64(e.target.files[0]));
                            }
                        }}
                    />
                </label>

                <div className='w-full flex flex-col flex-1'>
                    <div className='w-full grid grid-cols-3 gap-x-10 flex-grow'>
                        {/*название, использованные треки*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мэшапа
                                </Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте использованные треки
                                </Label>
                                <Input
                                    placeholder='2-32 символа'
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
                                            track={renderTrack.track}
                                            selected={renderTrack.selected}
                                            onClick={() =>
                                                renderTrack.statefulOnClick(selectedTracks)
                                            }
                                        />
                                    ))}
                                </div>

                                <Input
                                    startIcon={LinkIcon}
                                    startIconClassName='text-onSurfaceVariant'
                                    placeholder='Ссылка на основу / альт (Если есть)'
                                />
                            </div>
                        </div>

                        {/*mp3, жанр, банворды*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Выберите жанр
                                </Label>
                                <div className='grid grid-cols-3 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                    {allGenres?.map((genre) => {
                                        const selected = selectedGenres.has(genre);

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
                                                        newSelectedGenres.delete(genre);
                                                    } else {
                                                        newSelectedGenres.add(genre);
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

                            <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                <Checkbox />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Explicit (Мат)
                                </Label>
                            </div>

                            <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                <Checkbox />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Бан-ворды Twitch
                                </Label>
                            </div>
                        </div>

                        {/*авторы*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='w-full'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <Input
                                    id='newPasswordAgain'
                                    value=''
                                    disabled
                                    placeholder='Авторы через ,'
                                    className='p-0 bg-transparent font-bold text-[24px] placeholder:text-onPrimary'
                                />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте соавторов мэшапа
                                </Label>

                                <Input placeholder='Введите ник мэшапера' startIcon={SearchIcon} />

                                <div className='flex flex-col gap-y-2.5 max-h-[200px] overflow-y-scroll'>
                                    <div className='flex items-center gap-x-4 rounded-l-[50px] rounded-r-2xl bg-badge p-[6px] mr-[7px]'>
                                        <div className='w-12 h-12 rounded-full bg-onSurface' />
                                        <span className='font-bold text-primary'>никнейм</span>
                                    </div>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div
                                            className='flex items-center gap-x-4 rounded-l-[50px] rounded-r-2xl p-[6px] mr-[7px]'
                                            key={idx}
                                        >
                                            <div className='w-12 h-12 rounded-full bg-onSurface' />
                                            <span className='font-bold text-onSurface'>
                                                никнейм
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6'>
                        <Button className='w-[460px]'>Опубликовать</Button>
                        <div className='flex items-center gap-x-4'>
                            <Checkbox />
                            <span>
                                Я прочитал(-а) и согласен(-на) с условиями{' '}
                                <Link
                                    className='text-primary'
                                    to='/privacy_policy'
                                    draggable={false}
                                >
                                    пользовательского соглашения
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
