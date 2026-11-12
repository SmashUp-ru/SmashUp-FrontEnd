import TicketCard from '@/router/features/tickets/TicketCard.tsx';
import { useTicketDesign } from '@/router/features/tickets/useTicketDesign.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useGlobalStore } from '@/store/global.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';

/**
 * Превью карты-билета мероприятия в мастере (шаг «Билеты»): как её увидит участник.
 * Только чтение — правки в редакторе билета, хук сам ничего не сохраняет, пока нет изменений.
 */
export default function TicketPreview({ eventId }: { eventId: number }) {
    const currentUser = useGlobalStore((s) => s.currentUser);
    const { event, design } = useTicketDesign(eventId);
    if (!event || !design || !currentUser) {
        return <Skeleton className='aspect-[5/7] w-full max-w-[340px] rounded-[24px]' />;
    }
    return (
        <TicketCard
            className='w-full max-w-[340px]'
            event={{
                ...event,
                capacity: design.capacity,
                backText: design.backText,
                stampText: design.stampText
            }}
            skin={design.skin}
            holder={{
                username: currentUser.username,
                avatar: coverUrl('user', currentUser.imageUrl, 100)
            }}
            serial={1}
            code='SU-XXXX'
        />
    );
}
