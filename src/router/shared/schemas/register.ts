import { z } from 'zod';
import { emailField, newPasswordField, usernameField } from '@/router/shared/schemas/fields.ts';

export const registerFormSchema = z.object({
    nickname: usernameField,
    email: emailField,
    password: newPasswordField,
    accept: z.boolean()
});
