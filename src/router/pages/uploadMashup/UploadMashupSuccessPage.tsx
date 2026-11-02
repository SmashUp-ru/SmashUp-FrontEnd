import { Button } from '@/components/ui/button.tsx';
import { Link, useParams } from 'react-router-dom';

export default function UploadMashupSuccessPage() {
    const params = useParams();

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-onSurface font-semibold text-2xl'>Мешап у нас</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        {params.mashupId !== '0'
                            ? 'Он уже опубликован'
                            : 'Он ушёл на модерацию — напишем, когда проверим'}
                    </span>
                </div>

                <Button asChild>
                    <Link to='/mashup/upload' draggable={false}>
                        Загрузить ещё
                    </Link>
                </Button>
            </div>
        </div>
    );
}
