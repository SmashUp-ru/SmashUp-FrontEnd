import { Button } from '@/components/ui/button.tsx';
import { Link, useParams } from 'react-router-dom';

export default function UploadMashupSuccessPage() {
    const params = useParams();

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-4xl'>Поздравляем!</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Мэшап{' '}
                        {params.mashupId !== '0' ? 'успешно загружен' : 'отправлен на модерацию'}
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
