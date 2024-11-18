import radio from '@/assets/radio.png';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import ProfileThumb from '@/router/shared/profile/ProfileThumb.tsx';
import leonid from '@/assets/leonid.png';

export default function SearchPage() {
    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                <MashupThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <MashupThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
                <ProfileThumb img={leonid} name='LeonidM' />
                <MashupThumb
                    img={radio}
                    title='Развлекайтесь на 180db'
                    author='LeonidM'
                    length='2:26'
                />
            </div>
        </div>
    );
}
