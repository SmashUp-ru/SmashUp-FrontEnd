import { z } from 'zod';

export const uploadYouTubeTrackFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Название трека должно быть длиннее 1 символа.' })
        .max(64, { message: 'Название трека должно быть короче 64 символов.' }),
    authors: z.array(z.string()).min(1, { message: 'У трека должен быть хотя бы 1 автор.' })
});
