import { useParams } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/mashup/MashupForm';
import { User, useUserStore } from '@/store/entities/user';
import { useEffect, useState } from 'react';
import {
    SelectedTrack,
    SmashUpSelectedTrack,
    YandexMusicSelectedTrack,
    YouTubeSelectedTrack
} from '@/types/api/upload';
import MashupFormSkeleton from '@/router/shared/mashup/MashupFormSkeleton';
import { useTrackStore } from '@/store/entities/track';
import { RegEx } from '@/lib/regex';
import { loadOEmbed } from '@/lib/youtube';
import { UnpublishedMashup } from '@/store/moderation';
import { useModeration } from '../useModeration';
import { axiosSession } from '@/lib/utils';
import { AxiosResponse } from 'axios';

export default function ModerateMashupPage() {
    const params = useParams();

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

    useEffect(() => {
        if (mashup === undefined) {
            return;
        }

        userStore.getManyByIds(mashup.authorsIds, true).then(setUsers);

        Promise.all([
            trackStore
                .getManyByIds(mashup.tracks)
                .then((tracks) => tracks.map((track) => new SmashUpSelectedTrack(track))),
            Promise.all(
                mashup.tracksUrls.map(async (url) => {
                    if (RegEx.YOUTUBE.test(url)) {
                        return loadOEmbed(url).then((track) => new YouTubeSelectedTrack(track));
                    } else if (RegEx.YANDEX_MUSIC_TRACK.test(url)) {
                        return new YandexMusicSelectedTrack(url);
                    } else {
                        throw new Error(`${url} is not supported`);
                    }
                })
            )
        ]).then((result) => {
            const [smashUpTracks, foreignTracks] = result;

            setTracks((smashUpTracks as SelectedTrack[]).concat(foreignTracks));
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
                selectedGenres: mashup.genres,
                selectedTracks: tracks,
                selectedUsers: users,
                statusLink: mashup.statusesUrls ? mashup.statusesUrls[0] : '',
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
            onClick={(body: MashupFormBody) => {
                // axiosSession
                //     .post('/mashup/upload', {
                //         ...body,
                //         albumId: -1
                //     })
                //     .then(() => navigate('/mashup/upload/success'));
                console.log(body);
            }}
        />
    );
}
