import { useParams } from 'react-router-dom';
import Profile from '@/router/features/profile/Profile.tsx';

export default function ProfilePage() {
    const params = useParams();

    if (!params.profileUsername) return;

    return <Profile username={params.profileUsername} />;
}
