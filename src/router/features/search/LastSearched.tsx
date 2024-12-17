import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import UserSmallThumb from '@/router/shared/user/UserSmallThumb.tsx';
import { useEffect, useState } from 'react';
import { User } from '@/store/entities/user.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { Playlist } from '@/store/entities/playlist.ts';

export default function LastSearched() {
    interface searchHistoryElement {
        href: string;
        type: 'user' | 'mashup' | 'playlist';
        object: User | Mashup | Playlist;
    }

    const [searchHistory, setSearchHistory] = useState<searchHistoryElement[]>([]);

    useEffect(() => {
        const searchHistory = localStorage.getItem('search_history');
        setSearchHistory(searchHistory ? JSON.parse(searchHistory) : []);
    }, []);

    if (!searchHistory) return <div>История пуста!</div>;

    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                {searchHistory.map((element) => {
                    switch (element.type) {
                        case 'user':
                            return <UserSmallThumb user={element.object as User} />;

                        case 'mashup':
                            return (
                                <MashupSmallThumb
                                    mashup={element.object as Mashup}
                                    playlist={[element.object.id]}
                                    indexInPlaylist={0}
                                    playlistName='История поиска'
                                    queueId='searchHistory'
                                />
                            );

                        case 'playlist':
                            return <div>Плейлист {(element.object as Playlist).name}</div>;
                    }
                })}
            </div>
        </div>
    );
}
