import { z } from 'zod';

export const addPlaylistFormSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Название плейлиста должно быть длиннее 4 символов.' })
        .max(48, { message: 'Название плейлиста должно быть короче 48 символов.' }),
    description: z.string().optional(),
    basedImageFile: z.string().optional()
});
