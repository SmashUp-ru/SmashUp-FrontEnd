import { axiosSession } from '@/lib/utils.ts';
import { useNavigate } from 'react-router-dom';
import MashupForm, { MashupFormBody } from '@/router/shared/mashup/MashupForm';

export default function UploadMashupPage() {
    const navigate = useNavigate();

    return (
        <MashupForm
            initial={{
                name: '',
                explicit: false,
                banWords: false,
                selectedGenres: [],
                selectedTracks: [],
                selectedUsers: [],
                statusLink: '',
                agree: false
            }}
            handleLoggedUser={true}
            handleTracksUrls={true}
            handleMashupFile={true}
            requireImageFile={true}
            onClick={(body: MashupFormBody) => {
                axiosSession
                    .post('/mashup/upload', {
                        ...body,
                        albumId: -1
                    })
                    .then(() => navigate('/mashup/upload/success'));
            }}
        />
    );
}
