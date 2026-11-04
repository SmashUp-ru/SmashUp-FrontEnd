import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useDebounce } from 'use-debounce';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import EditIcon from '@/components/icons/edit/Edit24';
import SearchIcon from '@/components/icons/Search.tsx';
import CancelIcon from '@/components/icons/cancel/Cancel32';
import { axiosSession, cn } from '@/lib/utils.ts';
import { UsersSearchResponse } from '@/router/shared/types/search.ts';
import { User } from '@/store/entities/user.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { editUnpublishedMashup } from '@/router/features/moderation/editUnpublishedMashup.ts';
import { CONFIRM_CANCEL, CONFIRM_FOOTER } from '@/router/shared/components/confirmDialog.ts';

type Author = { id: number; username: string };

/** Карандаш у «Авторов»: убрать соавтора или найти и добавить по нику. Публикатора убрать нельзя. */
export default function CoauthorsDialog({ mashup }: { mashup: UnpublishedMashup }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [query, setQuery] = useState('');
    const [debounced] = useDebounce(query.trim(), 400);
    const [found, setFound] = useState<User[]>([]);
    const { sent, guard } = useSubmitGuard();

    useEffect(() => {
        if (!open) return;
        setAuthors(mashup.authorsIds.map((id, i) => ({ id, username: mashup.authors[i] })));
        setQuery('');
    }, [open, mashup.authors, mashup.authorsIds]);

    useEffect(() => {
        if (debounced.length < 2 || debounced.length > 32) {
            setFound([]);
            return;
        }
        let cancelled = false;
        axiosSession
            .get(`/user/search?query=${encodeURIComponent(debounced)}`)
            .then((r: AxiosResponse<UsersSearchResponse>) => {
                if (!cancelled) setFound(r.data.response);
            })
            .catch(() => !cancelled && setFound([]));
        return () => {
            cancelled = true;
        };
    }, [debounced]);

    const has = (id: number) => authors.some((a) => a.id === id);
    const changed =
        authors.length !== mashup.authorsIds.length ||
        authors.some((a, i) => a.id !== mashup.authorsIds[i]);

    const save = () =>
        guard(async () => {
            try {
                await editUnpublishedMashup(mashup.id, { authors: authors.map((a) => a.id) });
                setOpen(false);
            } catch (e) {
                axiosCatcher(toast, 'при изменении авторов')(e as AxiosSmashUpError);
            }
        }).catch(() => {});

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='control'
                    aria-label='Изменить авторов'
                    onClick={(e) => e.stopPropagation()}
                >
                    <EditIcon color='onSurfaceVariant' />
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-[calc(100vw-2rem)] max-w-[460px] rounded-[28px] p-6 gap-5'
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle className='p-0 text-xl'>Авторы</DialogTitle>
                </DialogHeader>

                <div className='flex flex-wrap gap-2'>
                    {authors.map((a) => {
                        const locked = a.id === mashup.publisherId;
                        return (
                            <span
                                key={a.id}
                                className='inline-flex items-center gap-1 rounded-full bg-surface pl-3 pr-1 py-1 text-sm font-medium text-onSurface'
                            >
                                {a.username}
                                {locked ? (
                                    <span className='px-2 text-xs text-onSurfaceVariant'>
                                        автор загрузки
                                    </span>
                                ) : (
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        aria-label={`Убрать ${a.username}`}
                                        className='h-7 w-7'
                                        onClick={() =>
                                            setAuthors((list) => list.filter((x) => x.id !== a.id))
                                        }
                                    >
                                        <CancelIcon size={18} color='onSurfaceVariant' />
                                    </Button>
                                )}
                            </span>
                        );
                    })}
                </div>

                <Input
                    startIcon={SearchIcon}
                    placeholder='Ник мешапера'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className='flex flex-col max-h-[240px] overflow-y-auto'>
                    {found
                        .filter((u) => !has(u.id))
                        .map((u) => (
                            <button
                                key={u.id}
                                type='button'
                                onClick={() =>
                                    setAuthors((list) => [
                                        ...list,
                                        { id: u.id, username: u.username }
                                    ])
                                }
                                className={cn(
                                    'text-left px-3 py-2.5 rounded-xl text-sm font-medium text-onSurface',
                                    'hover:bg-onSurface/10 transition-colors motion-reduce:transition-none'
                                )}
                            >
                                {u.username}
                            </button>
                        ))}
                </div>

                <DialogFooter className={CONFIRM_FOOTER}>
                    <Button
                        variant='nothing'
                        className={CONFIRM_CANCEL}
                        onClick={() => setOpen(false)}
                    >
                        Отмена
                    </Button>
                    <Button className='flex-1' disabled={sent || !changed} onClick={save}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
