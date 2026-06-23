import { create } from 'zustand';
import { axiosSession } from '@/lib/utils.ts';

interface CachingEntity {
    id: number;
}

/**
 * Контракт стора-кэша сущности.
 *
 * - `cache` — основной id-индексированный кэш (`Record<number, T>`).
 * - `additionalCache` — вторичные строковые индексы вида `keyName -> (значение строкового ключа -> id)`;
 *   создаются под каждый `keyName`, переданный в `createEntityStore` (напр. `username`/`token` у user-стора).
 *   Хранят НЕ сам объект, а только id — реальные данные всегда лежат в `cache`.
 * - `pendingRequests` — реестр in-flight промисов для дедупликации; ключ это либо `id` (число),
 *   либо `"keyName:key"` (строка) для запросов по строковому ключу.
 */
export type CacheStore<T> = {
    cache: Record<number, T>;
    additionalCache: Record<string, Record<string, number>>;
    pendingRequests: Record<number | string, Promise<T | T[]>>;

    getManyByIds: (ids: number[], needToBeModified?: boolean) => Promise<T[]>;
    getOneById: (id: number) => Promise<T>;
    getOneByStringKey: (keyName: string, key: string) => Promise<T>;

    fetchAndCacheOneByStringKey: (keyName: string, key: string) => Promise<T>;
    fetchAndCacheMany: (ids: number[], needToBeModified?: boolean) => Promise<T[]>;

    updateOneById: (id: number, updatedData: Partial<T> | undefined) => void;

    reset: () => void;
};

/**
 * Фабрика Zustand-стора, дающего id-индексированный кэш сущностей `T` поверх одного API-эндпоинта.
 *
 * Кэш «глупый»: НЕТ TTL и НЕТ инвалидации — сущность, попавшая в `cache`, живёт там до `reset()`.
 * Сервер кэш не синхронит, поэтому после любой мутации запись нужно патчить ВРУЧНУЮ через
 * `updateOneById(id, partial)` — это основной механизм оптимистичных апдейтов.
 *
 * @param apiPath относительный путь эндпоинта (напр. `'mashup/get'`, `'user/get'`); итоговый URL —
 *   `${VITE_BACKEND_URL}/${apiPath}?id=...`. При `needToBeModified` к пути добавляется суффикс `_many`
 *   (бек отдаёт «модифицированный» вариант для batch-запросов).
 * @param keyNames имена полей `T`, под которые заводятся вторичные строковые индексы
 *   (`additionalCache`) — позволяют доставать сущность не по id, а по строке через `getOneByStringKey`
 *   (напр. `['username', 'token']` для user-стора). Поля должны реально присутствовать в ответе API.
 */
export function createEntityStore<T extends CachingEntity>(
    apiPath: string,
    keyNames: string[] = []
) {
    return create<CacheStore<T>>((set, get) => ({
        cache: {},
        additionalCache: keyNames.reduce(
            (acc, key: string) => {
                acc[key] = {};
                return acc;
            },
            {} as Record<string, Record<string, number>>
        ),
        pendingRequests: {},

        /**
         * Возвращает одну сущность по id: сперва из `cache`, иначе ждёт уже летящий запрос
         * (`pendingRequests[id]`), иначе фетчит её через `fetchAndCacheMany([id])`.
         * Так конкурентные вызовы одного id не порождают дублирующих сетевых запросов.
         */
        getOneById: async (id: number): Promise<T> => {
            if (get().cache[id]) {
                return get().cache[id];
            }

            if (get().pendingRequests[id] !== undefined) {
                await get().pendingRequests[id];
                return get().cache[id];
            }

            await get().fetchAndCacheMany([id]);
            return get().cache[id];
        },

        /**
         * Достаёт сущность по вторичному строковому ключу (напр. `getOneByStringKey('username', 'foo')`).
         * Сначала смотрит во вторичный индекс `additionalCache[keyName]` (там лежит id → читаем из `cache`),
         * затем ждёт in-flight запрос с этим же ключом (дедупликация по `"keyName:key"`), и лишь потом
         * фетчит через `fetchAndCacheOneByStringKey`, попутно регистрируя/снимая промис в `pendingRequests`.
         */
        getOneByStringKey: async (keyName: string, key: string): Promise<T> => {
            const stringKey = `${keyName}:${key}`;

            if (get().additionalCache[keyName][key]) {
                return get().cache[get().additionalCache[keyName][key]];
            }

            if (get().pendingRequests[stringKey] !== undefined) {
                await get().pendingRequests[stringKey];
                return get().cache[get().additionalCache[keyName][key]];
            }

            const fetchPromise = get().fetchAndCacheOneByStringKey(keyName, key);

            set((state) => ({
                pendingRequests: {
                    ...state.pendingRequests,
                    [stringKey]: fetchPromise
                }
            }));

            try {
                return await fetchPromise;
            } finally {
                set((state) => {
                    const newPending = { ...state.pendingRequests };
                    delete newPending[stringKey];
                    return { pendingRequests: newPending };
                });
            }
        },

        /**
         * Батч-получение сущностей по списку id. Догружает только отсутствующие в кэше id, затем
         * возвращает результат В ПОРЯДКЕ переданного `ids` (а не в порядке ответа сервера),
         * включая дубликаты исходного массива. `needToBeModified` проксируется в `fetchAndCacheMany`.
         */
        getManyByIds: async (ids: number[], needToBeModified: boolean = false): Promise<T[]> => {
            const missingIds = ids.filter((id) => !get().cache[id]);

            if (!missingIds.length) {
                return ids.map((id) => get().cache[id]);
            }

            await get().fetchAndCacheMany(missingIds, needToBeModified);
            return ids.map((id) => get().cache[id]);
        },

        /**
         * Низкоуровневый загрузчик: дедуплицирует id, бьёт недостающие на чанки по 100
         * (ограничение бека на `?id=1,2,3`) и фетчит чанки параллельно. На каждый чанк регистрирует
         * один общий промис во `pendingRequests` под все его id — чтобы параллельные `getOneById`
         * подцепились к уже летящему запросу. Заполняет и `cache`, и вторичные индексы `additionalCache`
         * (по `keyNames`). При `needToBeModified` дёргает эндпоинт с суффиксом `_many`.
         * Если фетчить нечего — лишь дожидается уже летящих запросов по этим id. Промисы снимаются в `finally`-фазе.
         */
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

            const chunks = [];
            for (let i = 0; i < toFetchIds.length; i += 100) {
                chunks.push(toFetchIds.slice(i, i + 100));
            }

            const fetchPromises = chunks.map((chunk) => {
                const fetchPromise = axiosSession
                    .get<{ status: string; response: T[] }>(
                        `${import.meta.env.VITE_BACKEND_URL}/${apiPath}${needToBeModified ? '_many' : ''}?id=${chunk.join(',')}`
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
                                                if (!acc[keyName]) {
                                                    acc[keyName] = {};
                                                }
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
                        console.error(`Failed to fetch data for chunk: ${chunk}`, error);
                        throw new Error('Failed to fetch data');
                    });

                chunk.forEach((id) => {
                    set((state) => ({
                        pendingRequests: {
                            ...state.pendingRequests,
                            [id]: fetchPromise
                        }
                    }));
                });

                return fetchPromise;
            });

            // pendingRequests чистим в finally: иначе при ошибке фетча в реестре
            // оставался отклонённый промис, и повторная загрузка (retry) вечно
            // падала на `await pendingRequests[id]` вместо нового запроса.
            try {
                const results = await Promise.all(fetchPromises);
                return results.flat();
            } finally {
                set((state) => {
                    const newPending = { ...state.pendingRequests };
                    toFetchIds.forEach((id) => delete newPending[id]);
                    return { pendingRequests: newPending };
                });
            }
        },

        /**
         * Загружает одну сущность по строковому ключу через `?{keyName}={key}` (без суффикса `_many`,
         * это всегда «модифицированный» одиночный объект). Кладёт её в `cache` и в соответствующий
         * вторичный индекс `additionalCache[keyName]`. Если индекс уже знает id — сразу делегирует в `getOneById`.
         */
        fetchAndCacheOneByStringKey: async (keyName: string, key: string): Promise<T> => {
            if (get().additionalCache[keyName][key]) {
                return get().getOneById(get().additionalCache[keyName][key]);
            }

            return axiosSession
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
        },

        /**
         * Ручной патч записи кэша: сливает `updatedData` поверх текущего объекта и кладёт
         * НОВЫЙ объект в `cache[id]` (новая ссылка → подписчики Zustand перерисуются).
         * Основной способ синхронизировать кэш после мутации/оптимистичного апдейта, т.к. сервер кэш не обновляет.
         * Вторичные индексы НЕ трогает — если меняется поле-ключ, его придётся переиндексировать отдельно.
         */
        updateOneById: (id: number, updatedData: Partial<T> | undefined) => {
            const currentData = get().cache[id];
            const newData = { ...currentData, ...updatedData };
            set((state) => ({
                cache: {
                    ...state.cache,
                    [id]: newData
                }
            }));
        },

        /**
         * Полностью обнуляет стор: чистит `cache`, пересоздаёт пустые вторичные индексы по `keyNames`
         * и сбрасывает `pendingRequests`. Вызывается из `resetAppState()` при logout и авто-логауте по 401.
         */
        reset: () =>
            set({
                cache: {},
                additionalCache: keyNames.reduce(
                    (acc, key: string) => {
                        acc[key] = {};
                        return acc;
                    },
                    {} as Record<string, Record<string, number>>
                ),
                pendingRequests: {}
            })
    }));
}
