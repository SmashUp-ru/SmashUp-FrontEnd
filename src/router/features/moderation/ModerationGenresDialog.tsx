import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import { axiosSession, cn } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import { GenresResponse } from '@/router/shared/types/upload.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { editUnpublishedMashup } from '@/router/features/moderation/editUnpublishedMashup.ts';
import { CONFIRM_CANCEL, CONFIRM_FOOTER } from '@/router/shared/components/confirmDialog.ts';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';

/** Кнопка «+» под жанрами модерации и модалка выбора жанров. */
export default function ModerationGenresDialog({ mashup }: { mashup: UnpublishedMashup }) {
    const { toast } = useToast();
    const allGenres = useGlobalStore((s) => s.allGenres);
    const updateAllGenres = useGlobalStore((s) => s.updateAllGenres);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set(mashup.genres));
    const { sent, guard } = useSubmitGuard();

    useEffect(() => {
        if (open && allGenres === null) {
            axiosSession
                .get('/const/genres')
                .then((r: AxiosResponse<GenresResponse>) => updateAllGenres(r.data.response))
                .catch(axiosCatcher(toast, 'при загрузке жанров'))
                .catch(() => {});
        }
    }, [open, allGenres, updateAllGenres, toast]);

    // При каждом открытии — с актуального состава мешапа.
    useEffect(() => {
        if (open) setSelected(new Set(mashup.genres));
    }, [open, mashup.genres]);

    const toggle = (genre: string) =>
        setSelected((s) => {
            const next = new Set(s);
            if (next.has(genre)) next.delete(genre);
            else next.add(genre);
            return next;
        });

    const save = () =>
        guard(async () => {
            try {
                await editUnpublishedMashup(mashup.id, { genres: [...selected] });
                setOpen(false);
            } catch (e) {
                axiosCatcher(toast, 'при изменении жанров')(e as AxiosSmashUpError);
            }
        }).catch(() => {});

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='nothing'
                    aria-label='Изменить жанры'
                    className='w-full py-[14.5px] rounded-2xl bg-surfaceVariant hover:bg-onSurface/10'
                    onClick={(e) => e.stopPropagation()}
                >
                    <PlusIcon color='onSurface' />
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-[calc(100vw-2rem)] max-w-[480px] rounded-[28px] p-6 gap-6'
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader className='space-y-2'>
                    <DialogTitle className='p-0 text-xl'>Жанры</DialogTitle>
                    <DialogDescription className='p-0 text-sm'>
                        Выбери один или несколько.
                    </DialogDescription>
                </DialogHeader>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {(allGenres ?? []).map((genre) => {
                        // Как в форме загрузки: у мешапа жанры хранятся строчными, справочник — с заглавной.
                        const key = genre.toLowerCase();
                        const on = selected.has(key);
                        return (
                            <button
                                key={genre}
                                type='button'
                                aria-pressed={on}
                                onClick={() => toggle(key)}
                                className={cn(
                                    'py-3 rounded-2xl font-medium text-[15px] transition-colors motion-reduce:transition-none',
                                    on
                                        ? 'bg-badge text-primary'
                                        : 'bg-surface text-onSurface hover:bg-onSurface/10'
                                )}
                            >
                                {genre}
                            </button>
                        );
                    })}
                </div>

                <DialogFooter className={CONFIRM_FOOTER}>
                    <Button
                        variant='nothing'
                        className={CONFIRM_CANCEL}
                        onClick={() => setOpen(false)}
                    >
                        Отмена
                    </Button>
                    <Button
                        className='flex-1'
                        disabled={sent || selected.size === 0}
                        onClick={save}
                    >
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
