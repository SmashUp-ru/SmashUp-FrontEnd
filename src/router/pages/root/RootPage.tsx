import Section from '@/router/shared/components/section/Section.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import RootPageSkeleton from '@/router/pages/root/RootPageSkeleton.tsx';
import { useCompilations } from '@/router/features/root/useCompilations.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useGlobalStore } from '@/store/global.ts';
import FavoritesCover from '@/assets/favorites.png';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';
import { useRecommendations } from '@/router/features/root/useRecommendations.ts';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { useFavoritesPlaylists } from '@/router/features/root/useFavoritesPlaylists.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup';

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

    const playlistStore = usePlaylistStore();
    const mashupStore = useMashupStore();
    const [premierePlaylist, setPremierePlaylist] = useState<Playlist>();
    const [premiere, setPremiere] = useState<Mashup[]>();
    const [isPremiereLoading, setPremiereLoading] = useState<boolean>(true);

    useEffect(() => {
        playlistStore
            .getOneById(1)
            .then((playlist) => {
                setPremierePlaylist(playlist);
                return mashupStore.getManyByIds(playlist.mashups);
            })
            .then(setPremiere)
            .finally(() => {
                setPremiereLoading(false);
            });
    }, []);

    if (isDataLoading || isRecommendationsLoading || favoritesPlaylistsLoading || isPremiereLoading)
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

            {premierePlaylist && premiere && premiere.length > 0 && (
                <Section title='Премьера!' link={{ href: 'playlist/1', title: 'ПОКАЗАТЬ ВСЕ' }}>
                    <div className='grid grid-cols-3 gap-x-[25px] gap-y-[15px]'>
                        {premiere.slice(0, 6).map((mashup, idx) => (
                            <MashupSmallThumb
                                key={idx}
                                mashup={mashup}
                                playlist={premierePlaylist.mashups}
                                indexInPlaylist={idx}
                                playlistName={premierePlaylist.name}
                                queueId={`playlist/${premierePlaylist.id}`}
                            />
                        ))}
                    </div>
                </Section>
            )}

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
