import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import radio from '@/assets/radio.png';
import ProfileSmallThumb from '@/router/shared/profile/ProfileSmallThumb.tsx';
import leonid from '@/assets/leonid.png';

export default function LastSearched() {
    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                <MashupSmallThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <MashupSmallThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <ProfileSmallThumb img={leonid} name='LeonidM' />
                <MashupSmallThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
            </div>
        </div>
    );
}
