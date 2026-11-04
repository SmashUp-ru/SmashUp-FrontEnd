import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import EditIcon from '@/components/icons/edit/Edit24';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { convertToBase64, validateImageDimensions } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';
import { editUnpublishedMashup } from '@/router/features/moderation/editUnpublishedMashup.ts';

const MIN_PX = 800; // как в форме загрузки мешапа
const MAX_BYTES = 10 * 1024 * 1024;

interface CoverEditProps {
    mashupId: number;
    src: string;
    alt: string;
}

/** Обложка модерации с маленьким карандашом в углу: выбор файла → проверка → сразу сохраняем. */
export default function CoverEdit({ mashupId, src, alt }: CoverEditProps) {
    const { toast } = useToast();
    const input = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    // Адрес обложки после замены не меняется — сбиваем кэш браузера.
    const [version, setVersion] = useState(0);

    const fail = (text: string) =>
        toast({
            element: <ErrorToast icon before='Обложка:' after={text} />,
            duration: 3000,
            variant: 'destructive'
        });

    const upload = async (file: File) => {
        if (!['image/png', 'image/jpeg'].includes(file.type))
            return fail('подойдёт .png или .jpg.');
        if (file.size > MAX_BYTES) return fail('не больше 10 МБ.');
        const dataUrl = await convertToBase64(file);
        if (typeof dataUrl !== 'string') return;
        if (!(await validateImageDimensions(dataUrl, MIN_PX)))
            return fail(`не меньше ${MIN_PX}×${MIN_PX} px.`);

        setBusy(true);
        try {
            await editUnpublishedMashup(mashupId, {
                basedImageFile: dataUrl.substring(dataUrl.indexOf(',') + 1)
            });
            setVersion((v) => v + 1);
        } catch (e) {
            axiosCatcher(toast, 'при замене обложки')(e as AxiosSmashUpError);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className='relative shrink-0'>
            <ImageWithSkeleton
                key={version}
                src={version ? `${src}&v=${version}` : src}
                alt={alt}
                className='w-[216px] h-[216px] max-w-full rounded-[30px]'
            />
            <Button
                variant='nothing'
                size='control'
                aria-label='Заменить обложку'
                disabled={busy}
                className='absolute right-2 bottom-2 bg-surface/80 backdrop-blur hover:bg-surface'
                onClick={(e) => {
                    e.stopPropagation();
                    input.current?.click();
                }}
            >
                <EditIcon color='onSurface' />
            </Button>
            <input
                ref={input}
                type='file'
                accept='image/png,image/jpeg'
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = ''; // тот же файл можно выбрать повторно
                    if (file) upload(file).catch(() => {});
                }}
            />
        </div>
    );
}
