import Banner from '@/router/features/root/Banner.tsx';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import radio from '@/assets/radio.png';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import { useEffect, useState } from 'react';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';

export default function Root() {
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        getManyPlaylistsByIds([1, 2, 3, 27, 1043]).then((r) => setPlaylists(r));
    }, []);

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Banner />

            <Section title='Подборки'>
                <div className='flex items-center'>
                    {playlists.map((playlist) => (
                        <PlaylistThumb
                            id={playlist.id}
                            title={playlist.name}
                            authors={playlist.authors}
                            img={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_400x400.png`}
                        />
                    ))}
                </div>
            </Section>

            <Section title='Премьера!' link={{ href: '/playlist/1', title: 'ПОКАЗАТЬ ВСЕ' }}>
                <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
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
                </div>
            </Section>
        </div>
    );
}
