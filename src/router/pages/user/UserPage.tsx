import { useParams } from 'react-router-dom';
import User from '@/router/features/user/User.tsx';

export default function UserPage() {
    const params = useParams();

    if (!params.profileUsername) return;

    return <User username={params.profileUsername} />;
}
