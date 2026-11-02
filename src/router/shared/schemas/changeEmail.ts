import { z } from 'zod';
import { currentPasswordField, emailField } from '@/router/shared/schemas/fields.ts';

export const changeEmailFormSchema = z.object({
    email: emailField,
    password: currentPasswordField
});
