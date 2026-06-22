import { describe, it, expect } from 'vitest';
import { shuffleQueue, declOfNum, maskEmail } from '@/lib/utils.ts';

describe('shuffleQueue', () => {
    it('сохраняет все элементы очереди', () => {
        const queue = [1, 2, 3, 4, 5];
        const [shuffled] = shuffleQueue(queue, 0);
        expect([...shuffled].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    });

    it('возвращаемый индекс указывает на тот же элемент, что был на indexInQueue', () => {
        const queue = [10, 20, 30, 40, 50];
        const target = 2; // элемент 30
        const [shuffled, newIndex] = shuffleQueue(queue, target);
        expect(shuffled[newIndex]).toBe(30);
    });

    it('не мутирует исходную очередь', () => {
        const queue = [1, 2, 3];
        const copy = [...queue];
        shuffleQueue(queue, 0);
        expect(queue).toEqual(copy);
    });
});

describe('declOfNum (русское склонение)', () => {
    const titles = ['мешап', 'мешапа', 'мешапов'];
    it('выбирает правильную форму', () => {
        expect(declOfNum(1, titles)).toBe('мешап');
        expect(declOfNum(2, titles)).toBe('мешапа');
        expect(declOfNum(5, titles)).toBe('мешапов');
        expect(declOfNum(11, titles)).toBe('мешапов');
        expect(declOfNum(21, titles)).toBe('мешап');
        expect(declOfNum(22, titles)).toBe('мешапа');
    });
});

describe('maskEmail', () => {
    it('маскирует локальную часть, сохраняя первый и последний символ', () => {
        expect(maskEmail('johndoe@example.com')).toBe('j*****e@example.com');
    });

    it('оставляет короткую (≤2) локальную часть как есть', () => {
        expect(maskEmail('ab@x.com')).toBe('ab@x.com');
    });
});
