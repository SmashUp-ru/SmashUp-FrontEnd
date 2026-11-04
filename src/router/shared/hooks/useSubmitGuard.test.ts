import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';

describe('useSubmitGuard', () => {
    it('двойной клик в одном тике — один сабмит', async () => {
        let resolve!: () => void;
        const submit = vi.fn(() => new Promise<void>((r) => (resolve = r)));
        const { result } = renderHook(() => useSubmitGuard());

        await act(async () => {
            void result.current.guard(submit);
            void result.current.guard(submit);
        });
        expect(submit).toHaveBeenCalledOnce();
        expect(result.current.sent).toBe(true);

        await act(async () => resolve());
        expect(result.current.sent).toBe(false);
    });

    it('после ошибки можно отправить снова', async () => {
        const submit = vi
            .fn()
            .mockRejectedValueOnce(new Error('x'))
            .mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useSubmitGuard());

        await act(async () => {
            await result.current.guard(submit).catch(() => {});
        });
        expect(result.current.sent).toBe(false);

        await act(async () => {
            await result.current.guard(submit);
        });
        expect(submit).toHaveBeenCalledTimes(2);
    });
});
