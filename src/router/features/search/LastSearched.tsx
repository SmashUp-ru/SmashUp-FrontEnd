import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import UserSmallThumb from '@/router/shared/user/UserSmallThumb.tsx';
import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
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
    const getUsersByStringKeys = useUserStore((state) => state.getManyByStringKeys);

    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getUserByStringKey = useUserStore((state) => state.getOneByStringKey);

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
            const userIds: string[] = [];
            const mashupIds: number[] = [];
            const playlistIds: number[] = [];

            searchHistory.forEach((elem) => {
                switch (elem.type) {
                    case 'user':
                        userIds.push(elem.id);
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
                await getUsersByStringKeys('username', userIds, true);
            };

            loadData().then(() => {
                searchHistory.forEach((elem) => {
                    switch (elem.type) {
                        case 'user':
                            getUserByStringKey('username', elem.id).then((r) =>
                                setSearchHistoryObjects([
                                    {
                                        type: 'user',
                                        object: r
                                    },
                                    ...searchHistoryObjects
                                ])
                            );
                            break;
                        case 'mashup':
                            getMashupById(parseInt(elem.id)).then((r) =>
                                setSearchHistoryObjects([
                                    {
                                        type: 'mashup',
                                        object: r
                                    },
                                    ...searchHistoryObjects
                                ])
                            );
                            break;
                        case 'playlist':
                            getPlaylistById(parseInt(elem.id)).then((r) =>
                                setSearchHistoryObjects([
                                    {
                                        type: 'playlist',
                                        object: r
                                    },
                                    ...searchHistoryObjects
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
                {searchHistoryObjects.map((element) => {
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
                            return <PlaylistSmallThumb playlist={element.object as Playlist} />;
                    }
                })}
            </div>
        </div>
    );
}
