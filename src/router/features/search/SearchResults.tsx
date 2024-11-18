import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Section from '@/router/shared/section/Section.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import ProfileThumb from '@/router/shared/profile/ProfileThumb.tsx';

import radio from '@/assets/radio.png';
import letov from '@/assets/letov.png';
import leto from '@/assets/leto.png';

export default function SearchResults() {
    return (
        <div className='h-screen'>
            <Tabs defaultValue='account' className='flex-1'>
                <TabsList>
                    <TabsTrigger value='все'>Все</TabsTrigger>
                    <TabsTrigger value='мэшапы'>Мэшапы</TabsTrigger>
                    <TabsTrigger value='авторы'>Авторы</TabsTrigger>
                    <TabsTrigger value='плейлисты'>Плейлисты</TabsTrigger>
                </TabsList>

                {/*все*/}
                <TabsContent value='все'>
                    <Section title='Лучшие результаты'>
                        <div className='flex items-center'>
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                            <ProfileThumb
                                name='Егор Летов'
                                caption='Мэшапы с автором'
                                img={letov}
                            />
                            <ProfileThumb name='Егор ЛетоОо' caption='Мэшапер' img={leto} />
                        </div>
                    </Section>
                </TabsContent>

                {/*мэшапы*/}
                <TabsContent value='мэшапы'>
                    <Section title='Мэшапы'>
                        <div className='flex items-center'>
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                        </div>
                    </Section>
                </TabsContent>

                {/*авторы*/}
                <TabsContent value='авторы'>
                    <Section title='Авторы'>
                        <div className='flex items-center'>
                            <ProfileThumb name='Егор ЛетоОо' caption='Мэшапер' img={leto} />
                            <ProfileThumb name='Егор ЛетоОо' caption='Мэшапер' img={leto} />
                            <ProfileThumb name='Егор ЛетоОо' caption='Мэшапер' img={leto} />
                        </div>
                    </Section>
                </TabsContent>

                {/*плейлисты*/}
                <TabsContent value='плейлисты'>
                    <Section title='Плейлисты'>
                        <div className='flex items-center'>
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                            <PlaylistThumb
                                id='0'
                                title='Мэшап-Радио'
                                author='SmashUp'
                                img={radio}
                            />
                        </div>
                    </Section>
                </TabsContent>
            </Tabs>
        </div>
    );
}
