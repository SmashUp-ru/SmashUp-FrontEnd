import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { toast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import type { SmashUpResponse } from '@/router/shared/types/smashup.ts';
import { useEventStore, type SmashUpEvent } from '@/store/entities/event.ts';
import { normalizeTicketDesign, type TicketDesign } from '@/store/ticketDrafts.ts';
import { validateTicketDesign } from './ticketAssets.ts';

/**
 * Очередь сохранений на мероприятие — общая для всех экземпляров хука: если уйти из редактора и
 * сразу вернуться, старый запрос не обгонит новый и не затрёт свежие правки на сервере.
 */
const queues = new Map<number, Promise<void>>();
const enqueue = (eventId: number, job: () => Promise<void>) => {
    const next = (queues.get(eventId) ?? Promise.resolve()).then(job).catch(() => {});
    queues.set(eventId, next);
    return next;
};

export function useTicketDesign(eventId: number) {
    const [event, setEvent] = useState<SmashUpEvent | null>(null);
    const [design, setDesign] = useState<TicketDesign | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saved');
    const [saveError, setSaveError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const latest = useRef(design);
    latest.current = design;
    const saved = useRef(design);

    useEffect(() => {
        let cancelled = false;
        setLoadError(false);
        Promise.all([
            useEventStore.getState().getOneById(eventId),
            axiosSession.get<SmashUpResponse<{ design: TicketDesign | null }>>('/ticket/design', {
                params: { event: eventId }
            })
        ])
            .then(([event, r]) => {
                if (cancelled) return;
                const design = normalizeTicketDesign(r.data.response.design);
                saved.current = design;
                setEvent(event);
                setDesign(design);
            })
            .catch((error) => {
                if (cancelled) return;
                setLoadError(true);
                axiosCatcher(toast, 'при загрузке билета')(error);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [eventId, attempt]);

    useEffect(() => {
        if (!design || design === saved.current) return;
        const timer = setTimeout(() => {
            // Запросы идут по очереди: старое сохранение не перезапишет новое на сервере.
            void enqueue(eventId, async () => {
                if (latest.current !== design) return;
                try {
                    validateTicketDesign(design);
                    const r = await axiosSession.post<SmashUpResponse<{ design: TicketDesign }>>(
                        '/ticket/design',
                        { design },
                        { params: { event: eventId } }
                    );
                    saved.current = design;
                    if (latest.current !== design) return;
                    const stored = normalizeTicketDesign(r.data.response.design);
                    saved.current = stored;
                    setDesign(stored);
                    setStatus('saved');
                } catch (error) {
                    if (latest.current === design) {
                        setStatus('error');
                        setSaveError(error instanceof Error ? error.message : 'Попробуй снова');
                    }
                    if (isAxiosError(error)) axiosCatcher(toast, 'при сохранении билета')(error);
                }
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [design, eventId]);

    // Уход со страницы раньше секунды не теряет правку: досылаем сразу. Закрытие вкладки
    // с несохранённым — предупреждение браузера.
    useEffect(() => {
        const unsaved = () => latest.current !== null && latest.current !== saved.current;
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsaved()) e.preventDefault();
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            const pending = latest.current;
            if (pending && unsaved()) {
                void enqueue(eventId, async () => {
                    validateTicketDesign(pending);
                    await axiosSession.post(
                        '/ticket/design',
                        { design: pending },
                        { params: { event: eventId } }
                    );
                });
            }
        };
    }, [eventId]);

    return {
        event,
        design,
        loadError,
        status,
        saveError,
        reload: () => setAttempt((n) => n + 1),
        update: (change: (current: TicketDesign) => TicketDesign) => {
            setDesign((current) => current && change(current));
            setStatus('saving');
        },
        retry: () => {
            setStatus('saving');
            setDesign((current) => current && { ...current });
        }
    };
}
