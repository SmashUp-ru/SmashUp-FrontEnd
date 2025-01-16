import LogoIcon from '@/components/icons/Logo.tsx';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { useMobileStore } from '@/store/mobile.ts';

export function MobileNotAllowed() {
    const updateAgreedMobile = useMobileStore((state) => state.updateAgreed);

    return (
        <div className='w-full h-full bg-primary flex items-center justify-center overflow-hidden relative'>
            <LogoIcon
                color='background'
                className=' absolute w-[200vw] h-[160vh] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
            />

            <div className='z-10 flex flex-col gap-y-4 items-center '>
                <h1 className='font-bold text-[15px] text-onSurface text-center'>
                    Мобильная версия сайта пока находится в разработке. Как только мы ее выпустим,
                    сразу расскажем! Следи на нами в{' '}
                    <Link to='https://t.me/smashup_ru' className='text-primary' target='_blank'>
                        Телеграме
                    </Link>{' '}
                    и{' '}
                    <Link to='https://vk.com/smashupru' className='text-primary' target='_blank'>
                        ВК
                    </Link>
                    !
                </h1>
                <Button onClick={() => updateAgreedMobile(true)}>Всё равно открыть</Button>
            </div>
        </div>
    );
}
