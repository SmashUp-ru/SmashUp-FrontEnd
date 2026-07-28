import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

/** Контракт /register/alter_ego: от 2 до 32 символов, без одних цифр. */
export const alterEgoFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Никнейм должен состоять минимум из 2 символов.' })
        .max(32, { message: 'Никнейм должен быть не длиннее 32 символов.' })
        .regex(RegEx.USERNAME, {
            message: 'В никнейме допустимы только буквы, цифры, пробел и символ подчёркивания.'
        })
});
