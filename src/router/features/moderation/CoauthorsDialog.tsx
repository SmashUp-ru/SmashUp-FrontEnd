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
import { axiosSession, cn } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useUserStore } from '@/store/entities/user.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
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

/**
 * Строка автора — как в поиске соавторов формы загрузки: аватар (размер и
 * скругление — как обложка исходника), ник; выбранный подсвечен, клик переключает.
 */
function AuthorRow({
    author,
    selected,
    note,
    onClick
}: {
    author: Author;
    selected: boolean;
    note?: string;
    onClick?: () => void;
}) {
    return (
        <button
            type='button'
            disabled={!onClick}
            aria-pressed={selected}
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-x-4 rounded-2xl p-1.5 text-left transition-colors motion-reduce:transition-none disabled:cursor-default',
                selected ? 'bg-badge' : 'hover:bg-onPrimary'
            )}
        >
            {author.imageUrl ? (
                <ImageWithSkeleton
                    src={coverUrl('user', author.imageUrl, 100)}
                    alt={author.username}
                    className='h-11 w-11 shrink-0 rounded-xl'
                />
            ) : (
                <Skeleton className='h-11 w-11 shrink-0 rounded-xl' />
            )}
            <span
                className={cn(
                    'min-w-0 flex-1 truncate text-sm font-medium',
                    selected ? 'text-primary' : 'text-onSurface'
                )}
            >
                {author.username}
            </span>
            {note && <span className='px-3 text-[13px] text-onSurfaceVariant'>{note}</span>}
        </button>
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

                <Input
                    startIcon={SearchIcon}
                    placeholder='Ник мешапера'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Как в форме загрузки: выбранные сверху и подсвечены, ниже — найденные. */}
                <div className='-mx-1.5 -mt-1 flex flex-col gap-y-1 max-h-[320px] overflow-y-auto'>
                    {authors.map((a) => {
                        const locked = a.id === mashup.publisherId;
                        return (
                            <AuthorRow
                                key={a.id}
                                author={a}
                                selected
                                note={locked ? 'автор загрузки' : undefined}
                                onClick={
                                    locked
                                        ? undefined
                                        : () =>
                                              setAuthors((list) =>
                                                  list.filter((x) => x.id !== a.id)
                                              )
                                }
                            />
                        );
                    })}
                    {found
                        .filter((u) => !has(u.id))
                        .map((u) => (
                            <AuthorRow
                                key={u.id}
                                author={{ id: u.id, username: u.username, imageUrl: u.imageUrl }}
                                selected={false}
                                onClick={() =>
                                    setAuthors((list) => [
                                        ...list,
                                        { id: u.id, username: u.username, imageUrl: u.imageUrl }
                                    ])
                                }
                            />
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
