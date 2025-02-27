import { useSearch } from '@/router/features/search/useSearch.ts';
import {
    TabsContent,
    TabsList,
    TabsSeparated,
    TabsTrigger
} from '@/components/ui/tabs-separated.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import Section from '@/router/shared/components/section/Section.tsx';
import MashupThumb from '@/router/shared/components/mashup/MashupThumb.tsx';
import UserThumb from '@/router/shared/components/user/UserThumb.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import { useSearchStore } from '@/store/search.ts';
import SearchResultsSkeleton from '@/router/features/search/SearchResultsSkeleton.tsx';
import { useCallback } from 'react';

export default function SearchResults() {
    const updateType = useSearchStore((state) => state.updateType);
    const searchValue = useSearchStore((state) => state.searchValue);

    const { mashups, playlists, users, isLoading } = useSearch(searchValue);

    const getMashupIds = useCallback(() => {
        return mashups.map((mashup) => mashup.id);
    }, [mashups]);

    if (isLoading) return <SearchResultsSkeleton />;

    return (
        <TabsSeparated defaultValue='все' className='flex-1'>
            <div className='flex items-center justify-between'>
                <TabsList>
                    <TabsTrigger value='все'>Все</TabsTrigger>
                    <TabsTrigger value='мэшапы'>Мэшапы</TabsTrigger>
                    <TabsTrigger value='авторы'>Авторы</TabsTrigger>
                    <TabsTrigger value='плейлисты'>Плейлисты</TabsTrigger>
                </TabsList>

                <div className='flex bg-surfaceVariant rounded-xl'>
                    <Button
                        size='sm'
                        variant='ghost'
                        className={cn(
                            'bg-surfaceVariant text-onSurfaceVariant',
                            'bg-primary text-surfaceVariant'
                        )}
                    >
                        Поиск
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => updateType('crossover')}
                        className={cn('bg-surfaceVariant text-onSurfaceVariant')}
                    >
                        Кроссовер
                    </Button>
                </div>
            </div>

            {/*все*/}
            <TabsContent value='все'>
                {mashups && mashups.length > 0 && (
                    <Section title='Мэшапы'>
                        <div className='flex flex-wrap items-center'>
                            {mashups.map((mashup, idx) => (
                                <MashupThumb
                                    key={mashup.id}
                                    mashup={mashup}
                                    searchMode
                                    playlist={getMashupIds()}
                                    indexInPlaylist={idx}
                                    playlistName={`Поиск "${searchValue}"`}
                                    queueId={`search/${searchValue}`}
                                />
                            ))}
                        </div>
                    </Section>
                )}

                {users && users.length > 0 && (
                    <Section title='Авторы'>
                        <div className='flex flex-wrap items-center'>
                            {users.map((user) => (
                                <UserThumb user={user} searchMode key={user.id} />
                            ))}
                        </div>
                    </Section>
                )}

                {playlists && playlists.length > 0 && (
                    <Section title='Плейлисты'>
                        <div className='flex flex-wrap items-center'>
                            {playlists.map((playlist) => (
                                <PlaylistThumb playlist={playlist} searchMode key={playlist.id} />
                            ))}
                        </div>
                    </Section>
                )}
            </TabsContent>

            {/*мэшапы*/}
            {mashups && (
                <TabsContent value='мэшапы'>
                    <Section title='Мэшапы'>
                        <div className='flex flex-wrap items-center'>
                            {mashups.map((mashup, idx) => (
                                <MashupThumb
                                    key={mashup.id}
                                    mashup={mashup}
                                    searchMode
                                    playlist={getMashupIds()}
                                    indexInPlaylist={idx}
                                    playlistName={`Поиск "${searchValue}"`}
                                    queueId={`search/${searchValue}`}
                                />
                            ))}
                        </div>
                    </Section>
                </TabsContent>
            )}

            {/*авторы*/}
            {users && (
                <TabsContent value='авторы'>
                    <Section title='Авторы'>
                        <div className='flex items-center'>
                            {users.map((user) => (
                                <UserThumb user={user} searchMode key={user.id} />
                            ))}
                        </div>
                    </Section>
                </TabsContent>
            )}

            {/*плейлисты*/}
            {playlists && (
                <TabsContent value='плейлисты'>
                    <Section title='Плейлисты'>
                        <div className='flex items-center'>
                            {playlists.map((playlist) => (
                                <PlaylistThumb playlist={playlist} searchMode key={playlist.id} />
                            ))}
                        </div>
                    </Section>
                </TabsContent>
            )}
        </TabsSeparated>
    );
}
