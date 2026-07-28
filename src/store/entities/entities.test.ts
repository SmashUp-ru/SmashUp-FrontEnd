import { describe, it, expect, beforeEach, vi } from 'vitest';

// Мокаем axiosSession до импорта фабрики (vi.hoisted поднимает get выше vi.mock).
const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/lib/utils.ts', () => ({
    axiosSession: { get }
}));

import { createEntityStore } from '@/store/entities/entities.ts';

interface Item {
    id: number;
    name: string;
    slug?: string;
}

const manyResponse = (items: Item[]) => ({ data: { status: 'OK', response: items } });
const oneResponse = (item: Item) => ({ data: { status: 'OK', response: item } });

beforeEach(() => {
    get.mockReset();
});

describe('createEntityStore — характеризация кэша', () => {
    it('getOneById фетчит один раз и кэширует', async () => {
        get.mockResolvedValueOnce(manyResponse([{ id: 1, name: 'a' }]));
        const useStore = createEntityStore<Item>('item/get');

        const first = await useStore.getState().getOneById(1);
        expect(first).toEqual({ id: 1, name: 'a' });

        const second = await useStore.getState().getOneById(1);
        expect(second).toEqual({ id: 1, name: 'a' });
        expect(get).toHaveBeenCalledTimes(1);
    });

    it('getManyByIds возвращает элементы в порядке входных id', async () => {
        get.mockResolvedValueOnce(
            manyResponse([
                { id: 2, name: 'b' },
                { id: 1, name: 'a' }
            ])
        );
        const useStore = createEntityStore<Item>('item/get');

        const result = await useStore.getState().getManyByIds([1, 2]);
        expect(result.map((r) => r.id)).toEqual([1, 2]);
        expect(get).toHaveBeenCalledTimes(1);
    });

    it('дедуплицирует параллельные запросы одного id', async () => {
        let resolveFn: (v: unknown) => void = () => {};
        get.mockReturnValueOnce(
            new Promise((res) => {
                resolveFn = res;
            })
        );
        const useStore = createEntityStore<Item>('item/get');

        const p1 = useStore.getState().getOneById(1);
        const p2 = useStore.getState().getOneById(1);
        resolveFn(manyResponse([{ id: 1, name: 'a' }]));
        await Promise.all([p1, p2]);

        expect(get).toHaveBeenCalledTimes(1);
    });

    it('ждёт уже начатый запрос при частичном пересечении batch-запросов', async () => {
        let resolveFirst: (value: unknown) => void = () => {};
        get.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveFirst = resolve;
                })
        );
        get.mockResolvedValueOnce(manyResponse([{ id: 3, name: 'c' }]));
        const useStore = createEntityStore<Item>('item/get');

        const first = useStore.getState().getManyByIds([1, 2]);
        const second = useStore.getState().getManyByIds([2, 3]);
        let secondSettled = false;
        void second.then(() => {
            secondSettled = true;
        });

        await Promise.resolve();
        expect(secondSettled).toBe(false);

        resolveFirst(
            manyResponse([
                { id: 1, name: 'a' },
                { id: 2, name: 'b' }
            ])
        );

        await expect(first).resolves.toEqual([
            { id: 1, name: 'a' },
            { id: 2, name: 'b' }
        ]);
        await expect(second).resolves.toEqual([
            { id: 2, name: 'b' },
            { id: 3, name: 'c' }
        ]);
        expect(get).toHaveBeenCalledTimes(2);
    });

    it('не возвращает undefined, если API не прислал часть запрошенных id', async () => {
        get.mockResolvedValueOnce(manyResponse([{ id: 1, name: 'a' }]));
        const useStore = createEntityStore<Item>('item/get');

        await expect(useStore.getState().getManyByIds([1, 2])).resolves.toEqual([
            { id: 1, name: 'a' }
        ]);
    });

    it('батчит id чанками по 100', async () => {
        get.mockImplementation((url: string) => {
            const idPart = url.split('id=')[1] ?? '';
            const items = idPart.split(',').map((s) => ({ id: Number(s), name: `n${s}` }));
            return Promise.resolve(manyResponse(items));
        });
        const useStore = createEntityStore<Item>('item/get');
        const ids = Array.from({ length: 250 }, (_, i) => i + 1);

        const result = await useStore.getState().getManyByIds(ids);
        expect(result).toHaveLength(250);
        expect(get).toHaveBeenCalledTimes(3); // 100 + 100 + 50
    });

    it('getOneByStringKey индексирует по доп. ключу и переиспользует индекс', async () => {
        get.mockResolvedValueOnce(oneResponse({ id: 7, name: 'g', slug: 'golf' }));
        const useStore = createEntityStore<Item>('item/get', ['slug']);

        const byKey = await useStore.getState().getOneByStringKey('slug', 'golf');
        expect(byKey.id).toBe(7);

        const again = await useStore.getState().getOneByStringKey('slug', 'golf');
        expect(again.id).toBe(7);
        expect(get).toHaveBeenCalledTimes(1);
    });

    it('updateOneById мёржит частичные данные; reset чистит кэш', async () => {
        get.mockResolvedValueOnce(manyResponse([{ id: 1, name: 'a' }]));
        const useStore = createEntityStore<Item>('item/get');
        await useStore.getState().getOneById(1);

        useStore.getState().updateOneById(1, { name: 'updated' });
        expect(useStore.getState().cache[1].name).toBe('updated');

        useStore.getState().reset();
        expect(useStore.getState().cache).toEqual({});
        expect(useStore.getState().pendingRequests).toEqual({});
    });
});
