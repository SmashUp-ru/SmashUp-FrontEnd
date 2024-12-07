import { create } from 'zustand';
import axios from 'axios';

interface CachingEntity {
    id: number;
}

export function createEntityStore<T extends CachingEntity>(
    apiPath: string,
    keyNames: string[] = []
) {
    type CacheStore = {
        cache: Record<number, T>;
        additionalCache: Record<string, Record<string, number>>;
        pendingRequests: Record<number, Promise<T | T[]>>;

        getManyByIds: (ids: number[]) => Promise<T[]>;
        getOneById: (id: number) => Promise<T>;
        getOneByStringKey: (keyName: string, key: string) => Promise<T>;

        fetchAndCacheOneByStringKey: (keyName: string, key: string) => Promise<T>;
        fetchAndCacheMany: (ids: number[]) => Promise<T[]>;
    };

    return create<CacheStore>((set, get) => ({
        cache: {},
        additionalCache: keyNames.reduce(
            (acc, key: string) => {
                acc[key] = {};
                return acc;
            },
            {} as Record<string, Record<string, number>>
        ),
        pendingRequests: {},

        getOneById: async (id: number): Promise<T> => {
            if (get().cache[id]) return get().cache[id];

            if (get().pendingRequests[id] !== undefined) {
                await get().pendingRequests[id];
                return get().cache[id];
            }

            await get().fetchAndCacheMany([id]);
            return get().cache[id];
        },

        getOneByStringKey: async (keyName: string, key: string): Promise<T> => {
            if (get().additionalCache[keyName][key]) {
                return get().cache[get().additionalCache[keyName][key]];
            }

            await get().fetchAndCacheOneByStringKey(keyName, key);
            return get().cache[get().additionalCache[keyName][key]];
        },

        getManyByIds: async (ids: number[]): Promise<T[]> => {
            const missingIds = ids.filter((id) => !get().cache[id]);

            if (!missingIds.length) return ids.map((id) => get().cache[id]);

            await get().fetchAndCacheMany(missingIds);
            return ids.map((id) => get().cache[id]);
        },

        fetchAndCacheMany: async (ids: number[]): Promise<T[]> => {
            const uniqueIds = Array.from(new Set(ids));
            const toFetchIds = uniqueIds.filter(
                (id) => !get().cache[id] && !get().pendingRequests[id]
            );

            if (!toFetchIds.length) {
                const pendingIds = uniqueIds.filter((id) => get().pendingRequests[id]);
                if (pendingIds.length) {
                    await Promise.all(pendingIds.map((id) => get().pendingRequests[id]));
                }
                return uniqueIds.map((id) => get().cache[id]).filter(Boolean);
            }

            const fetchPromise = axios
                .get<{ status: string; response: T[] }>(
                    `${import.meta.env.VITE_BACKEND_URL}/${apiPath}?id=${toFetchIds.join(',')}`
                )
                .then((response) => {
                    const fetchedData = response.data.response;

                    set((state) => ({
                        cache: {
                            ...state.cache,
                            ...fetchedData.reduce(
                                (acc, obj) => {
                                    acc[obj.id] = obj;
                                    return acc;
                                },
                                {} as Record<number, T>
                            )
                        },
                        additionalCache: {
                            ...state.additionalCache,
                            ...fetchedData.reduce(
                                (acc, obj) => {
                                    keyNames.forEach((keyName) => {
                                        // @ts-expect-error сделано специально, в наличии поля уверен
                                        if (obj[keyName]) {
                                            // @ts-expect-error сделано специально, в наличии поля уверен
                                            acc[keyName][obj[keyName]] = obj.id;
                                        }
                                    });
                                    return acc;
                                },
                                {} as Record<string, Record<string, number>>
                            )
                        }
                    }));
                    return fetchedData;
                })
                .catch((error) => {
                    console.error(`Failed to fetch data for IDs: ${toFetchIds}`, error);
                    throw new Error('Failed to fetch data');
                })
                .finally(() => {
                    set((state) => {
                        const newPending = { ...state.pendingRequests };
                        toFetchIds.forEach((id) => delete newPending[id]);
                        return { pendingRequests: newPending };
                    });
                });

            set((state) => ({
                pendingRequests: {
                    ...state.pendingRequests,
                    ...toFetchIds.reduce(
                        (acc, id) => {
                            acc[id] = fetchPromise;
                            return acc;
                        },
                        {} as Record<number, Promise<T[]>>
                    )
                }
            }));

            return await fetchPromise;
        },

        fetchAndCacheOneByStringKey: async (keyName: string, key: string): Promise<T> => {
            if (get().additionalCache[keyName][key]) {
                return get().getOneById(get().additionalCache[keyName][key]);
            }

            const fetchPromise = axios
                .get<{ status: string; response: T }>(
                    `${import.meta.env.VITE_BACKEND_URL}/${apiPath}?${keyName}=${key}`
                )
                .then((response) => {
                    const fetchedData = response.data.response;
                    set((state) => {
                        return {
                            ...state,
                            cache: {
                                ...state.cache,
                                [fetchedData.id]: fetchedData
                            },
                            additionalCache: {
                                ...state.additionalCache,
                                [keyName]: {
                                    ...state.additionalCache[keyName],
                                    [key]: fetchedData.id
                                }
                            }
                        };
                    });

                    return fetchedData;
                })
                .catch((error) => {
                    console.error(`Failed to fetch data for key: ${keyName}=${key}`, error);
                    throw new Error('Failed to fetch data');
                });

            return await fetchPromise;
        }
    }));
}
