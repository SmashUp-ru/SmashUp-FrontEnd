import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { axiosSession, cn, declOfNum } from '@/lib/utils.ts';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import {
    CONFIRM_CANCEL,
    CONFIRM_DIALOG,
    CONFIRM_FOOTER
} from '@/router/shared/components/confirmDialog.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import ModerationMashup from '@/router/features/moderation/ModerationMashup.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';

interface ModerationAlbumProps {
    albumId: number;
    /** Треки альбома на модерации, уже по порядку. */
    mashups: UnpublishedMashup[];
}

/**
 * Альбом на модерации: принимается и отклоняется целиком, а каждый трек раскрывается
 * той же строкой, что и одиночный мешап, со всей правкой.
 * Отдельного метода у бэка нет: треки публикуются по одному, альбом при этом скрыт
 * от слушателей, пока на модерации остаётся хоть один трек (поле pending).
 */
export default function ModerationAlbum({ albumId, mashups }: ModerationAlbumProps) {
    const { toast } = useToast();
    const updateUnpublishedMashups = useModerationStore((s) => s.updateUnpublishedMashups);
    const getOneById = usePlaylistStore((s) => s.getOneById);

    const [album, setAlbum] = useState<Playlist | null>(null);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        getOneById(albumId)
            .then(setAlbum)
            .catch(() => setAlbum(null));
    }, [albumId, getOneById]);

    const removeFromStore = (id: number) => {
        const current = useModerationStore.getState().unpublishedMashups ?? [];
        updateUnpublishedMashups(current.filter((m) => m.id !== id));
    };

    // По одному и по порядку: на первой ошибке останавливаемся и раскрываем альбом,
    // чтобы модератор поправил трек и нажал ещё раз (опубликованные уже ушли из списка).
    const runForAll = async (
        action: (m: UnpublishedMashup) => Promise<unknown>,
        context: string
    ): Promise<boolean> => {
        setBusy(true);
        try {
            for (const mashup of mashups) {
                try {
                    await action(mashup);
                    removeFromStore(mashup.id);
                } catch (e) {
                    axiosCatcher(toast, `${context} «${mashup.name}»`)(e as never);
                    setOpen(true);
                    return false;
                }
            }
            return true;
        } finally {
            setBusy(false);
        }
    };

    const publishAll = () =>
        runForAll(
            (m) => axiosSession.post(`/moderation/unpublished_mashup/publish?id=${m.id}`),
            'при публикации'
        ).then((ok) => {
            if (ok) {
                toast({
                    element: (
                        <BaseToast
                            image={album ? coverUrl('playlist', album.imageUrl, 100) : undefined}
                            before='Альбом'
                            field={album?.name ?? ''}
                            after='опубликован'
                        />
                    ),
                    duration: 2000
                });
            }
        });

    const rejectAll = () =>
        runForAll(
            (m) =>
                axiosSession.post('/moderation/unpublished_mashup/reject', {
                    id: m.id,
                    reason: reason.trim()
                }),
            'при отклонении'
        ).then((ok) => {
            if (ok) setRejectOpen(false);
        });

    return (
        <div className='flex flex-col gap-y-2 rounded-[24px] border border-onSurface/[0.08] p-2'>
            <div
                className='min-h-[64px] rounded-2xl p-2 bg-surfaceVariant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-x-4 cursor-pointer transition-colors motion-reduce:transition-none hover:bg-onSurface/[0.06]'
                onClick={() => setOpen((v) => !v)}
            >
                <div className='flex flex-1 min-w-0 items-center gap-x-4'>
                    <ImageWithSkeleton
                        src={album ? coverUrl('playlist', album.imageUrl, 100) : ''}
                        alt={album?.name ?? ''}
                        className='w-12 h-12 shrink-0 rounded-xl'
                    />
                    <div className='flex flex-col items-start min-w-0'>
                        <span className='font-medium text-onSurface truncate max-w-full'>
                            {album?.name ?? 'Альбом'}
                        </span>
                        <span className='font-medium text-onSurfaceVariant truncate max-w-full'>
                            {album?.authors.join(', ')}
                            {album ? ' · ' : ''}
                            {mashups.length}{' '}
                            {declOfNum(mashups.length, ['трек', 'трека', 'треков'])} на модерации
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-2 md:gap-x-4'>
                    <Button
                        className='flex-1 md:flex-none'
                        size='sm'
                        disabled={busy}
                        onClick={(e) => {
                            e.stopPropagation();
                            publishAll();
                        }}
                    >
                        Принять альбом
                    </Button>

                    <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant='nothing'
                                size='sm'
                                disabled={busy}
                                className='flex-1 md:flex-none text-onSurface bg-onSurface/10 hover:bg-onSurface/15'
                            >
                                Отклонить альбом
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className={CONFIRM_DIALOG.replace('max-w-[400px]', 'max-w-[520px]')}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DialogHeader className='space-y-2'>
                                <DialogTitle className='p-0 text-xl'>Отклонить альбом?</DialogTitle>
                                <DialogDescription className='p-0 text-sm'>
                                    Отклонятся все {mashups.length}{' '}
                                    {declOfNum(mashups.length, ['трек', 'трека', 'треков'])}.
                                    Причину увидит автор
                                </DialogDescription>
                            </DialogHeader>
                            <Textarea
                                placeholder='Причина'
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <DialogFooter className={CONFIRM_FOOTER}>
                                <Button
                                    variant='nothing'
                                    className={CONFIRM_CANCEL}
                                    onClick={() => setRejectOpen(false)}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    variant='error'
                                    className='flex-1'
                                    disabled={reason.trim().length === 0 || busy}
                                    onClick={() => rejectAll()}
                                >
                                    Отклонить
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <ChevronDown
                        className={cn(
                            'h-6 w-6 mx-2.5 shrink-0 text-onSurfaceVariant transition-transform duration-200 motion-reduce:transition-none',
                            open && 'rotate-180'
                        )}
                    />
                </div>
            </div>

            {open && (
                <div className='flex flex-col gap-y-2'>
                    {mashups.map((mashup) => (
                        <ModerationMashup key={mashup.id} mashup={mashup} />
                    ))}
                </div>
            )}
        </div>
    );
}
