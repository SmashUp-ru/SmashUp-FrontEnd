import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';
import { newPasswordField } from '@/router/shared/schemas/fields.ts';

export const recoverFormSchema = z.object({
    email: z
        .string()
        .trim()
        .min(2, { message: 'Введи почту или ник' })
        .max(254, { message: 'Слишком длинный адрес' })
        .regex(RegEx.EMAIL_OR_USERNAME, { message: 'Это не похоже на почту или ник' })
});

export const recoverConfirmFormSchema = z
    .object({
        password: newPasswordField,
        confirmPassword: z.string()
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword']
    });
