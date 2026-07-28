import { describe, expect, it } from 'vitest';
import { alterEgoFormSchema } from '@/router/shared/schemas/alterEgo.ts';

describe('alterEgoFormSchema', () => {
    it('принимает никнейм из 2–32 допустимых символов', () => {
        expect(alterEgoFormSchema.safeParse({ name: 'DJ Альт_2' }).success).toBe(true);
    });

    it('отклоняет никнейм из одних цифр и слишком короткое имя', () => {
        expect(alterEgoFormSchema.safeParse({ name: '12' }).success).toBe(false);
        expect(alterEgoFormSchema.safeParse({ name: 'Я' }).success).toBe(false);
    });
});
