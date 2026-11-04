import { ReactNode, useEffect, useState } from 'react';
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
import { axiosSession } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useUserStore } from '@/store/entities/user.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import { UsersSearchResponse } from '@/router/shared/types/search.ts';
import { User } from '@/store/entities/user.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { editUnpublishedMashup } from '@/router/features/moderation/editUnpublishedMashup.ts';
import { CONFIRM_CANCEL, CONFIRM_FOOTER } from '@/router/shared/components/confirmDialog.ts';

type Author = { id: number; username: string; imageUrl?: string };

/** Строка автора той же формы, что строка исходника: аватар 44×44, ник, действие справа. */
function AuthorRow({ author, trailing }: { author: Author; trailing: ReactNode }) {
    return (
        <>
            {author.imageUrl ? (
                <ImageWithSkeleton
                    src={coverUrl('user', author.imageUrl, 100)}
                    alt={author.username}
                    className='h-11 w-11 shrink-0 rounded-full'
                />
            ) : (
                <Skeleton className='h-11 w-11 shrink-0 rounded-full' />
            )}
            <span className='min-w-0 flex-1 truncate text-sm font-medium text-onSurface'>
                {author.username}
            </span>
            {trailing}
        </>
    );
}

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
        // В мешапе только id и ники — аватарки берём из стора пользователей.
        let cancelled = false;
        useUserStore
            .getState()
            .getManyByIds(mashup.authorsIds, true)
            .then((users) => {
                if (cancelled) return;
                const avatar = new Map(users.map((u) => [u.id, u.imageUrl]));
                setAuthors((list) =>
                    list.map((a) => ({ ...a, imageUrl: a.imageUrl ?? avatar.get(a.id) }))
                );
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
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

                <div className='-mx-1.5 flex flex-col'>
                    {authors.map((a) => (
                        <div key={a.id} className='flex items-center gap-x-4 rounded-2xl p-1.5'>
                            <AuthorRow
                                author={a}
                                trailing={
                                    a.id === mashup.publisherId ? (
                                        <span className='px-3 text-[13px] text-onSurfaceVariant'>
                                            автор загрузки
                                        </span>
                                    ) : (
                                        <Button
                                            variant='ghost'
                                            size='control'
                                            aria-label={`Убрать ${a.username}`}
                                            onClick={() =>
                                                setAuthors((list) =>
                                                    list.filter((x) => x.id !== a.id)
                                                )
                                            }
                                        >
                                            <CancelIcon size={24} color='onSurfaceVariant' />
                                        </Button>
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>

                <Input
                    startIcon={SearchIcon}
                    placeholder='Ник мешапера'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className='-mx-1.5 -mt-2 flex flex-col max-h-[240px] overflow-y-auto'>
                    {found
                        .filter((u) => !has(u.id))
                        .map((u) => (
                            <button
                                key={u.id}
                                type='button'
                                aria-label={`Добавить ${u.username}`}
                                onClick={() =>
                                    setAuthors((list) => [
                                        ...list,
                                        { id: u.id, username: u.username, imageUrl: u.imageUrl }
                                    ])
                                }
                                className='group flex items-center gap-x-4 rounded-2xl p-1.5 text-left hover:bg-onPrimary transition-colors motion-reduce:transition-none'
                            >
                                <AuthorRow
                                    author={{
                                        id: u.id,
                                        username: u.username,
                                        imageUrl: u.imageUrl
                                    }}
                                    trailing={
                                        <span className='flex h-11 w-11 items-center justify-center'>
                                            <PlusIcon className='group-hover:text-onSurface' />
                                        </span>
                                    }
                                />
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
