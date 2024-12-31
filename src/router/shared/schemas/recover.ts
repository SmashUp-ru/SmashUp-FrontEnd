import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

export const recoverFormSchema = z.object({
    email: z
        .string()
        .min(4, { message: 'Электронная почта должна быть длиннее 4 см.' })
        .max(32, { message: 'Электронная почта должна быть короче 32 символов.' })
        .regex(RegEx.EMAIL, {
            message:
                'В электронной почте должны быть только буквы, цифры, а так же специальные символы.'
        })
});

export const recoverConfirmFormSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
            .max(32, {
                message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).'
            })
            .regex(RegEx.PASSWORD, {
                message:
                    'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
            }),

        confirmPassword: z
            .string()
            .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
            .max(32, {
                message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).'
            })
            .regex(RegEx.PASSWORD, {
                message:
                    'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
            })
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
        message: 'Введенные пароли должны совпадать.',
        path: ['confirmPassword']
    });
