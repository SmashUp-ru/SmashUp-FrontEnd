import { useNavigate, useParams } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/components/mashup/MashupForm';
import { User, useUserStore } from '@/store/entities/user';
import { useEffect, useState } from 'react';
import {
    SelectedTrack,
    SmashUpSelectedTrack,
    YandexMusicSelectedTrack,
    YouTubeSelectedTrack
} from '@/router/shared/types/upload';
import MashupFormSkeleton from '@/router/shared/components/mashup/MashupFormSkeleton';
import { Track, useTrackStore } from '@/store/entities/track';
import { RegEx } from '@/lib/regex';
import { loadOEmbed } from '@/lib/youtube';
import { UnpublishedMashup } from '@/store/moderation';
import { useModeration } from '../useModeration';
import { axiosSession } from '@/lib/utils';
import { AxiosResponse } from 'axios';
import { YandexTracksResponse } from '@/router/shared/types/yandex';

export default function ModerateMashupPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [mashup, setMashup] = useState<UnpublishedMashup>();

    const { unpublishedMashups } = useModeration();

    useEffect(() => {
        if (unpublishedMashups !== null) {
            const mashup = unpublishedMashups.filter(
                (mashup) => mashup.id.toString() === params.mashupId
            );

            if (mashup.length !== 0) {
                setMashup(mashup[0]);
            }
        }
    }, [unpublishedMashups]);

    const [users, setUsers] = useState<User[]>();
    const [tracks, setTracks] = useState<SelectedTrack[]>();
    const [image, setImage] = useState<string>();

    const userStore = useUserStore();
    const trackStore = useTrackStore();
    // TODO: create store for Yandex playlists and tracks

    useEffect(() => {
        if (mashup === undefined) {
            return;
        }

        userStore.getManyByIds(mashup.authorsIds, true).then(setUsers);

        const yandexTracks = mashup.tracksUrls
            .map((url) => {
                const match = url.match(RegEx.YANDEX_MUSIC_TRACK);
                if (match) {
                    return [url, match[2]];
                } else {
                    return undefined;
                }
            })
            .filter((url) => url) as string[][];

        Promise.all([
            trackStore
                .getManyByIds(mashup.tracks)
                .then((tracks) => tracks.map((track) => new SmashUpSelectedTrack(track))),
            yandexTracks && yandexTracks.length > 0
                ? axiosSession
                      .get(
                          `/track/get/yandex_music?id=${yandexTracks.map((item) => item[1]).join(',')}`
                      )
                      .then((r: AxiosResponse<YandexTracksResponse>) => {
                          return r.data.response.map(
                              (track, index) =>
                                  new YandexMusicSelectedTrack({
                                      id: -track.id,
                                      name: track.name,
                                      authors: track.authors.map((author) => author.name),
                                      imageUrl: `https://${track.albums[0].coverUri.replace('%%', '100x100')}`,
                                      link: yandexTracks[index][0]
                                  } as Track)
                          );
                      })
                : Promise.resolve([]),
            Promise.all(
                mashup.tracksUrls
                    .map((url) => {
                        if (RegEx.YOUTUBE.test(url)) {
                            return loadOEmbed(url).then((track) => new YouTubeSelectedTrack(track));
                        } else if (RegEx.YANDEX_MUSIC_TRACK.test(url)) {
                            return null;
                        } else {
                            throw new Error(`${url} is not supported`);
                        }
                    })
                    .filter((track) => track !== null)
            )
        ]).then((result) => {
            const [smashUpTracks, yandexTracks, youTubeTracks] = result;

            setTracks(
                (smashUpTracks as SelectedTrack[])
                    .concat(yandexTracks)
                    .concat(youTubeTracks as YouTubeSelectedTrack[])
            );
        });

        axiosSession
            .get(
                `${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${mashup.id}_800x800.png`,
                {
                    responseType: 'blob'
                }
            )
            .then((r: AxiosResponse<Blob>) => {
                setImage(URL.createObjectURL(r.data));
            });
    }, [mashup]);

    if (
        unpublishedMashups === undefined ||
        mashup === undefined ||
        users === undefined ||
        tracks === undefined ||
        image === undefined
    ) {
        return <MashupFormSkeleton />;
    }

    return (
        <MashupForm
            initial={{
                name: mashup.name,
                explicit: undefined,
                banWords: undefined,
                statuses: mashup.statuses,
                selectedGenres: mashup.genres,
                selectedTracks: tracks,
                selectedUsers: users,
                statusLink:
                    mashup.statusesUrls && mashup.statusesUrls.length > 0
                        ? mashup.statusesUrls[0]
                        : '',
                agree: true,
                basedImage: image
            }}
            text={{
                title: 'Редактирование неопубликованного мэшапа',
                button: 'Изменить'
            }}
            handleLoggedUser={false}
            handleTracksUrls={false}
            handleMashupFile={false}
            requireImageFile={false}
            showTracksIcons={true}
            lockStatusLink={true}
            onClick={(body: MashupFormBody) => {
                axiosSession
                    .post('/moderation/unpublished_mashup/edit', {
                        id: mashup.id,
                        ...body,
                        albumId: -1
                    })
                    .then(() => {
                        navigate('/mashup/moderation');
                    });
            }}
        />
    );
}
