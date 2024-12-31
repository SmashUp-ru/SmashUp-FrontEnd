import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { Track } from '@/store/entities/track.ts';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { cn } from '@/lib/utils.ts';
import { useState } from 'react';

export default function UploadTrackFromYoutubeTab() {
    const [agree, setAgree] = useState<boolean>(false);

    return (
        <section className='flex flex-col gap-y-6 flex-1 overflow-auto pr-[35px]'>
            <div className='w-full flex gap-x-12 flex-1'>
                <div className='w-full flex flex-col flex-1 justify-between p-4'>
                    <div className='flex gap-x-10'>
                        <label className='relative cursor-pointer w-[200px] h-[200px] min-w-[200px] min-h-[200px]'>
                            <div className='w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-[35px] bg-surfaceVariant' />
                            <EditIcon
                                size={70}
                                className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                                color='onSurface'
                            />
                            <Input type='file' className='hidden' />
                        </label>

                        <div className='w-full flex flex-col gap-y-4'>
                            <div>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Ссылка на трек в Ютубе
                                </Label>
                                <Input
                                    placeholder='Вставьте ссылку на трек в Ютубе'
                                    startIcon={LinkIcon}
                                />
                                <TrackSmallThumb
                                    track={
                                        {
                                            imageUrl: '1',
                                            name: 'Чёрное вино',
                                            authors: ['Элджей']
                                        } as Track
                                    }
                                />
                            </div>

                            <div>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название
                                </Label>
                                <Input placeholder='Введите название трека' />
                            </div>

                            <div className='flex flex-col gap-y-[35px]'>
                                <div className='w-full flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Авторы
                                    </Label>
                                    <span className='font-bold text-[24px] text-onSurfaceVariant'>
                                        Автор, Авторка, Авториня, Авторесса, Авторогиня
                                    </span>
                                </div>

                                <div className='flex flex-col gap-y-2.5'>
                                    <Label className='font-medium text-onSurfaceVariant'>
                                        Добавьте соавторов трека
                                    </Label>

                                    <Input
                                        placeholder='Введите ник автора'
                                        startIcon={SearchIcon}
                                    />

                                    <div className='flex flex-col gap-y-2.5 max-h-[200px] overflow-y-scroll'>
                                        <div
                                            className={cn(
                                                'flex items-center gap-x-4 rounded-2xl p-4 mr-[7px] cursor-pointer bg-badge'
                                            )}
                                        >
                                            <span className={cn('font-bold text-onSurface')}>
                                                Авторша
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6 mt-auto'>
                        <Button className='w-[460px]' disabled={!agree}>
                            Опубликовать
                        </Button>
                        <div className='flex items-center gap-x-4'>
                            <Checkbox
                                checked={agree}
                                onCheckedChange={(v) => {
                                    if (typeof v === 'boolean') setAgree(v);
                                }}
                            />
                            <span>
                                Я прочитал(-а) и согласен(-на) с условиями{' '}
                                <Link
                                    className='text-primary'
                                    to='/user_agreement'
                                    draggable={false}
                                >
                                    пользовательского соглашения
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
