import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import { cn } from '@/lib/utils.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';
// import { UnpublishedMashup } from '@/store/moderation.ts';
//
// interface ModerationMashupProps {
//     mashup: UnpublishedMashup;
// }

export default function ModerationMashup() {
    const { toast } = useToast();
    const image =
        'https://www.figma.com/file/rRag5NIqwib0N69njQFTbK/image/21cd0c838f6ffbc418f192c6fbf5a1b62c9421fa';
    const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    return (
        <Accordion type='single' collapsible>
            <AccordionItem value='item-1'>
                <AccordionTrigger>
                    <div className='w-full flex items-center justify-between py-[6px] pl-[6px]'>
                        <div className='flex items-center gap-x-4'>
                            <img src={image} alt='a' className='w-12 h-12 rounded-[10px]' />
                            <div className='flex flex-col items-start'>
                                <span className='font-bold text-onSurface'>Грустите на 190кг</span>
                                <span className='font-medium text-onSurfaceVariant'>warkkaa</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-x-7'>
                            <div className='flex items-center gap-x-3'>
                                <Button variant='ghost' size='icon' className=''>
                                    <PlayHollowIcon color='primary' size={36} />
                                </Button>

                                <Button className='py-[7px] font-bold text-base rounded-xl'>
                                    Принять
                                </Button>

                                <Button className='py-[7px] font-bold text-base rounded-xl bg-onPrimary text-onSurface hover:bg-onPrimary/90 hover:text-onSurface/90'>
                                    Отклонить
                                </Button>
                            </div>

                            <Button className='mr-7' variant='ghost' size='icon'>
                                <EditIcon />
                            </Button>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className='mt-4 flex gap-x-6'>
                    <img src={image} alt='жирный' className='w-[216px] h-[216px] rounded-[30px]' />

                    <div className='w-full grid grid-cols-4 gap-x-6'>
                        {/*название, авторы*/}
                        <div className='flex flex-col gap-y-7'>
                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мэшапа
                                </Label>
                                <span className='font-bold text-[24px]'>Грустите на 190кг</span>
                            </div>

                            <div className='w-full flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <span className='font-bold text-[24px]'>warkkaa</span>
                            </div>
                        </div>

                        {/*Исходники*/}
                        <div className='w-full'>
                            <Label className='font-medium text-onSurfaceVariant'>Исходники</Label>
                            <div className='w-full max-h-[180px] overflow-y-scroll'>
                                <TrackSmallThumb
                                    track={
                                        {
                                            name: 'КАДЕЛАК',
                                            imageUrl: '1',
                                            authors: ['Морген', 'Элджей']
                                        } as Track
                                    }
                                />
                                <TrackSmallThumb
                                    track={
                                        {
                                            name: 'КАДЕЛАК',
                                            imageUrl: '1',
                                            authors: ['Морген', 'Элджей']
                                        } as Track
                                    }
                                />
                                <TrackSmallThumb
                                    track={
                                        {
                                            name: 'КАДЕЛАК',
                                            imageUrl: '1',
                                            authors: ['Морген', 'Элджей']
                                        } as Track
                                    }
                                />
                                <TrackSmallThumb
                                    track={
                                        {
                                            name: 'КАДЕЛАК',
                                            imageUrl: '1',
                                            authors: ['Морген', 'Элджей']
                                        } as Track
                                    }
                                />
                            </div>
                        </div>

                        {/*Жанры*/}
                        <div className='w-full'>
                            <Label className='font-medium text-onSurfaceVariant'>Жанры</Label>
                            <div className='w-full max-h-[180px] overflow-y-scroll flex flex-col gap-y-3'>
                                <div
                                    className={cn(
                                        'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                        'font-bold text-[18px] text-onBackground'
                                    )}
                                >
                                    SoundClown
                                </div>
                                <div
                                    className={cn(
                                        'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                        'font-bold text-[18px] text-onBackground'
                                    )}
                                >
                                    AI
                                </div>
                                <div
                                    className={cn(
                                        'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                        'font-bold text-[18px] text-onBackground'
                                    )}
                                >
                                    Электро
                                </div>
                                <div
                                    className={cn(
                                        'w-full py-[14.5px] bg-surfaceVariant flex justify-center items-center rounded-2xl',
                                        'font-bold text-[18px] text-onBackground'
                                    )}
                                >
                                    Рок
                                </div>
                            </div>
                        </div>

                        {/*дополнительно*/}
                        <div className='w-full flex flex-col gap-y-[5px]'>
                            <Label className='font-medium text-onSurfaceVariant'>
                                Дополнительно
                            </Label>
                            <div className='w-full flex flex-col gap-y-3'>
                                <div className='flex items-center gap-x-4 py-[11px] px-5 bg-surfaceVariant rounded-2xl'>
                                    <Checkbox />
                                    <Label className='font-bold text-[18px] text-onSurface'>
                                        Explicit (Мат)
                                    </Label>
                                </div>

                                <div className='flex items-center gap-x-4 py-[11px] px-5 bg-surfaceVariant rounded-2xl'>
                                    <Checkbox />
                                    <Label className='font-bold text-[18px] text-onSurface'>
                                        Бан-ворды Twitch
                                    </Label>
                                </div>

                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='cursor-pointer'
                                    onClick={() => {
                                        navigator.clipboard.writeText(link).then(() => {
                                            toast({
                                                element: (
                                                    <CopiedToast
                                                        img={image}
                                                        name='Развлекайтесь на 190кг'
                                                    />
                                                ),
                                                duration: 2000
                                            });
                                        });
                                    }}
                                >
                                    <div className='w-full bg-surfaceVariant text-onSurfaceVariant rounded-2xl px-5 py-[11px] flex items-center gap-x-4'>
                                        <LinkIcon />
                                        <span className='font-medium text-onSurfaceVariant'>
                                            {link}
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
