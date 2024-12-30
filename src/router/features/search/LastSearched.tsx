import { User } from '@/store/entities/user.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import UserSmallThumb from '@/router/shared/user/UserSmallThumb.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import PlaylistSmallThumb from '@/router/shared/playlist/PlaylistSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { useSearchStore } from '@/store/search.ts';
import { useLastSearchedData } from '@/router/features/search/useLastSearchedData.ts';
import LastSearchedSkeleton from '@/router/features/search/LastSearchedSkeleton.tsx';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';

export default function LastSearched() {
    const type = useSearchStore((state) => state.type);
    const updateType = useSearchStore((state) => state.updateType);

    const { searchHistory, searchHistoryObjects, isLoading } = useLastSearchedData();
    const { playlists } = useCurrentUserPlaylists();

    if (isLoading) return <LastSearchedSkeleton />;
    if (searchHistory.length === 0) return <div>История пуста!</div>;

    return (
        <div className='flex flex-col gap-y-4 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-onSurface'>История поиска</h1>
                <div className='flex bg-surfaceVariant rounded-xl'>
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => updateType('search')}
                        className={cn(
                            'bg-surfaceVariant text-onSurfaceVariant',
                            type === 'search' && 'bg-primary text-surfaceVariant'
                        )}
                    >
                        Поиск
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => updateType('crossover')}
                        className={cn(
                            'bg-surfaceVariant text-onSurfaceVariant',
                            type === 'crossover' && 'bg-primary text-surfaceVariant'
                        )}
                    >
                        Кроссовер
                    </Button>
                </div>
            </div>
            <div className='flex flex-col gap-y-1 flex-1'>
                {searchHistoryObjects.map((element, idx) => {
                    switch (element.type) {
                        case 'user':
                            return <UserSmallThumb user={element.object as User} key={idx} />;

                        case 'mashup':
                            return (
                                <MashupSmallThumb
                                    playlists={playlists}
                                    mashup={element.object as Mashup}
                                    playlist={[element.object.id]}
                                    indexInPlaylist={0}
                                    playlistName='История поиска'
                                    queueId='searchHistory'
                                    key={idx}
                                />
                            );

                        case 'playlist':
                            return (
                                <PlaylistSmallThumb
                                    playlist={element.object as Playlist}
                                    key={idx}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
}
