import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { Button } from '@/components/ui/button.tsx';
import TicketOutlineIcon from '@/components/icons/ticket/TicketOutline24.tsx';
import { axiosSession, declOfNum } from '@/lib/utils.ts';
import { SmashUpEvent } from '@/store/entities/event.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { SmashUpResponse } from '@/router/shared/types/smashup.ts';

const tickets = (n: number) => `${n} ${declOfNum(n, ['билет', 'билета', 'билетов'])}`;

/**
 * Билеты мероприятия для админа и модератора: оформление и выдача отметившим «Пойду».
 * Выдача идемпотентна: повторное нажатие выдаёт только новым отметившимся.
 */
export default function TicketsAdminBar({ event }: { event: SmashUpEvent }) {
    const { toast } = useToast();
    const { sent, guard } = useSubmitGuard();
    /** null — грузится, 'error' — список не загрузился (не путать с «выдано 0»). */
    const [issued, setIssued] = useState<number | 'error' | null>(null);
    const [nonce, setNonce] = useState(0);

    // после выдачи перечитываем список целиком: счётчик всегда с сервера, а не «старое + новые»
    useEffect(() => {
        let cancelled = false;
        axiosSession
            .get(`/ticket/list?event=${event.id}`)
            .then(
                (r: AxiosResponse<SmashUpResponse<unknown[]>>) =>
                    !cancelled && setIssued(r.data.response.length)
            )
            .catch(() => !cancelled && setIssued('error'));
        return () => {
            cancelled = true;
        };
    }, [event.id, nonce]);

    const issue = () =>
        guard(async () => {
            await axiosSession
                .post(`/ticket/issue?event=${event.id}`)
                .then((r: AxiosResponse<SmashUpResponse<{ issued: number; skipped: number }>>) => {
                    const { issued: now, skipped } = r.data.response;
                    setNonce((n) => n + 1);
                    toast({
                        element: (
                            <BaseToast
                                before={now ? 'Выдано' : 'Новых билетов нет:'}
                                field={now ? tickets(now) : 'все отметившиеся уже с билетом'}
                                after={skipped ? `, ${skipped} не хватило тиража` : undefined}
                            />
                        ),
                        duration: 3000
                    });
                })
                .catch(axiosCatcher(toast, 'при выдаче билетов'));
        });

    return (
        <section className='flex flex-wrap items-center gap-3 rounded-[30px] border border-white/10 px-5 py-4'>
            <TicketOutlineIcon color='onSurfaceVariant' />
            <span className='mr-auto text-sm text-onSurfaceVariant'>
                Билеты
                {issued === 'error'
                    ? ': не удалось загрузить выдачу'
                    : issued !== null && `: выдано ${tickets(issued)}`}
            </span>
            <Button variant='outline' size='sm' asChild>
                <Link to={`/event/${event.id}/ticket`}>Оформление</Link>
            </Button>
            <Button
                size='sm'
                onClick={issue}
                disabled={sent || event.status === 'DRAFT'}
                title={event.status === 'DRAFT' ? 'Сначала опубликуй мероприятие' : undefined}
            >
                Выдать отметившим «Пойду»
            </Button>
        </section>
    );
}
