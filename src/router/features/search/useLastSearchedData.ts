import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useLastSearchedData() {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    interface SearchHistoryElement {
        href: string;
        type: 'user' | 'mashup' | 'playlist';
        id: string;
    }

    interface SearchHistoryObjectsElement {
        type: 'user' | 'mashup' | 'playlist';
        object: User | Mashup | Playlist;
    }

    const getPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getUsersByIds = useUserStore((state) => state.getManyByIds);

    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getUserById = useUserStore((state) => state.getOneById);

    const [searchHistory, setSearchHistory] = useState<SearchHistoryElement[]>([]);
    const [searchHistoryObjects, setSearchHistoryObjects] = useState<SearchHistoryObjectsElement[]>(
        []
    );

    useEffect(() => {
        const loadInitialData = async () => {
            setIsHistoryLoading(true);
            startLoading();

            const savedHistory = localStorage.getItem('search_history');
            const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
            setSearchHistory(parsedHistory);

            if (parsedHistory.length === 0) {
                setIsHistoryLoading(false);
                updateIsLoading(false);
                return;
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const loadHistoryObjects = async () => {
            if (!searchHistory.length) return;

            const userIds: number[] = [];
            const mashupIds: number[] = [];
            const playlistIds: number[] = [];

            searchHistory.forEach((elem) => {
                const id = parseInt(elem.id);
                switch (elem.type) {
                    case 'user':
                        userIds.push(id);
                        break;
                    case 'mashup':
                        mashupIds.push(id);
                        break;
                    case 'playlist':
                        playlistIds.push(id);
                        break;
                }
            });

            try {
                await Promise.all([
                    getPlaylistsByIds(playlistIds),
                    getMashupsByIds(mashupIds),
                    getUsersByIds(userIds, true)
                ]);

                const objectPromises = searchHistory.map(async (elem) => {
                    const id = parseInt(elem.id);
                    switch (elem.type) {
                        case 'user':
                            return { type: 'user' as const, object: await getUserById(id) };
                        case 'mashup':
                            return { type: 'mashup' as const, object: await getMashupById(id) };
                        case 'playlist':
                            return { type: 'playlist' as const, object: await getPlaylistById(id) };
                    }
                });

                const results = await Promise.all(objectPromises);
                setSearchHistoryObjects(results.filter(Boolean));
            } catch (error) {
                console.error('Error loading history objects:', error);
            } finally {
                setIsHistoryLoading(false);
                updateIsLoading(false);
            }
        };

        loadHistoryObjects();
    }, [searchHistory]);

    return {
        isLoading: isHistoryLoading,
        searchHistory,
        searchHistoryObjects
    };
}
