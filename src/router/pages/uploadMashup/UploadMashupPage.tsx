import { cn, convertToBase64 } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/Edit.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useState } from 'react';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import LinkIcon from '@/components/icons/Link.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

export default function UploadMashupPage() {
    const [image, setImage] = useState<null | string | ArrayBuffer>(null);

    return (
        <section className='flex flex-col gap-y-6 pr-[35px] h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>Настройки</h1>
            </div>
            <div className='w-full flex gap-x-12 flex-1'>
                <label className='relative cursor-pointer h-fit'>
                    {image && typeof image === 'string' ? (
                        <img
                            src={image}
                            className={cn(
                                'w-[200px] h-[200px] min-w-[200px] min-h-[200px] rounded-[30px] brightness-50'
                            )}
                            draggable={false}
                            alt='uploaded mashup cover'
                        />
                    ) : (
                        <div className='w-[200px] h-[200px] rounded-[30px] bg-surfaceVariant' />
                    )}
                    <EditIcon
                        size={70}
                        className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                        color='onSurface'
                    />
                    <Input
                        type='file'
                        className='hidden'
                        onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(await convertToBase64(e.target.files[0]));
                            }
                        }}
                    />
                </label>

                <div className='w-full flex flex-col flex-1'>
                    <div className='w-full grid grid-cols-3 gap-x-10 flex-grow'>
                        {/*название, использованные треки*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Название мэшапа
                                </Label>
                                <Input placeholder='За деньги да' />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте использованные треки
                                </Label>
                                <Input placeholder='Янглин' />

                                <div className='flex flex-col gap-y-2.5 max-h-[270px] overflow-y-scroll'>
                                    <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl items-center gap-x-4'>
                                        <div className='w-12 h-12 min-w-12 min-h-12 rounded-xl bg-onSurface' />

                                        <div className='flex flex-col min-w-0 w-full text-left'>
                                            <span className='font-bold text-onSurface truncate'>
                                                Прикрепить трек с YouTube
                                            </span>
                                            <span className='font-medium text-onSurfaceVariant truncate'>
                                                Вставьте ссылку в поиск
                                            </span>
                                        </div>
                                    </div>

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

                                <Input
                                    startIcon={LinkIcon}
                                    startIconClassName='text-onSurfaceVariant'
                                    placeholder='Ссылка на основу / альт (Если есть)'
                                />
                            </div>
                        </div>

                        {/*mp3, жанр, банворды*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Выберите жанр
                                </Label>
                                <div className='grid grid-cols-3 gap-x-2.5 gap-y-3 max-h-[252px] overflow-y-scroll'>
                                    {Array.from({ length: 15 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className='w-[142px] h-[54px] bg-surfaceVariant rounded-2xl flex items-center justify-center select-none'
                                        >
                                            genre name
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                <Checkbox />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Explicit (Мат)
                                </Label>
                            </div>

                            <div className='flex items-center gap-x-4 px-5 py-4 bg-surfaceVariant rounded-2xl'>
                                <Checkbox />
                                <Label className='font-bold text-[18px] text-onSurface'>
                                    Бан-ворды Twitch
                                </Label>
                            </div>
                        </div>

                        {/*авторы*/}
                        <div className='flex flex-col gap-y-[35px]'>
                            <div className='w-full'>
                                <Label className='font-medium text-onSurfaceVariant'>Авторы</Label>
                                <Input
                                    id='newPasswordAgain'
                                    value=''
                                    disabled
                                    placeholder='Авторы через ,'
                                    className='p-0 bg-transparent font-bold text-[24px] placeholder:text-onPrimary'
                                />
                            </div>

                            <div className='flex flex-col gap-y-2.5'>
                                <Label className='font-medium text-onSurfaceVariant'>
                                    Добавьте соавторов мэшапа
                                </Label>

                                <Input placeholder='Введите ник мэшапера' startIcon={SearchIcon} />

                                <div className='flex flex-col gap-y-2.5 max-h-[200px] overflow-y-scroll'>
                                    <div className='flex items-center gap-x-4 rounded-l-[50px] rounded-r-2xl bg-badge p-[6px] mr-[7px]'>
                                        <div className='w-12 h-12 rounded-full bg-onSurface' />
                                        <span className='font-bold text-primary'>никнейм</span>
                                    </div>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div
                                            className='flex items-center gap-x-4 rounded-l-[50px] rounded-r-2xl p-[6px] mr-[7px]'
                                            key={idx}
                                        >
                                            <div className='w-12 h-12 rounded-full bg-onSurface' />
                                            <span className='font-bold text-onSurface'>
                                                никнейм
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*сохранить*/}
                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6'>
                        <Button className='w-[460px]'>Сохранить</Button>
                        <div className='flex items-center gap-x-4'>
                            <Checkbox />
                            <span>
                                Я прочитал(-а) и согласен(-на) с условиями{' '}
                                <Link
                                    className='text-primary'
                                    to='/privacy_policy'
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
