import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { useEventStore, type SmashUpEvent } from '@/store/entities/event.ts';
import { normalizeTicketDesign, type TicketDesign } from '@/store/ticketDrafts.ts';
import { useTicketDesign } from './useTicketDesign.ts';

vi.mock('@/lib/utils.ts', () => ({ axiosSession: { get: vi.fn(), post: vi.fn() } }));
vi.mock('@/router/shared/hooks/use-toast.ts', () => ({ toast: vi.fn() }));
vi.mock('@/router/shared/toasts/axios.tsx', () => ({
    axiosCatcher: vi.fn(() => (error: unknown) => {
        throw error;
    })
}));

const envelope = (design: TicketDesign | null) => ({
    data: { status: 'ok', response: { design } }
});

beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(axiosSession.get).mockResolvedValue(envelope(null));
    vi.mocked(axiosSession.post).mockImplementation(async (_url, body) => envelope(body.design));
    vi.spyOn(useEventStore.getState(), 'getOneById').mockResolvedValue({ id: 7 } as SmashUpEvent);
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.resetAllMocks();
});

async function load() {
    const hook = renderHook(() => useTicketDesign(7));
    await act(async () => {});
    return hook;
}

const advance = (ms = 1000) => act(() => vi.advanceTimersByTimeAsync(ms));

describe('сохранение дизайна мероприятия', () => {
    it('читает envelope, null превращает в дефолт, загрузку не сохраняет', async () => {
        const { result } = await load();
        expect(useEventStore.getState().getOneById).toHaveBeenCalledWith(7);
        expect(axiosSession.get).toHaveBeenCalledWith('/ticket/design', { params: { event: 7 } });
        expect(result.current.design).toEqual(normalizeTicketDesign(null));
        await advance();
        expect(axiosSession.post).not.toHaveBeenCalled();
    });

    it('объединяет быстрые изменения и шлёт только design спустя секунду', async () => {
        const { result } = await load();
        act(() => result.current.update((d) => ({ ...d, capacity: 100 })));
        await advance(600);
        act(() => result.current.update((d) => ({ ...d, backText: 'Вход с 20:00' })));
        await advance(999);
        expect(axiosSession.post).not.toHaveBeenCalled();
        expect(result.current.status).toBe('saving');
        await advance(1);
        expect(axiosSession.post).toHaveBeenCalledExactlyOnceWith(
            '/ticket/design',
            { design: { ...normalizeTicketDesign(null), capacity: 100, backText: 'Вход с 20:00' } },
            { params: { event: 7 } }
        );
        expect(result.current.status).toBe('saved');
    });

    it('сохраняет по очереди и не затирает правку ответом старого запроса', async () => {
        let resolve!: (value: ReturnType<typeof envelope>) => void;
        vi.mocked(axiosSession.post).mockImplementationOnce(
            () =>
                new Promise((r) => {
                    resolve = r;
                })
        );
        const { result } = await load();
        act(() => result.current.update((d) => ({ ...d, capacity: 100 })));
        await advance();
        act(() => result.current.update((d) => ({ ...d, capacity: 200 })));
        await advance();
        expect(axiosSession.post).toHaveBeenCalledTimes(1);
        await act(async () => resolve(envelope({ ...normalizeTicketDesign(null), capacity: 100 })));
        expect(axiosSession.post).toHaveBeenCalledTimes(2);
        expect(result.current.design?.capacity).toBe(200);
        expect(result.current.status).toBe('saved');
    });

    it('ошибка сохраняет правки, повтор отправляет их снова', async () => {
        vi.mocked(axiosSession.post).mockRejectedValueOnce(new AxiosError('Нет сети'));
        const { result } = await load();
        act(() => result.current.update((d) => ({ ...d, capacity: 100 })));
        await advance();
        expect(result.current.status).toBe('error');
        expect(result.current.design?.capacity).toBe(100);
        act(() => result.current.retry());
        await advance();
        expect(result.current.status).toBe('saved');
        expect(axiosSession.post).toHaveBeenCalledTimes(2);
    });

    it('после ошибки GET повторяет загрузку, пустой дизайн не отправляет', async () => {
        vi.mocked(axiosSession.get).mockRejectedValueOnce(new AxiosError('Нет сети'));
        const { result } = await load();
        expect(result.current.loadError).toBe(true);
        expect(result.current.design).toBeNull();
        await act(async () => result.current.reload());
        expect(result.current.loadError).toBe(false);
        expect(result.current.design).toEqual(normalizeTicketDesign(null));
        expect(axiosSession.post).not.toHaveBeenCalled();
    });
});
