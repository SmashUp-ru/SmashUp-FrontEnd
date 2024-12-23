import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import RootPageSkeleton from '@/router/pages/root/RootPageSkeleton.tsx';
import { useRootPageData } from '@/router/features/root/useRootPageData.ts';

export default function RootPage() {
    const { isLoading, playlists, recommendationsIds, recommendations } = useRootPageData();

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
