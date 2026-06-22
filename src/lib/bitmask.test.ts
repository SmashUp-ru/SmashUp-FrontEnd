import { describe, it, expect } from 'vitest';
import {
    isExplicit,
    setExplicit,
    isAlt,
    isModerator,
    isAdmin,
    explicitAllowed,
    multisessionAllowed,
    switchBit
} from '@/lib/bitmask.ts';

// Характеризация текущего поведения битовых масок перед типизацией в Фазе 4.
// ВАЖНО: mashup-маска и user-маска переиспользуют одни и те же номера бит
// (бит 0 = explicit И isAdmin одновременно) — это и фиксируем.
describe('bitmask — mashup statuses', () => {
    it('isExplicit читает бит 0', () => {
        expect(isExplicit(0b0001)).toBe(true);
        expect(isExplicit(0b0000)).toBe(false);
        expect(isExplicit(0b0010)).toBe(false);
    });

    it('isAlt читает бит 3', () => {
        expect(isAlt(0b1000)).toBe(true);
        expect(isAlt(0b0111)).toBe(false);
    });

    it('setExplicit ставит/снимает бит 0, не трогая остальные', () => {
        expect(setExplicit(0b0000, true)).toBe(0b0001);
        expect(setExplicit(0b1110, true)).toBe(0b1111);
        expect(setExplicit(0b1111, false)).toBe(0b1110);
    });
});

describe('bitmask — user permissions', () => {
    it('isAdmin = бит 0, isModerator = бит 1', () => {
        expect(isAdmin(0b0001)).toBe(true);
        expect(isModerator(0b0010)).toBe(true);
        expect(isModerator(0b0001)).toBe(false);
        expect(isAdmin(0b0010)).toBe(false);
    });
});

describe('bitmask — settings', () => {
    it('explicitAllowed = бит 0, multisessionAllowed = бит 1', () => {
        expect(explicitAllowed(0b01)).toBe(true);
        expect(multisessionAllowed(0b10)).toBe(true);
        expect(explicitAllowed(0b10)).toBe(false);
        expect(multisessionAllowed(0b01)).toBe(false);
    });
});

describe('switchBit', () => {
    it('переключает бит туда и обратно', () => {
        expect(switchBit(0b0000, isExplicit, setExplicit)).toBe(0b0001);
        expect(switchBit(0b0001, isExplicit, setExplicit)).toBe(0b0000);
    });
});
