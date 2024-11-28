import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';

export default function RootPage() {
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        getManyPlaylistsByIds([1, 2, 3, 27, 1043]).then((r) => setPlaylists(r));
    }, []);

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Section title='Подборки'>
                <div className='flex items-center flex-wrap'>
                    {playlists
                        .filter((playlist) => playlist.mashups.length > 0)
                        .map((playlist) => (
                            <PlaylistThumb playlist={playlist} />
                        ))}
                </div>
            </Section>

            <Section title='Рекомендации' link={{ href: 'recommendations', title: 'ПОКАЗАТЬ ВСЕ' }}>
                {/*<div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>*/}
                {/*    */}
                {/*</div>*/}
                <span>Ждите обновлений!</span>
            </Section>
        </div>
    );
}
