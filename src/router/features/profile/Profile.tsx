import leonid from '@/assets/leonid.png';
import { cn } from '@/lib/utils.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import Section from '@/router/shared/section/Section.tsx';
import radio from '@/assets/radio.png';
import track from '@/assets/track.png';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';

export default function Profile() {
    return (
        <div className='flex flex-col gap-y-6'>
            {/*шапка*/}
            <div
                className={cn(
                    'bg-surface p-4 rounded-tl-[120px] rounded-bl-[120px] rounded-r-[50px]',
                    'flex items-center gap-x-12'
                )}
            >
                <img src={leonid} alt='profile' className='w-[200px] h-[200px] rounded-full' />
                <div className='flex flex-col gap-y-4'>
                    <div>
                        <span className='font-medium text-lg text-onSurfaceVariant'>Профиль</span>
                        <div className='flex items-center gap-x-6'>
                            <span className='font-bold text-4xl text-onSurface'>LeonidM</span>
                            <div className='flex items-center gap-x-5'>
                                <Badge>15 Подписок</Badge>
                                <Badge>5 Подписчиков</Badge>
                                <Badge>2 Плейлиста</Badge>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5'>
                        <Button variant='ghost' size='icon'>
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
            </div>

            {/*контент*/}
            <div className='grid grid-cols-2 gap-x-6 gap-y-6'>
                <Section
                    title='Популярные треки'
                    link={{ href: '/profile/0/tracks', title: 'ПОКАЗАТЬ ВСЕ' }}
                >
                    <div className='flex flex-col'>
                        <MashupThumb
                            img={radio}
                            title='Развлекайтесь на 180db'
                            author='LeonidM'
                            length='2:26'
                        />
                        <MashupThumb
                            img={radio}
                            title='Развлекайтесь на 180db'
                            author='LeonidM'
                            length='2:26'
                        />
                        <MashupThumb
                            img={radio}
                            title='Развлекайтесь на 180db'
                            author='LeonidM'
                            length='2:26'
                        />
                        <MashupThumb
                            img={radio}
                            title='Развлекайтесь на 180db'
                            author='LeonidM'
                            length='2:26'
                        />
                        <MashupThumb
                            img={radio}
                            title='Развлекайтесь на 180db'
                            author='LeonidM'
                            length='2:26'
                        />
                    </div>
                </Section>

                <Section title='Недавний релиз'>
                    <PlaylistThumb id='0' title='Всем привет!' author='LeonidM' img={track} />
                </Section>

                <Section title='Плейлисты'>
                    <div className='flex items-center'>
                        <PlaylistThumb id='0' title='Плейлистик мой' author='LeonidM' img={radio} />
                        <PlaylistThumb id='0' title='Черновички' author='LeonidM' img={radio} />
                    </div>
                </Section>
            </div>
        </div>
    );
}
