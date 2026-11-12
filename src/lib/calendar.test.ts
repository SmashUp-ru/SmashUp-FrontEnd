import { describe, expect, it } from 'vitest';
import { formatLocal, monthGrid, parseLocal } from '@/lib/calendar.ts';

describe('календарь', () => {
    it('сетка начинается с понедельника и захватывает соседние месяцы', () => {
        // 1 декабря 2026 — вторник, значит первая клетка — понедельник 30 ноября
        const g = monthGrid(2026, 11);
        expect(g).toHaveLength(42);
        expect(g[0]).toEqual({ y: 2026, m: 10, d: 30, inMonth: false });
        expect(g[1]).toEqual({ y: 2026, m: 11, d: 1, inMonth: true });
        expect(g.filter((c) => c.inMonth)).toHaveLength(31);
        // февраль 2027 начинается в понедельник — без хвоста января
        expect(monthGrid(2027, 1)[0]).toEqual({ y: 2027, m: 1, d: 1, inMonth: true });
    });

    it('разбор и сборка значения datetime-local', () => {
        const v = parseLocal('2026-12-12T20:05');
        expect(v).toEqual({ y: 2026, m: 11, d: 12, hh: 20, mm: 5 });
        expect(formatLocal(v!)).toBe('2026-12-12T20:05');
        expect(parseLocal('')).toBeNull();
    });
});
