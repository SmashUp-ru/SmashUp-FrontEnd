import type { SmashUpEvent } from '@/store/entities/event.ts';

/** Без `endsAt` мероприятие считается идущим 12 часов — так же, как на бэке. */
const DEFAULT_DURATION_MS = 12 * 60 * 60 * 1000;

export const EVENT_TIMEZONES: { value: string; label: string }[] = [
    { value: 'Europe/Kaliningrad', label: 'Калининград' },
    { value: 'Europe/Moscow', label: 'Москва, Питер' },
    { value: 'Europe/Samara', label: 'Самара' },
    { value: 'Asia/Yekaterinburg', label: 'Екатеринбург' },
    { value: 'Asia/Omsk', label: 'Омск' },
    { value: 'Asia/Novosibirsk', label: 'Новосибирск' },
    { value: 'Asia/Krasnoyarsk', label: 'Красноярск' },
    { value: 'Asia/Irkutsk', label: 'Иркутск' },
    { value: 'Asia/Vladivostok', label: 'Владивосток' }
];

export function eventEndsAt(e: Pick<SmashUpEvent, 'startsAt' | 'endsAt'>): number {
    return e.endsAt ?? e.startsAt + DEFAULT_DURATION_MS;
}

export function isEventOver(e: Pick<SmashUpEvent, 'startsAt' | 'endsAt'>, now = Date.now()) {
    return eventEndsAt(e) <= now;
}

/** Части даты в поясе площадки: для плашки «ДЕК / 12 / СБ». */
export function eventDateParts(ms: number, timeZone: string) {
    const get = (o: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat('ru-RU', { timeZone, ...o }).format(ms).replace('.', '');
    return {
        month: get({ month: 'short' }),
        day: get({ day: 'numeric' }),
        weekday: get({ weekday: 'short' })
    };
}

/** «сб, 12 декабря в 20:00», год — только если не текущий. */
export function formatEventDate(ms: number, timeZone: string, now = Date.now()): string {
    const sameYear =
        new Intl.DateTimeFormat('ru-RU', { timeZone, year: 'numeric' }).format(ms) ===
        new Intl.DateTimeFormat('ru-RU', { timeZone, year: 'numeric' }).format(now);
    const date = new Intl.DateTimeFormat('ru-RU', {
        timeZone,
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        ...(sameYear ? {} : { year: 'numeric' })
    })
        .format(ms)
        .replace(' г.', '');
    const time = new Intl.DateTimeFormat('ru-RU', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit'
    }).format(ms);
    return `${date} в ${time}`;
}

export function priceLabel(priceFrom: number | null): string | null {
    if (priceFrom === null) return null;
    if (priceFrom === 0) return 'Вход свободный';
    return `от ${priceFrom.toLocaleString('ru-RU')} ₽`;
}

export function yandexMapsUrl(lat: number, lon: number) {
    return `https://yandex.ru/maps/?pt=${lon},${lat}&z=17&l=map`;
}

export function twoGisUrl(lat: number, lon: number) {
    return `https://2gis.ru/geo/${lon},${lat}`;
}

/** Смещение пояса в мс для момента `ms`: (время на часах в поясе) − UTC. */
function zoneOffset(ms: number, timeZone: string): number {
    const p = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', {
            timeZone,
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
            .formatToParts(ms)
            .map((x) => [x.type, x.value])
    );
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return wall - Math.floor(ms / 1000) * 1000;
}

/** Значение `<input type=datetime-local>` («2026-12-12T20:00») в поясе площадки → мс UTC. */
export function zonedInputToUtc(value: string, timeZone: string): number | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
    if (!m) return null;
    const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    // две итерации: смещение берём в момент, близкий к искомому (на случай перехода часов)
    let utc = wall - zoneOffset(wall, timeZone);
    utc = wall - zoneOffset(utc, timeZone);
    return utc;
}

/** Обратное к `zonedInputToUtc`: мс UTC → «2026-12-12T20:00» в поясе площадки. */
export function utcToZonedInput(ms: number, timeZone: string): string {
    return new Date(ms + zoneOffset(ms, timeZone)).toISOString().slice(0, 16);
}

/** .ics одного мероприятия: время в UTC, текст экранирован по RFC 5545. */
export function eventIcs(e: SmashUpEvent, url: string): string {
    const stamp = (ms: number) =>
        new Date(ms).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const esc = (s: string) => s.replace(/[\\;,]/g, (c) => '\\' + c).replace(/\r?\n/g, '\\n');
    const location = [e.venue, e.address, e.city].filter(Boolean).join(', ');
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SmashUp//Events//RU',
        'BEGIN:VEVENT',
        `UID:event-${e.id}@smashup.ru`,
        `DTSTAMP:${stamp(Date.now())}`,
        `DTSTART:${stamp(e.startsAt)}`,
        `DTEND:${stamp(eventEndsAt(e))}`,
        `SUMMARY:${esc(e.name)}`,
        `LOCATION:${esc(location)}`,
        `URL:${url}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
}

/** «Москва • Урбан • 18+» */
export function eventMeta(e: Pick<SmashUpEvent, 'city' | 'venue' | 'ageLimit'>): string {
    return [e.city, e.venue, e.ageLimit !== null ? `${e.ageLimit}+` : null]
        .filter(Boolean)
        .join(' • ');
}

/** Черновик / Отменено / Прошло; null — обычное будущее мероприятие. */
export function eventStateLabel(e: SmashUpEvent, now = Date.now()): string | null {
    if (e.status === 'DRAFT') return 'Черновик';
    if (e.status === 'CANCELLED') return 'Отменено';
    if (isEventOver(e, now)) return 'Прошло';
    return null;
}
