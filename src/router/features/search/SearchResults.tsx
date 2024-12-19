import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import UserThumb from '@/router/shared/user/UserThumb.tsx';
import { useSearch } from '@/router/features/search/useSearch.ts';
import { useSearchStore } from '@/store/search.ts';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';

export default function SearchResults() {
    const { searchValue } = useSearchStore();
    const { mashups, playlists, users } = useSearch(searchValue);

    return (
        <div className=''>
            <Tabs defaultValue='все' className='flex-1'>
                <TabsList>
                    <TabsTrigger value='все'>Все</TabsTrigger>
                    <TabsTrigger value='мэшапы'>Мэшапы</TabsTrigger>
                    <TabsTrigger value='авторы'>Авторы</TabsTrigger>
                    <TabsTrigger value='плейлисты'>Плейлисты</TabsTrigger>
                </TabsList>

                {/*все*/}
                <TabsContent value='все'>
                    {mashups && mashups.length > 0 && (
                        <Section title='Мэшапы'>
                            <div className='flex flex-wrap items-center'>
                                {mashups.map((mashup) => (
                                    <MashupThumb mashup={mashup} searchMode key={mashup.id} />
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
                                    <PlaylistThumb
                                        playlist={playlist}
                                        searchMode
                                        key={playlist.id}
                                    />
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
                                {mashups.map((mashup) => (
                                    <MashupThumb mashup={mashup} key={mashup.id} />
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
                                    <UserThumb user={user} key={user.id} />
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
                                    <PlaylistThumb playlist={playlist} key={playlist.id} />
                                ))}
                            </div>
                        </Section>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
