import { createEntityStore } from '@/store/entities/entities.ts';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface EventMetro {
    name: string;
    /** Цвет линии из OSM: `#a0a2a3`, `red`… */
    color?: string;
    distanceM?: number;
}

/** Слот лайнапа. Пустой `userIds` — артист без аккаунта на SmashUp. */
export interface EventLineupSlot {
    name: string;
    userIds: number[];
}

/** Офлайн-мероприятие. Время — мс UTC, показывать в `timezone` площадки. */
export interface SmashUpEvent {
    id: number;
    name: string;
    description: string;
    startsAt: number;
    endsAt: number | null;
    timezone: string;
    city: string;
    venue: string;
    address: string;
    lat: number | null;
    lon: number | null;
    metro: EventMetro[];
    lineup: EventLineupSlot[];
    /** Квадрат: `uploads/event/{imageUrl}_{size}x{size}.png`. */
    imageUrl: string | null;
    /** 4:5 для карточек списка: `uploads/event/{imagePortraitUrl}_portrait.jpg`. */
    imagePortraitUrl: string | null;
    /** 16:9 для баннера страницы: `uploads/event/{imageWideUrl}_wide.jpg`. */
    imageWideUrl: string | null;
    ticketUrl: string | null;
    /** 0 — вход свободный, null — цена не указана. */
    priceFrom: number | null;
    ageLimit: number | null;
    status: EventStatus;
    goingCount: number;
    going: boolean;
}

export const useEventStore = createEntityStore<SmashUpEvent>('event/get');
