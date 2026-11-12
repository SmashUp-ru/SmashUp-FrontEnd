import { describe, expect, it } from 'vitest';
import {
    eventDateParts,
    eventIcs,
    formatEventDate,
    isEventOver,
    priceLabel,
    utcToZonedInput,
    zonedInputToUtc
} from '@/lib/events.ts';
import type { SmashUpEvent } from '@/store/entities/event.ts';

// 12.12.2026 20:00 по Москве = 17:00 UTC
const START = Date.UTC(2026, 11, 12, 17, 0);

describe('время мероприятия в поясе площадки', () => {
    it('datetime-local в поясе ↔ UTC', () => {
        expect(zonedInputToUtc('2026-12-12T20:00', 'Europe/Moscow')).toBe(START);
        expect(zonedInputToUtc('2026-12-12T20:00', 'Asia/Novosibirsk')).toBe(START - 4 * 3600_000);
        expect(utcToZonedInput(START, 'Europe/Moscow')).toBe('2026-12-12T20:00');
        expect(utcToZonedInput(START, 'Europe/Kaliningrad')).toBe('2026-12-12T19:00');
        expect(zonedInputToUtc('мусор', 'Europe/Moscow')).toBeNull();
    });

    it('дата показывается в поясе площадки, а не браузера', () => {
        expect(formatEventDate(START, 'Europe/Moscow', START)).toBe('сб, 12 декабря в 20:00');
        expect(formatEventDate(START, 'Asia/Vladivostok', START)).toBe('вс, 13 декабря в 03:00');
        expect(formatEventDate(START, 'Europe/Moscow', Date.UTC(2025, 0, 1))).toBe(
            'сб, 12 декабря 2026 в 20:00'
        );
        expect(eventDateParts(START, 'Europe/Moscow')).toEqual({
            month: 'дек',
            day: '12',
            weekday: 'сб'
        });
    });

    it('без endsAt мероприятие идёт 12 часов', () => {
        const e = { startsAt: START, endsAt: null };
        expect(isEventOver(e, START + 11 * 3600_000)).toBe(false);
        expect(isEventOver(e, START + 12 * 3600_000)).toBe(true);
        expect(isEventOver({ startsAt: START, endsAt: START + 3600_000 }, START + 3600_000)).toBe(
            true
        );
    });
});

describe('цена и календарь', () => {
    it('цена', () => {
        expect(priceLabel(null)).toBeNull();
        expect(priceLabel(0)).toBe('Вход свободный');
        expect(priceLabel(1500)).toBe('от 1 500 ₽');
    });

    it('.ics экранирует текст и пишет время в UTC', () => {
        const ics = eventIcs(
            {
                id: 7,
                name: 'Flip; vol, 2',
                startsAt: START,
                endsAt: null,
                venue: 'Урбан',
                address: '',
                city: 'Москва'
            } as SmashUpEvent,
            'https://smashup.ru/event/7'
        );
        expect(ics).toContain('SUMMARY:Flip\\; vol\\, 2');
        expect(ics).toContain('DTSTART:20261212T170000Z');
        expect(ics).toContain('DTEND:20261213T050000Z');
        expect(ics).toContain('LOCATION:Урбан\\, Москва');
    });
});

describe('экранирование .ics', () => {
    it('обратный слэш тоже экранируется', () => {
        const ics = eventIcs(
            {
                id: 1,
                name: 'a\\b',
                startsAt: START,
                endsAt: null,
                venue: 'v',
                address: '',
                city: 'c'
            } as SmashUpEvent,
            'u'
        );
        expect(ics).toContain('SUMMARY:a\\\\b');
    });
});
