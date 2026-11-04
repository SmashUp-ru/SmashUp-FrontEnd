import { describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useCachedEntityById } from '@/store/entities/useCachedEntity.ts';

type E = { id: number };

describe('useCachedEntityById', () => {
    it('в кэше — отдаёт сразу и не грузит', () => {
        const get = vi.fn();
        const { result } = renderHook(() => useCachedEntityById<E>('5', get, { 5: { id: 5 } }));
        expect(result.current.entity).toEqual({ id: 5 });
        expect(result.current.isLoading).toBe(false);
        expect(get).not.toHaveBeenCalled();
    });

    it('нет в кэше — грузит; появилось в кэше — отдаёт', () => {
        const get = vi.fn().mockResolvedValue({ id: 5 });
        const { result, rerender } = renderHook(
            ({ cache }) => useCachedEntityById<E>('5', get, cache),
            { initialProps: { cache: {} as Record<number, E> } }
        );
        expect(get).toHaveBeenCalledWith(5);
        expect(result.current.isLoading).toBe(true);

        rerender({ cache: { 5: { id: 5 } } });
        expect(result.current.entity).toEqual({ id: 5 });
        expect(result.current.isLoading).toBe(false);
    });

    it('ошибка — isError без вечного скелетона, reload повторяет', async () => {
        const get = vi.fn().mockRejectedValue(new Error('404'));
        const { result } = renderHook(() => useCachedEntityById<E>('5', get, {}));
        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.isLoading).toBe(false);

        act(() => result.current.reload());
        expect(get).toHaveBeenCalledTimes(2);
    });

    it('без id — не грузит и не «загружается»', () => {
        const get = vi.fn();
        const { result } = renderHook(() => useCachedEntityById<E>(undefined, get, {}));
        expect(result.current.isLoading).toBe(false);
        expect(get).not.toHaveBeenCalled();
    });
});
