import { createElement, useRef } from 'react';
import DoneIcon from '@/components/icons/done/Done16.tsx';
import { Button } from '@/components/ui/button.tsx';
import { axiosSession, cn, declOfNum } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import { SmashUpEvent, useEventStore } from '@/store/entities/event.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';

/**
 * «Пойду»: отметка сразу в сторе, при ошибке откат и тост; гостю — «Войди…» без запроса
 * (как `useLike`). Счётчик рядом — сколько человек отметились.
 */
export default function GoingButton({ event }: { event: SmashUpEvent }) {
    const currentUser = useGlobalStore((s) => s.currentUser);
    const cached = useEventStore((s) => s.cache[event.id]);
    const going = cached?.going ?? event.going;
    const count = cached?.goingCount ?? event.goingCount;
    const { toast } = useToast();
    const inFlight = useRef(false);

    const toggle = () => {
        if (inFlight.current) return;
        if (!currentUser) {
            toast({
                element: createElement(ErrorToast, {
                    icon: true,
                    before: 'Войди,',
                    field: 'чтобы отметить,',
                    after: 'что пойдёшь.'
                }),
                duration: 2000,
                variant: 'destructive'
            });
            return;
        }
        const next = !going;
        const set = (g: boolean, c: number) =>
            useEventStore
                .getState()
                .updateOneById(event.id, { ...event, ...cached, going: g, goingCount: c });
        set(next, count + (next ? 1 : -1));
        inFlight.current = true;
        axiosSession
            .post(`/event/${next ? 'add_going' : 'remove_going'}?id=${event.id}`)
            .catch((e) => {
                set(going, count);
                axiosCatcher(toast, 'при отметке')(e);
            })
            .finally(() => {
                inFlight.current = false;
            });
    };

    return (
        <div className='flex items-center gap-x-3'>
            <Button
                variant='outline'
                aria-pressed={going}
                onClick={toggle}
                className={cn(going && 'bg-primary/10 text-primary')}
            >
                {going && <DoneIcon size={18} className='text-primary' />}
                {going ? 'Иду' : 'Пойду'}
            </Button>
            {count > 0 && (
                <span className='text-[13px] text-onSurfaceVariant tabular-nums'>
                    {count} {declOfNum(count, ['человек', 'человека', 'человек'])}{' '}
                    {count % 10 === 1 && count % 100 !== 11 ? 'идёт' : 'идут'}
                </span>
            )}
        </div>
    );
}
