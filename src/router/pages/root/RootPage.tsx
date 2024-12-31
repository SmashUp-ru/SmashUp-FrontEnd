import Section from '@/router/shared/components/section/Section.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import RootPageSkeleton from '@/router/pages/root/RootPageSkeleton.tsx';
import { useCompilations } from '@/router/features/root/useCompilations.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import { useGlobalStore } from '@/store/global.ts';
import FavoritesCover from '@/assets/favorites.png';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';
import { useRecommendations } from '@/router/features/root/useRecommendations.ts';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { useFavoritesPlaylists } from '@/router/features/root/useFavoritesPlaylists.ts';

export default function RootPage() {
    const { isLoading: isDataLoading, playlists } = useCompilations();
    const {
        mashups: recommendations,
        isLoading: isRecommendationsLoading,
        recommendations: recommendationsIds
    } = useRecommendations();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const { playlists: currentUserPlaylists } = useCurrentUserPlaylists();
    const { playlists: favoritesPlaylists, isLoading: favoritesPlaylistsLoading } =
        useFavoritesPlaylists();

    if (isDataLoading || isRecommendationsLoading || favoritesPlaylistsLoading)
        return <RootPageSkeleton />;

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Section title='Подборки'>
                <div className='flex items-center flex-wrap'>
                    {currentUser && (
                        <PlaylistThumb
                            playlist={
                                {
                                    id: -1,
                                    name: 'Любимое',
                                    authors: [currentUser.username],
                                    authorsIds: [currentUser.id],
                                    mashups: []
                                } as unknown as Playlist
                            }
                            image={FavoritesCover}
                            link='/favorites'
                        />
                    )}
                    {playlists
                        .filter((playlist) => playlist.mashups.length > 0)
                        .map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                </div>
            </Section>

            {currentUser && recommendationsIds && recommendationsIds.length > 0 && (
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

            {currentUserPlaylists && currentUserPlaylists.length > 0 && (
                <Section title='Ваши плейлисты'>
                    <div className='flex items-center flex-wrap'>
                        {currentUserPlaylists.map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </Section>
            )}

            {favoritesPlaylists && favoritesPlaylists.length > 0 && (
                <Section title='Понравившиеся плейлисты других пользователей '>
                    <div className='flex items-center flex-wrap'>
                        {favoritesPlaylists.map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}
