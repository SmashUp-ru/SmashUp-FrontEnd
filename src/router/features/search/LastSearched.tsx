import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import ProfileSmallThumb from '@/router/shared/profile/ProfileSmallThumb.tsx';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { User, useUserStore } from '@/store/entities/user.ts';

export default function LastSearched() {
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getUsersByKeys = useUserStore((state) => state.getManyByIds);

    useEffect(() => {
        getMashupsByIds([1, 2, 3]).then((r) => setMashups(r));
    }, []);

    useEffect(() => {
        getUsersByKeys([1, 2, 3]).then((r) => {
            setUsers(r);
        });
    }, []);

    if (!mashups && !users) {
        return;
    }

    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                {mashups.map((mashup, idx) => (
                    <MashupSmallThumb
                        mashup={mashup}
                        playlist={[1, 2, 3]}
                        indexInPlaylist={idx}
                        playlistName='История поиска'
                    />
                ))}
                {users.map((user) => (
                    <ProfileSmallThumb key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}
