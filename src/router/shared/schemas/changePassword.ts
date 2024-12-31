import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

export const changePasswordFormSchema = z
    .object({
        oldPassword: z
            .string()
            .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
            .max(32, {
                message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).'
            })
            .regex(RegEx.PASSWORD, {
                message:
                    'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
            }),
        newPassword: z
            .string()
            .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
            .max(32, {
                message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).'
            })
            .regex(RegEx.PASSWORD, {
                message:
                    'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
            }),
        newPasswordAgain: z
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
    .refine((schema) => schema.newPassword === schema.newPasswordAgain, {
        message: 'Введенные пароли должны совпадать.',
        path: ['newPasswordAgain']
    });
