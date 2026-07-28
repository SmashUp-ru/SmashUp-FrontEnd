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
import { useCallback, useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup';
import { ErrorState } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';

export default function RootPage() {
    useDocumentTitle('Главная');

    const {
        isLoading: isDataLoading,
        playlists,
        isError: isCompilationsError,
        reload: reloadCompilations
    } = useCompilations();
    const {
        mashups: recommendations,
        isLoading: isRecommendationsLoading,
        recommendations: recommendationsIds
    } = useRecommendations();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const { playlists: currentUserPlaylists } = useCurrentUserPlaylists();
    const { playlists: favoritesPlaylists } = useFavoritesPlaylists();

    // Не подписываем эффект на ВЕСЬ Zustand-стор: изменение кэша меняет ссылку
    // состояния и перезапускает загрузку, хотя сами методы стора стабильны.
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const [premierePlaylist, setPremierePlaylist] = useState<Playlist>();
    const [premiere, setPremiere] = useState<Mashup[]>();
    const [isPremiereLoading, setPremiereLoading] = useState<boolean>(true);
    const [isPremiereError, setPremiereError] = useState<boolean>(false);

    // Ретраябельная загрузка «Премьеры»: playlist/1 → его мэшапы. Без .catch
    // ошибка сети оставляла isPremiereLoading=true (бесконечный скелетон).
    const loadPremiere = useCallback(() => {
        setPremiereError(false);
        setPremiereLoading(true);
        getPlaylistById(1)
            .then((playlist) => {
                setPremierePlaylist(playlist);
                return getMashupsByIds(playlist.mashups);
            })
            .then(setPremiere)
            .catch(() => setPremiereError(true))
            .finally(() => {
                setPremiereLoading(false);
            });
    }, [getPlaylistById, getMashupsByIds]);

    useEffect(() => {
        loadPremiere();
    }, [loadPremiere]);

    // Повтор упавших критичных загрузок первого экрана.
    const reloadCritical = useCallback(() => {
        if (isCompilationsError) reloadCompilations();
        if (isPremiereError) loadPremiere();
    }, [isCompilationsError, isPremiereError, reloadCompilations, loadPremiere]);

    // Критичный первый экран — «Подборки» и «Премьера». Если хотя бы один упал,
    // показываем ошибку с возможностью повтора, а не пустую главную.
    if (isCompilationsError || isPremiereError) return <ErrorState onRetry={reloadCritical} />;

    if (isDataLoading || isRecommendationsLoading || isPremiereLoading) return <RootPageSkeleton />;

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Section title='Подборки'>
                <div className='grid grid-cols-2 gap-x-[15px] gap-y-2 md:flex md:items-center md:flex-wrap md:gap-x-0 md:gap-y-0'>
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[25px] gap-y-[15px]'>
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[25px] gap-y-[15px]'>
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
                    <div className='grid grid-cols-2 gap-x-[15px] gap-y-2 md:flex md:items-center md:flex-wrap md:gap-x-0 md:gap-y-0'>
                        {currentUserPlaylists.map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </Section>
            )}

            {favoritesPlaylists && favoritesPlaylists.length > 0 && (
                <Section title='Понравившиеся плейлисты других пользователей '>
                    <div className='grid grid-cols-2 gap-x-[15px] gap-y-2 md:flex md:items-center md:flex-wrap md:gap-x-0 md:gap-y-0'>
                        {favoritesPlaylists.map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}
