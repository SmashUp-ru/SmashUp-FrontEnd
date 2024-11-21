import { create } from 'zustand/index';
import axios from 'axios';

interface CachingEntity {
    id: number;
}

export function createEntityStore<T extends CachingEntity>(apiPath: string) {
    type CacheStore = {
        cache: Record<number, T>;
        getManyByIds: (ids: number[]) => Promise<T[]>;
        getOneById: (id: number) => Promise<T>;
        fetchAndCacheMany: (ids: number[]) => Promise<T[]>;
    };

    return create<CacheStore>((set, get) => ({
        cache: {},

        getOneById: async (id: number): Promise<T> => {
            const cache = get().cache;
            const obj = cache[id];

            if (obj) {
                return obj;
            }

            await get().fetchAndCacheMany([id]);
            return get().cache[id];
        },

        getManyByIds: async (ids: number[]): Promise<T[]> => {
            const cache = get().cache;
            const missingIds = ids.filter((id) => !cache[id]);

            if (missingIds.length === 0) {
                console.log('Cache hit for all IDs');
                return ids.map((id) => cache[id]);
            }

            await get().fetchAndCacheMany(missingIds);

            return ids.map((id) => get().cache[id]);
        },

        fetchAndCacheMany: async (ids: number[]): Promise<T[]> => {
            console.log(`Fetching data for IDs: ${ids}`);
            try {
                const response = await axios.get<{
                    status: string;
                    response: T[];
                }>(`${import.meta.env.VITE_BACKEND_URL}/${apiPath}?id=${ids}`);

                const fetchedData = response.data;

                set((state) => ({
                    cache: {
                        ...state.cache,
                        ...fetchedData.response.reduce(
                            (acc, obj) => {
                                acc[obj.id] = obj;
                                return acc;
                            },
                            {} as Record<number, T>
                        )
                    }
                }));

                return fetchedData.response;
            } catch (error) {
                console.error(`Failed to fetch data for IDs: ${ids}`, error);
                throw new Error('Failed to fetch data');
            }
        }
    }));
}

export function createEntityStoreWithStringKey<T extends CachingEntity>(
    apiPath: string,
    keyName: string
) {
    type CacheStore = {
        cache: Record<number, T>;
        secondKeyMap: Record<string, T>;

        getOneById: (id: number) => Promise<T>;
        getOneByStringKey: (key: string) => Promise<T>;
        fetchAndCacheMany: (ids: number[]) => Promise<T[]>;
    };

    return create<CacheStore>((set, get) => ({
        cache: {},
        secondKeyMap: {},

        getOneById: async (id: number): Promise<T> => {
            const cache = get().cache;
            const obj = cache[id];

            if (obj) {
                return obj;
            }

            await get().fetchAndCacheMany([id]);
            return get().cache[id];
        },

        getOneByStringKey: async (key: string): Promise<T> => {
            const secondKeyMap = get().secondKeyMap;
            const obj = secondKeyMap[key];

            if (obj) {
                return obj;
            }

            try {
                const response = await axios.get<{
                    status: string;
                    response: T;
                }>(`${import.meta.env.VITE_BACKEND_URL}/${apiPath}?${keyName}=${key}`);

                const fetchedData = response.data.response;

                set((state) => ({
                    cache: {
                        ...state.cache,
                        [fetchedData.id]: fetchedData
                    }
                }));

                return fetchedData;
            } catch (error) {
                console.error(`Failed to fetch data for key: ${key}`, error);
                throw new Error('Failed to fetch data');
            }
        },

        fetchAndCacheMany: async (ids: number[]): Promise<T[]> => {
            console.log(`Fetching data for IDs: ${ids}`);
            try {
                const response = await axios.get<{
                    status: string;
                    response: T[];
                }>(`${import.meta.env.VITE_BACKEND_URL}/${apiPath}?id=${ids}`);

                const fetchedData = response.data;

                set((state) => ({
                    cache: {
                        ...state.cache,
                        ...fetchedData.response.reduce(
                            (acc, obj) => {
                                acc[obj.id] = obj;
                                return acc;
                            },
                            {} as Record<number, T>
                        )
                    }
                }));

                return fetchedData.response;
            } catch (error) {
                console.error(`Failed to fetch data for IDs: ${ids}`, error);
                throw new Error('Failed to fetch data');
            }
        }
    }));
}
