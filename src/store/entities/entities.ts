import { create } from 'zustand';
import { axiosSession } from '@/lib/utils.ts';

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

        getManyByIds: (ids: number[], needToBeModified?: boolean) => Promise<T[]>;
        getManyByStringKeys: (
            keyName: string,
            keys: string[],
            needToBeModified?: boolean
        ) => Promise<T[]>;
        getOneById: (id: number) => Promise<T>;
        getOneByStringKey: (keyName: string, key: string) => Promise<T>;

        fetchAndCacheOneByStringKey: (keyName: string, key: string) => Promise<T>;
        fetchAndCacheManyByStringKeys: (
            keyName: string,
            keys: string[],
            needToBeModified?: boolean
        ) => Promise<T[]>;
        fetchAndCacheMany: (ids: number[], needToBeModified?: boolean) => Promise<T[]>;

        updateOneById: (id: number, updatedData: Partial<T>) => void;
        updateManyById: (ids: number[], updatedData: Partial<T>[]) => void;
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

        getManyByStringKeys: async (
            keyName: string,
            keys: string[],
            needToBeModified: boolean = false
        ): Promise<T[]> => {
            const missingIds = keys.filter((key) => !get().additionalCache[keyName][key]);

            if (!missingIds.length)
                return keys.map((key) => get().cache[get().additionalCache[keyName][key]]);

            await get().fetchAndCacheManyByStringKeys(keyName, keys, needToBeModified);
            return keys.map((key) => get().cache[get().additionalCache[keyName][key]]);
        },

        getManyByIds: async (ids: number[], needToBeModified: boolean = false): Promise<T[]> => {
            const missingIds = ids.filter((id) => !get().cache[id]);

            if (!missingIds.length) return ids.map((id) => get().cache[id]);

            await get().fetchAndCacheMany(missingIds, needToBeModified);
            return ids.map((id) => get().cache[id]);
        },

        fetchAndCacheMany: async (
            ids: number[],
            needToBeModified: boolean = false
        ): Promise<T[]> => {
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

            const fetchPromise = axiosSession
                .get<{ status: string; response: T[] }>(
                    `${import.meta.env.VITE_BACKEND_URL}/${apiPath}${needToBeModified ? '_many' : ''}?id=${toFetchIds.join(',')}`
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

            const fetchPromise = axiosSession
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
        },

        fetchAndCacheManyByStringKeys: async (
            keyName: string,
            keys: string[],
            needToBeModified: boolean = false
        ): Promise<T[]> => {
            const uniqueKeys = Array.from(new Set(keys));
            const toFetchKeys = uniqueKeys.filter((key) => !get().additionalCache[keyName]?.[key]);

            if (toFetchKeys.length === 0) {
                return uniqueKeys.map((key) => {
                    const id = get().additionalCache[keyName][key];
                    return get().cache[id];
                });
            }

            try {
                const response = await axiosSession.get<{ status: string; response: T[] }>(
                    `${import.meta.env.VITE_BACKEND_URL}/${apiPath}${needToBeModified ? '_many' : ''}?${keyName}=${toFetchKeys.join(',')}`
                );

                const fetchedData = response.data.response;

                set((state) => {
                    const newCache = { ...state.cache };
                    const newAdditionalCache = { ...state.additionalCache };

                    fetchedData.forEach((elem) => {
                        newCache[elem.id] = elem;

                        if (!newAdditionalCache[keyName]) {
                            newAdditionalCache[keyName] = {};
                        }
                        // @ts-expect-error сделано специально, в наличии поля уверен
                        if (elem[keyName]) {
                            // @ts-expect-error сделано специально, в наличии поля уверен
                            newAdditionalCache[keyName][elem[keyName]] = elem.id;
                        }
                    });

                    return {
                        cache: newCache,
                        additionalCache: newAdditionalCache
                    };
                });

                return fetchedData;
            } catch (error) {
                console.error(
                    `Failed to fetch data for keys: ${keyName}=${toFetchKeys.join(',')}`,
                    error
                );
                throw new Error('Failed to fetch data');
            }
        },

        updateOneById: (id: number, updatedData: Partial<T>) => {
            const currentData = get().cache[id];
            const newData = { ...currentData, ...updatedData };
            set((state) => ({
                cache: {
                    ...state.cache,
                    [id]: newData
                }
            }));
        },

        updateManyById: (ids: number[], updatedData: Partial<T>[]) => {
            ids.forEach((id, idx) => {
                const currentData = get().cache[id];
                const newData = { ...currentData, ...updatedData[idx] };
                set((state) => ({
                    cache: {
                        ...state.cache,
                        [id]: newData
                    }
                }));
            });
        }
    }));
}
