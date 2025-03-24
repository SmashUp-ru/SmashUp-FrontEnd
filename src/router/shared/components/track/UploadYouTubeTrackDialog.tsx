import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode, useMemo, useState } from 'react';
import { axiosSession, removeItem } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { YouTubeTrack } from '../../types/youtube';
import { AxiosSmashUpResponse } from '../../types/smashup';
import { Track } from '@/store/entities/track';
import { useToast } from '../../hooks/use-toast';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation';
import { axiosCatcher } from '../../toasts/axios';
import BaseToast from '../../toasts/Base';
import { getToken } from '@/store/global';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from './TrackSmallThumb';
import CancelIcon from '@/components/icons/cancel/Cancel32';
import { RegEx } from '@/lib/regex';
import { DialogTitle } from '@radix-ui/react-dialog';

interface UploadYouTubeTrackDialogProps {
    mashup: UnpublishedMashup;
    track: YouTubeTrack;
    children: ReactNode;
    className?: string;
}

export function UploadYouTubeTrackDialog({
    mashup,
    children,
    track,
    className
}: UploadYouTubeTrackDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [sent, setSent] = useState(false);

    const unpublishedMashups = useModerationStore((state) => state.unpublishedMashups);
    const updateUnpublishedMashups = useModerationStore((state) => state.updateUnpublishedMashups);

    const [name, setName] = useState<string>(track.name);
    const [authors, setAuthors] = useState<string[]>(track.authors);
    const realAuthors = useMemo(() => {
        return authors.map((author) => author.trim()).filter((author) => author.trim() !== '');
    }, [authors]);

    const upload = () => {
        if (sent) {
            return;
        }

        const match = (track.id as string).match(RegEx.YOUTUBE);
        if (!match || match[1].length !== 11) {
            throw new Error('Got wrong YouTube link!');
        }

        setSent(true);

        axiosSession
            .post('/track/upload/youtube/video', {
                videoId: match[1],
                name: name,
                authors: realAuthors
            })
            .then((r: AxiosSmashUpResponse<Track>) => {
                toast({
                    element: (
                        <BaseToast image={track.imageUrl} field='Трек' after='успешно загружен' />
                    ),
                    duration: 2000
                });

                const uploadedTrack = r.data.response;

                return axiosSession
                    .post('/moderation/unpublished_mashup/edit', {
                        id: mashup.id,
                        tracks: mashup.tracks.concat([uploadedTrack.id]),
                        tracksUrls: removeItem(
                            mashup.tracksUrls,
                            RegEx.NORMALIZE_YOUTUBE_LINK(uploadedTrack.link)
                        )
                    })
                    .then((r: AxiosSmashUpResponse<UnpublishedMashup>) => {
                        console.log('[1]', r.data.response);
                        console.log('[2]', unpublishedMashups);
                        if (unpublishedMashups !== null) {
                            const newMashup = r.data.response;

                            updateUnpublishedMashups(
                                unpublishedMashups.map((mashup) =>
                                    mashup.id === newMashup.id ? newMashup : mashup
                                )
                            );

                            console.log(
                                'NEW',
                                unpublishedMashups.map((mashup) =>
                                    mashup.id === newMashup.id ? newMashup : mashup
                                )
                            );
                        }

                        const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/moderation/mashup/${mashup.id}_800x800.png?token=${getToken()}`;
                        toast({
                            element: (
                                <BaseToast image={imageUrl} field='Мэшап' after='успешно изменён' />
                            ),
                            duration: 2000
                        });

                        setOpen(false);
                    })
                    .catch(axiosCatcher(toast, 'при редактировании мэшапа'));
            })
            .catch(axiosCatcher(toast, 'при загрузки трека'))
            .finally(() => {
                setSent(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className='w-fit'>
                <div className='flex flex-col space-y-1.5 text-left gap-y-5'>
                    <DialogTitle>
                        <div className='text-onSurface font-bold text-[28px] pb-0'>
                            Добавления трека с YouTube
                        </div>
                    </DialogTitle>
                    <div className='text-sm text-muted-foreground pt-0 mt-0 flex flex-col gap-y-8 items-center gap-x-[33px]'>
                        <TrackSmallThumb
                            track={{
                                id: track.id,
                                name: name,
                                authors: realAuthors,
                                imageUrl: track.imageUrl,
                                link: track.link
                            }}
                            className='bg-black'
                        />

                        <div className='flex flex-col gap-y-[11px]'>
                            <Label className='text-onSurfaceVariant'>Название</Label>

                            <Input
                                placeholder='Название'
                                className='w-[460px]'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className='flex flex-col gap-y-[11px] w-full'>
                            <Label className='text-onSurfaceVariant'>Авторы</Label>

                            <div className='flex flex-col gap-y-[11px]'>
                                {authors.map((author, index) => {
                                    return (
                                        <div className='flex flex-row gap-4 items-center'>
                                            <Input
                                                placeholder='Автор'
                                                value={author}
                                                onChange={(e) => {
                                                    const newAuthors = [...authors];
                                                    newAuthors[index] = e.target.value;
                                                    setAuthors(newAuthors);
                                                }}
                                            />

                                            {index > 0 && (
                                                <div
                                                    className='cursor-pointer'
                                                    onClick={() => {
                                                        const newAuthors = [...authors];
                                                        newAuthors.splice(index, 1);
                                                        setAuthors(newAuthors);
                                                    }}
                                                >
                                                    <CancelIcon />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Button
                                variant='outline'
                                className='w-full'
                                disabled={sent}
                                onClick={() => setAuthors(authors.concat(['']))}
                            >
                                Добавить автора
                            </Button>
                        </div>
                    </div>
                    <Button className='w-full' disabled={sent} onClick={upload}>
                        Загрузить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
