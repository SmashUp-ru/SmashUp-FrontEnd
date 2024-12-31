import { z } from 'zod';

export const addPlaylistFormSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Название плейлиста должно быть длиннее 4 символов.' })
        .max(40, { message: 'Название плейлиста должно быть короче 40 символов.' }),
    description: z.string().optional(),
    basedImageFile: z.string().optional()
});
