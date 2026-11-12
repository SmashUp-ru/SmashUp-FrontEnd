/** Части значения `datetime-local` («2026-12-12T20:00»): месяц с нуля, как в `Date`. */
export interface LocalDateTime {
    y: number;
    m: number;
    d: number;
    hh: number;
    mm: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function parseLocal(value: string): LocalDateTime | null {
    const r = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
    return r ? { y: +r[1], m: +r[2] - 1, d: +r[3], hh: +r[4], mm: +r[5] } : null;
}

export function formatLocal({ y, m, d, hh, mm }: LocalDateTime): string {
    return `${y}-${pad(m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}`;
}

/**
 * Сетка месяца на 6 недель, неделя с понедельника. Считается в UTC: это даты
 * без пояса, и переход на летнее время не должен сдвигать день.
 */
export function monthGrid(
    y: number,
    m: number
): { y: number; m: number; d: number; inMonth: boolean }[] {
    const first = new Date(Date.UTC(y, m, 1));
    const shift = (first.getUTCDay() + 6) % 7; // пн = 0
    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(Date.UTC(y, m, 1 - shift + i));
        return {
            y: date.getUTCFullYear(),
            m: date.getUTCMonth(),
            d: date.getUTCDate(),
            inMonth: date.getUTCMonth() === m
        };
    });
}
