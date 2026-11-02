import { z } from 'zod';
import { usernameField } from '@/router/shared/schemas/fields.ts';

/** Контракт /register/alter_ego: те же правила, что у ника (2–32, не одни цифры). */
export const alterEgoFormSchema = z.object({
    name: usernameField
});
