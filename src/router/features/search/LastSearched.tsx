import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import UserSmallThumb from '@/router/shared/user/UserSmallThumb.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import PlaylistSmallThumb from '@/router/shared/playlist/PlaylistSmallThumb.tsx';

export default function LastSearched() {
    interface searchHistoryElement {
        href: string;
        type: 'user' | 'mashup' | 'playlist';
        id: string;
    }

    interface searchHistoryObjectsElement {
        type: 'user' | 'mashup' | 'playlist';
        object: User | Mashup | Playlist;
    }

    const getPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getUsersByIds = useUserStore((state) => state.getManyByIds);

    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getUserById = useUserStore((state) => state.getOneById);

    const [searchHistory, setSearchHistory] = useState<searchHistoryElement[]>([]);
    const [searchHistoryObjects, setSearchHistoryObjects] = useState<searchHistoryObjectsElement[]>(
        []
    );

    useEffect(() => {
        const searchHistory = localStorage.getItem('search_history');
        setSearchHistory(searchHistory ? JSON.parse(searchHistory) : []);
    }, []);

    useEffect(() => {
        if (searchHistory) {
            const userIds: number[] = [];
            const mashupIds: number[] = [];
            const playlistIds: number[] = [];

            searchHistory.forEach((elem) => {
                switch (elem.type) {
                    case 'user':
                        userIds.push(parseInt(elem.id));
                        break;
                    case 'mashup':
                        mashupIds.push(parseInt(elem.id));
                        break;
                    case 'playlist':
                        playlistIds.push(parseInt(elem.id));
                        break;
                }
            });

            const loadData = async () => {
                await getPlaylistsByIds(playlistIds);
                await getMashupsByIds(mashupIds);
                await getUsersByIds(userIds, true);
            };

            loadData().then(() => {
                searchHistory.forEach((elem) => {
                    switch (elem.type) {
                        case 'user':
                            getUserById(parseInt(elem.id)).then((r) =>
                                setSearchHistoryObjects((prev) => [
                                    {
                                        type: 'user',
                                        object: r
                                    },
                                    ...prev
                                ])
                            );
                            break;
                        case 'mashup':
                            getMashupById(parseInt(elem.id)).then((r) =>
                                setSearchHistoryObjects((prev) => [
                                    {
                                        type: 'mashup',
                                        object: r
                                    },
                                    ...prev
                                ])
                            );
                            break;
                        case 'playlist':
                            getPlaylistById(parseInt(elem.id)).then((r) =>
                                setSearchHistoryObjects((prev) => [
                                    {
                                        type: 'playlist',
                                        object: r
                                    },
                                    ...prev
                                ])
                            );
                            break;
                    }
                });
            });
        }
    }, [searchHistory]);

    if (!searchHistory || searchHistory.length === 0) return <div>История пуста!</div>;

    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                {searchHistoryObjects.map((element, idx) => {
                    switch (element.type) {
                        case 'user':
                            return <UserSmallThumb user={element.object as User} key={idx} />;

                        case 'mashup':
                            return (
                                <MashupSmallThumb
                                    mashup={element.object as Mashup}
                                    playlist={[element.object.id]}
                                    indexInPlaylist={0}
                                    playlistName='История поиска'
                                    queueId='searchHistory'
                                    key={idx}
                                />
                            );

                        case 'playlist':
                            return (
                                <PlaylistSmallThumb
                                    playlist={element.object as Playlist}
                                    key={idx}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
}
