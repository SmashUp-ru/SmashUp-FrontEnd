import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const { post, toast } = vi.hoisted(() => ({ post: vi.fn(), toast: vi.fn() }));
vi.mock('@/lib/utils.ts', async (orig) => ({
    ...(await orig<typeof import('@/lib/utils.ts')>()),
    axiosSession: { post }
}));
vi.mock('@/router/shared/hooks/use-toast.ts', () => ({ useToast: () => ({ toast }) }));

import { useLike } from '@/router/shared/hooks/useLike.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useMashupStore, Mashup } from '@/store/entities/mashup.ts';

const mashup = { id: 7, liked: false } as Mashup;
const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));

beforeEach(() => {
    post.mockReset();
    toast.mockReset();
    useMashupStore.getState().reset();
    useMashupStore.setState({ cache: { 7: { ...mashup } } });
    useGlobalStore.setState({ currentUser: { id: 1 } as never });
});

describe('useLike', () => {
    it('гость: тост вместо запроса', () => {
        useGlobalStore.setState({ currentUser: null });
        const { result } = renderHook(() => useLike('mashup', mashup));
        act(() => result.current.toggle());
        expect(post).not.toHaveBeenCalled();
        expect(toast).toHaveBeenCalledOnce();
    });

    it('лайк → снятие лайка обновляют стор', async () => {
        post.mockResolvedValue({});
        const { result } = renderHook(() => useLike('mashup', mashup));

        act(() => result.current.toggle());
        await flush();
        expect(post).toHaveBeenLastCalledWith('mashup/add_like?id=7');
        expect(result.current.isLiked).toBe(true);

        act(() => result.current.toggle());
        await flush();
        expect(post).toHaveBeenLastCalledWith('mashup/remove_like?id=7');
        expect(result.current.isLiked).toBe(false);
        expect(useMashupStore.getState().cache[7].liked).toBe(false);
    });

    it('двойной клик, пока запрос в пути, — один запрос', async () => {
        post.mockResolvedValue({});
        const { result } = renderHook(() => useLike('mashup', mashup));
        act(() => {
            result.current.toggle();
            result.current.toggle();
        });
        await flush();
        expect(post).toHaveBeenCalledOnce();
    });

    it('сердце меняется сразу, до ответа сервера', () => {
        post.mockReturnValue(new Promise(() => {})); // ответ так и не пришёл
        const { result } = renderHook(() => useLike('mashup', mashup));
        act(() => result.current.toggle());
        expect(result.current.isLiked).toBe(true);
    });

    it('ошибка сервера: лайк откатывается, тост, без необработанного reject', async () => {
        post.mockRejectedValue({ status: 500, response: { data: {} } });
        const { result } = renderHook(() => useLike('mashup', mashup));
        act(() => result.current.toggle());
        expect(result.current.isLiked).toBe(true);
        await flush();
        expect(toast).toHaveBeenCalledOnce();
        expect(result.current.isLiked).toBe(false);
    });

    it('сущности нет в кэше — кладётся целиком, а не огрызком { liked }', async () => {
        useMashupStore.setState({ cache: {} });
        post.mockResolvedValue({});
        const full = { id: 7, liked: false, name: 'x', tracks: [1] } as unknown as Mashup;
        const { result } = renderHook(() => useLike('mashup', full));
        act(() => result.current.toggle());
        await flush();
        expect(useMashupStore.getState().cache[7]).toMatchObject({
            name: 'x',
            tracks: [1],
            liked: true
        });
    });
});
