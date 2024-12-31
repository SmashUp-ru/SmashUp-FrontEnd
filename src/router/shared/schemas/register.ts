import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

export const registerFormSchema = z.object({
    nickname: z
        .string()
        .min(3, { message: 'Никнейм должен быть длиннее 4 см.' })
        .max(32, { message: 'Никнейм должен быть короче 32 символов.' })
        .regex(RegEx.USERNAME, {
            message: 'В никнейме должны быть только буквы, цифры, а так же специальные символы.'
        }),
    email: z
        .string()
        .min(4, { message: 'Электронная почта должна быть длиннее 4 см.' })
        .max(32, { message: 'Электронная почта должна быть короче 32 символов.' })
        .regex(RegEx.EMAIL, {
            message:
                'В электронной почте должны быть только буквы, цифры, а так же специальные символы.'
        }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
        .max(32, { message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).' })
        .regex(RegEx.PASSWORD, {
            message:
                'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
        }),
    accept: z.boolean()
});
