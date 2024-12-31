import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

export const loginFormSchema = z.object({
    email: z
        .string()
        .min(4, { message: 'Электронная почта должна быть длиннее 3 символов.' })
        .max(64, { message: 'Электронная почта должна быть короче 64 символов.' })
        .regex(RegEx.EMAIL_OR_USERNAME, {
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
    remember: z.boolean()
});
