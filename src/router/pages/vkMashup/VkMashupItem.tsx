import LinkIcon from '@/components/icons/Link';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePlayer } from '@/router/features/player/usePlayer';
import { VkMashup } from '@/store/entities/vkMashup';
import { usePlayerStore } from '@/store/player';
import { format } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { coverUrl } from '@/lib/cdn.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { cn, openExternal } from '@/lib/utils.ts';
import { ChevronDown } from 'lucide-react';

interface VkMashupItemProps {
    mashup: VkMashup;
}

export default function VkMashupItem({ mashup }: VkMashupItemProps) {
    const { playVkMashup } = usePlayer();

    const [value, setValue] = useState<string | undefined>(undefined);

    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);
    const vkMashupIsPlaying = usePlayerStore((state) => state.vkMashupIsPlaying);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const imageUrl = mashup.imageUrl || coverUrl('mashup', 'default', 100);

    const isCurrent =
        vkMashupSrc !== null &&
        vkMashupSrc.audioId === mashup.audioId &&
        vkMashupSrc.ownerId === mashup.ownerId;
    const isPlaying = isCurrent && vkMashupIsPlaying;

    const postUrl = `https://vk.com/wall-${mashup.groupId}_${mashup.postId}`;

    const itemValue = `${mashup.ownerId}_${mashup.audioId}`;
    const isOpen = value === itemValue;
    const toggle = () => setValue(isOpen ? undefined : itemValue);

    return (
        <Accordion type='single' collapsible value={value} onValueChange={(v) => setValue(v)}>
            <AccordionItem value={itemValue}>
                {/*
                 * Вся строка — переключатель раскрытия, кнопки внутри — соседи текста
                 * в общем flex-ряду (как в модерации). Раньше кнопки лежали абсолютом
                 * поверх AccordionTrigger и на узком экране закрывали название.
                 */}
                <div
                    className='min-h-[60px] rounded-2xl p-[6px] bg-surfaceVariant flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-x-4 cursor-pointer'
                    onClick={toggle}
                >
                    <div className='flex flex-1 min-w-0 items-center gap-x-3 md:gap-x-4'>
                        <ImageWithSkeleton
                            src={imageUrl}
                            alt={mashup.name}
                            className='w-12 h-12 shrink-0 rounded-[10px]'
                        />
                        <div className='flex min-w-0 flex-col items-start'>
                            <span className='truncate max-w-full font-medium text-onSurface'>
                                {mashup.name}
                            </span>
                            <span className='truncate max-w-full font-medium text-onSurfaceVariant'>
                                {mashup.artist}
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 md:gap-x-3'>
                        <div className='hidden md:flex items-center justify-center text-onSurfaceVariant min-w-[150px]'>
                            <span>
                                Дата релиза:{' '}
                                {format(new Date(mashup.publishTime * 1000), 'dd.MM.yyyy HH:mm')}
                            </span>
                        </div>

                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent) {
                                    updateVkMashupIsPlaying(!vkMashupIsPlaying);
                                } else {
                                    playVkMashup(mashup);
                                }
                            }}
                        >
                            {isPlaying ? (
                                <PauseHollowIcon color='primary' size={32} />
                            ) : (
                                <PlayHollowIcon color='primary' size={32} />
                            )}
                        </Button>

                        <Button
                            className='flex-1 md:flex-none py-[7px] font-medium text-sm rounded-xl'
                            asChild
                        >
                            <Link
                                to={`/mashup/upload/vk/${mashup.ownerId}/${mashup.audioId}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Редактировать
                            </Link>
                        </Button>

                        <Button
                            variant='ghost'
                            size='control'
                            aria-label={isOpen ? 'Свернуть' : 'Подробнее'}
                            aria-expanded={isOpen}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggle();
                            }}
                        >
                            <ChevronDown
                                className={cn(
                                    'h-7 w-7 text-onSurfaceVariant transition-transform duration-200 motion-reduce:transition-none',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </Button>
                    </div>
                </div>

                <AccordionContent className='mt-4 flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-x-6'>
                    <ImageWithSkeleton
                        src={imageUrl}
                        alt={mashup.name}
                        className='w-[216px] h-[216px] shrink-0 rounded-[30px]'
                    />

                    <div className='w-full grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-x-6'>
                        {/*название, авторы*/}
                        <div className='flex flex-col gap-y-7'>
                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мешапа
                                </Label>
                                <span className='font-semibold text-xl'>{mashup.name}</span>
                            </div>

                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <span className='font-semibold text-xl'>{mashup.artist}</span>
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
                                    onClick={() => openExternal(postUrl)}
                                >
                                    <div className='w-full min-w-0 bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-4 py-[11px] flex items-center gap-x-3 md:gap-x-4 md:px-5'>
                                        <span className='shrink-0'>
                                            <LinkIcon />
                                        </span>
                                        <span className='truncate font-medium text-onSurfaceVariant'>
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
