import Banner from '@/router/features/root/Banner.tsx';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import radio from '@/assets/radio.png';
import TrackThumb from '@/router/shared/TrackThumb/TrackThumb.tsx';

export default function Root() {
    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Banner />

            <Section title='Подборки'>
                <div className='flex items-center'>
                    <PlaylistThumb title='Мэшап-Радио' author='SmashUp' img={radio} />
                    <PlaylistThumb title='Мэшап-Радио' author='SmashUp' img={radio} />
                </div>
            </Section>

            <Section title='Премьера!'>
                <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                    <TrackThumb
                        img={radio}
                        title='Развлекайтесь на 180db'
                        author='LeonidM'
                        length='2:26'
                    />
                </div>
            </Section>
        </div>
    );
}
