import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import { useEffect, useState } from 'react';
import { RegEx } from '@/lib/regex';
import { axiosSession } from '@/lib/utils';
import { AxiosResponse } from 'axios';
import { YandexAlbum, YandexAlbumResponse } from '@/router/shared/types/yandex';
import { RenderTrack, TrackType } from '@/router/shared/types/upload';
import { useToast } from '@/router/shared/hooks/use-toast';
import ErrorToast from '@/router/shared/toasts/error';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';

export default function UploadTrackFromYandexTab() {
    const { toast } = useToast();

    const [link, setLink] = useState<string>('');
    const [album, setAlbum] = useState<YandexAlbum>();
    const [tracks, setTracks] = useState<RenderTrack[]>([]);
    const [exists, setExists] = useState<boolean>(false);

    const [cache, setCache] = useState<Map<string, RenderTrack[] | boolean>>(new Map());

    const [agree, setAgree] = useState<boolean>(false);

    useEffect(() => {
        setExists(false);

        let localLink = link;

        let match = localLink.match(RegEx.YANDEX_MUSIC_TRACK);
        if (match) {
            localLink = 'https://music.yandex.ru/album/' + match[1];
        }

        match = localLink.match(RegEx.YANDEX_MUSIC);
        if (match) {
            localLink = 'https://music.yandex.ru/album/' + match[1];

            const cached = cache.get(localLink);
            if (cached === undefined || cached === null) {
                axiosSession
                    .get(`/track/preview/yandex_music?albumId=${match[1]}`)
                    .then((r: AxiosResponse<YandexAlbumResponse>) => {
                        if (Object.keys(r.data.response).length === 0) {
                            setExists(true);

                            const newCache = new Map(cache);
                            newCache.set(localLink, true);
                            setCache(newCache);
                            return;
                        }

                        const album = r.data.response as YandexAlbum;
                        setAlbum(album);

                        const imageUrl = `https://${album.coverUri.replace('%%', '100x100')}`;

                        const newTracks = album.tracks.map((track) => {
                            return {
                                key: track.id,
                                keyType: TrackType.YandexMusic,
                                track: {
                                    id: track.id,
                                    name: track.name,
                                    authors: track.authors.map((author) => author.name),
                                    imageUrl: imageUrl,
                                    link: localLink
                                } as Track,
                                statefulOnClick: () => {}
                            };
                        });
                        setTracks(newTracks);

                        const newCache = new Map(cache);
                        newCache.set(localLink, newTracks);
                        setCache(newCache);
                    })
                    .catch(axiosCatcher(toast, 'при загрузке альбома'));
            } else if (cached === true) {
                setExists(true);
            } else {
                setTracks(cached as RenderTrack[]);
            }
            return;
        }

        setAlbum(undefined);
        setTracks([]);
    }, [link]);

    const send = () => {
        if (album === undefined) {
            toast({
                element: (
                    <ErrorToast
                        icon
                        before='Ошибка'
                        field='при загрузке альбома.'
                        after='Введите валидную ссылку!'
                    />
                ),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }

        axiosSession
            .post(`/track/upload/yandex_music?albumId=${album.id}`)
            .then(() => {
                toast({
                    element: (
                        <BaseToast
                            image={`https://${album.coverUri.replace('%%', '100x100')}`}
                            field={album.title}
                            after='успешно загружен'
                        />
                    )
                });

                setExists(true);
                setTracks([]);

                const newCache = new Map(cache);
                newCache.set(`https://music.yandex.ru/album/${album.id}`, true);
                setCache(newCache);
            })
            .catch(axiosCatcher(toast, 'при загрузке альбома'));
    };

    return (
        <section className='flex flex-col gap-y-6 flex-1 overflow-auto pr-[35px]'>
            <div className='w-full flex gap-x-12 flex-1'>
                <div className='w-full flex flex-col flex-1 justify-between p-4'>
                    <div>
                        <Label className='font-medium text-onSurfaceVariant'>
                            Ссылка на трек в Яндекс Музыке
                        </Label>
                        <Input
                            placeholder='Вставьте ссылку на трек или альбом с Яндекс.Музыки'
                            startIcon={LinkIcon}
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />

                        {tracks.map((track) => (
                            <TrackSmallThumb
                                key={track.track.id}
                                track={track.track}
                                selected={false}
                            />
                        ))}

                        {exists && 'Этот альбом уже загружен'}
                    </div>

                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6 mt-auto'>
                        <Button className='w-[460px]' onClick={() => send()} disabled={!agree}>
                            Опубликовать
                        </Button>
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
                    </div>
                </div>
            </div>
        </section>
    );
}
