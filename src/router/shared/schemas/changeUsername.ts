import { z } from 'zod';
import { RegEx } from '@/lib/regex.ts';

export const changeUsernameFormSchema = z.object({
    username: z
        .string()
        .min(4, { message: 'Никнейм должен быть длиннее 3 символов.' })
        .max(64, { message: 'Никнейм должен быть короче 64 символов.' })
        .regex(RegEx.USERNAME, {
            message: 'В никнейме могут быть только буквы, цифры, а так же специальные символы.'
        }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
        .max(32, { message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).' })
        .regex(RegEx.PASSWORD, {
            message:
                'В пароле могут быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
        }),
    remember: z.boolean()
});
