import { z } from 'zod';
import { currentPasswordField, newPasswordField } from '@/router/shared/schemas/fields.ts';

export const changePasswordFormSchema = z
    .object({
        oldPassword: currentPasswordField,
        newPassword: newPasswordField,
        newPasswordAgain: z.string()
    })
    .refine((schema) => schema.newPassword === schema.newPasswordAgain, {
        message: 'Пароли не совпадают',
        path: ['newPasswordAgain']
    })
    .refine((schema) => schema.newPassword !== schema.oldPassword, {
        message: 'Новый пароль совпадает с текущим',
        path: ['newPassword']
    });
