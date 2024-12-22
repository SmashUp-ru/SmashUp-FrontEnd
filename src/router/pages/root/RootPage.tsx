import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { useRecommendationsStore } from '@/store/recommendations.ts';
import { useGlobalStore } from '@/store/global.ts';
import RootPageSkeleton from '@/router/pages/root/RootPageSkeleton.tsx';

export default function RootPage() {
    const { isLoading } = useGlobalStore();

    const getManyMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const { recommendationsIds } = useRecommendationsStore();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    useEffect(() => {
        getManyPlaylistsByIds([1, 2, 3, 27, 1043]).then((r) => setPlaylists(r));
    }, []);

    const [recommendations, setRecommendations] = useState<Mashup[]>([]);
    useEffect(() => {
        if (recommendationsIds) {
            getManyMashupsByIds(recommendationsIds).then((r) => setRecommendations(r));
        }
    }, [recommendationsIds]);

    if (isLoading) return <RootPageSkeleton />;

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Section title='Подборки'>
                <div className='flex items-center flex-wrap'>
                    {playlists
                        .filter((playlist) => playlist.mashups.length > 0)
                        .map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                </div>
            </Section>

            {recommendations.length > 0 && (
                <Section
                    title='Рекомендации'
                    link={{ href: 'recommendations', title: 'ПОКАЗАТЬ ВСЕ' }}
                >
                    <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
                        {recommendations.slice(0, 6).map((recommendation, idx) => (
                            <MashupSmallThumb
                                key={idx}
                                mashup={recommendation}
                                playlist={recommendationsIds}
                                indexInPlaylist={idx}
                                playlistName='Рекомендации'
                                queueId='recomendations'
                            />
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}
