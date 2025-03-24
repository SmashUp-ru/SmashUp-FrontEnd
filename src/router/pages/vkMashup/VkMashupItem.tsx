import LinkIcon from '@/components/icons/Link';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePlayer } from '@/router/features/player/usePlayer';
import { VkMashup } from '@/store/entities/vkMashup';
import { usePlayerStore } from '@/store/player';
import { format } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface VkMashupItemProps {
    mashup: VkMashup;
}

export default function VkMashupItem({ mashup }: VkMashupItemProps) {
    const { playVkMashup } = usePlayer();

    const [value, setValue] = useState<string | undefined>(undefined);

    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);
    const vkMashupIsPlaying = usePlayerStore((state) => state.vkMashupIsPlaying);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const imageUrl =
        mashup.imageUrl || `${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/default_100x100.png`;

    const isCurrent =
        vkMashupSrc !== null &&
        vkMashupSrc.audioId === mashup.audioId &&
        vkMashupSrc.ownerId === mashup.ownerId;
    const isPlaying = isCurrent && vkMashupIsPlaying;

    const postUrl = `https://vk.com/wall-${mashup.groupId}_${mashup.postId}`;

    return (
        <Accordion type='single' collapsible value={value} onValueChange={(v) => setValue(v)}>
            <AccordionItem value={mashup.ownerId + '_' + mashup.audioId}>
                <AccordionTrigger>
                    <div className='w-full flex items-center justify-between py-[6px] pl-[6px]'>
                        <div className='flex items-center gap-x-4'>
                            <img
                                src={imageUrl}
                                alt={mashup.name}
                                className='w-12 h-12 rounded-[10px]'
                            />
                            <div className='flex flex-col items-start'>
                                <span className='font-bold text-onSurface'>{mashup.name}</span>
                                <span className='font-medium text-onSurfaceVariant'>
                                    {mashup.artist}
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center gap-x-7'>
                            <div className='flex items-center gap-x-3'>
                                <div className='flex items-center justify-center text-onSurfaceVariant min-w-[150px]'>
                                    <a>
                                        Дата релиза:{' '}
                                        {format(
                                            new Date(mashup.publishTime * 1000),
                                            'dd.MM.yyyy HH:mm'
                                        )}
                                    </a>
                                </div>

                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className=''
                                    onClick={(e) => {
                                        if (isCurrent) {
                                            updateVkMashupIsPlaying(!vkMashupIsPlaying);
                                        } else {
                                            playVkMashup(mashup);
                                        }
                                        e.preventDefault();
                                    }}
                                >
                                    {isPlaying ? (
                                        <PauseHollowIcon color='primary' size={36} />
                                    ) : (
                                        <PlayHollowIcon color='primary' size={36} />
                                    )}
                                </Button>

                                <Button className='mr-7' variant='ghost' size='icon'>
                                    <Link
                                        to={`/mashup/upload/vk/${mashup.ownerId}/${mashup.audioId}`}
                                    >
                                        <Button className='py-[7px] font-bold text-base rounded-xl'>
                                            Опубликовать
                                        </Button>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className='mt-4 flex gap-x-6'>
                    <img
                        src={imageUrl}
                        alt={mashup.name}
                        className='w-[216px] h-[216px] rounded-[30px]'
                    />

                    <div className='w-full grid grid-cols-4 gap-x-6'>
                        {/*название, авторы*/}
                        <div className='flex flex-col gap-y-7'>
                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мэшапа
                                </Label>
                                <span className='font-bold text-[24px]'>{mashup.name}</span>
                            </div>

                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <span className='font-bold text-[24px]'>{mashup.artist}</span>
                            </div>
                        </div>

                        {/*дополнительно*/}
                        <div className='w-full flex flex-col gap-y-[5px]'>
                            <Label className='font-medium text-onSurfaceVariant'>
                                Ссылка на ВК
                            </Label>
                            <div className='w-full flex flex-col gap-y-3'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='cursor-pointer'
                                    onClick={() => {
                                        window.open(postUrl, '_blank');
                                    }}
                                >
                                    <div className='w-full bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center gap-x-4'>
                                        <LinkIcon />
                                        <span className='font-medium text-onSurfaceVariant'>
                                            {postUrl}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
