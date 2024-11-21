import { useParams } from 'react-router-dom';
import MashupCollection from '@/router/features/mashupCollection/MashupCollection.tsx';
import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';

export default function ProfileTracksPage() {
    const params = useParams();

    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [user, setUser] = useState<User | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        if (params.profileUsername) {
            getUserByUsername(params.profileUsername).then((r) => setUser(r));
        }
    }, [params.profileUsername]);

    useEffect(() => {
        if (user) {
            getMashupsByIds(user.mashups).then((r) => setMashups(r));
        }
    }, [user]);

    if (!params.profileUsername) return;
    if (!user) return;

    return (
        <MashupCollection
            title='Коллекция'
            name={user.username}
            image={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
        >
            {mashups.map((mashup) => (
                <MashupSmallThumb key={mashup.id} {...mashup} />
            ))}
        </MashupCollection>
    );
}
