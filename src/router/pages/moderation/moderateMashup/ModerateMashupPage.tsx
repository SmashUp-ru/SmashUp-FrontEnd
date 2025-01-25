import { useNavigate, useParams } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/components/mashup/MashupForm';
import { User, useUserStore } from '@/store/entities/user';
import { useEffect, useState } from 'react';
import { loadSelectedTracks, SelectedTrack } from '@/router/shared/types/upload';
import MashupFormSkeleton from '@/router/shared/components/mashup/MashupFormSkeleton';
import { useTrackStore } from '@/store/entities/track';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation';
import { axiosSession } from '@/lib/utils';
import { AxiosResponse } from 'axios';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useToast } from '@/router/shared/hooks/use-toast';
import { getToken } from '@/store/global';
import { SmashUpResponse } from '@/router/shared/types/smashup';

export default function ModerateMashupPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [mashup, setMashup] = useState<UnpublishedMashup>();

    const unpublishedMashups = useModerationStore((state) => state.unpublishedMashups);
    const updateUnpublishedMashups = useModerationStore((state) => state.updateUnpublishedMashups);

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

    const userStore = useUserStore();
    const trackStore = useTrackStore();
    // TODO: create store for Yandex playlists and tracks

    useEffect(() => {
        if (mashup === undefined) {
            return;
        }

        userStore.getManyByIds(mashup.authorsIds, true).then(setUsers);

        loadSelectedTracks(mashup, trackStore).then(setTracks);
    }, [mashup]);

    if (
        unpublishedMashups === undefined ||
        unpublishedMashups === null ||
        mashup === undefined ||
        users === undefined ||
        tracks === undefined
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
                basedImage: `${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${mashup.id}_800x800.png?token=${getToken()}`
            }}
            text={{
                title: 'Редактирование неопубликованного мэшапа',
                button: 'Изменить',
                toast: {
                    before: '',
                    field: 'Мэшап',
                    after: 'редактируется...'
                }
            }}
            handleLoggedUser={false}
            handleTracksUrls={true}
            handleMashupFile={false}
            requireImageFile={false}
            showTracksIcons={true}
            lockStatusLink={false}
            onClick={(body: MashupFormBody) => {
                return axiosSession
                    .post('/moderation/unpublished_mashup/edit', {
                        id: mashup.id,
                        ...body,
                        albumId: -1
                    })
                    .then((r: AxiosResponse<SmashUpResponse<UnpublishedMashup>>) => {
                        const newMashup = r.data.response;

                        updateUnpublishedMashups(
                            unpublishedMashups.map((mashup) =>
                                mashup.id === newMashup.id ? newMashup : mashup
                            )
                        );

                        navigate('/mashup/moderation');
                    })
                    .catch(axiosCatcher(toast, 'при редактировании мэшапа'));
            }}
        />
    );
}
