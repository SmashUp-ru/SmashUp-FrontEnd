import { z } from 'zod';
import { currentPasswordField, usernameField } from '@/router/shared/schemas/fields.ts';

export const changeUsernameFormSchema = z.object({
    username: usernameField,
    password: currentPasswordField
});
