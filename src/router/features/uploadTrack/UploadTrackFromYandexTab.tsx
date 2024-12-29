import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';

export default function UploadTrackFromYandexTab() {
    return (
        <section className='flex flex-col gap-y-6 flex-1 overflow-auto pr-[35px]'>
            <div className='w-full flex gap-x-12 flex-1'>
                <div className='w-full flex flex-col flex-1 justify-between p-4'>
                    <div>
                        <Label className='font-medium text-onSurfaceVariant'>
                            Ссылка на трек в Яндекс Музыке
                        </Label>
                        <Input
                            placeholder='Вставьте ссылку на трек в Яндекс Музыке'
                            startIcon={LinkIcon}
                        />
                        <TrackSmallThumb
                            track={
                                { imageUrl: '1', name: 'Чёрное вино', authors: ['Элджей'] } as Track
                            }
                        />
                    </div>

                    <div className='bg-surfaceVariant p-5 w-fit rounded-[30px] flex items-center gap-x-6 mt-auto'>
                        <Button className='w-[460px]'>Опубликовать</Button>
                        <div className='flex items-center gap-x-4'>
                            <Checkbox />
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
