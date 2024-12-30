import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useUserPageData } from '@/router/features/user/useUserPageData.ts';
import { useState } from 'react';
import UserPageSkeleton from '@/router/pages/user/UserPageSkeleton.tsx';
import { cn, declOfNum } from '@/lib/utils.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import Section from '@/router/shared/section/Section.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import PlaylistThumb from '@/router/shared/playlist/PlaylistThumb.tsx';
import { useGlobalStore } from '@/store/global.ts';
import SettingsIcon from '@/components/icons/Settings.tsx';

export default function UserPage() {
    const params = useParams();
    const { toast } = useToast();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const { user, mashups, playlists, isLoading } = useUserPageData(params.profileUsername);

    const [imageLoaded, setImageLoaded] = useState(false);

    if (!params.profileUsername) return;
    if (isLoading) return <UserPageSkeleton />;
    if (!user) return null;

    return (
        <div className='flex flex-col gap-y-6'>
            {/*шапка*/}
            <div
                className={cn(
                    'bg-surface p-4 rounded-tl-[120px] rounded-bl-[120px] rounded-r-[50px]',
                    'flex items-center gap-x-12'
                )}
            >
                {!imageLoaded && <Skeleton className='w-[200px] h-[200px] rounded-full' />}
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
                    alt={user.username}
                    className={cn('w-[200px] h-[200px] rounded-full', !imageLoaded && 'hidden')}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className='flex flex-col gap-y-4'>
                    <div>
                        <span className='font-medium text-lg text-onSurfaceVariant'>Профиль</span>
                        <div className='flex items-center gap-x-6'>
                            <span className='font-bold text-4xl text-onSurface'>
                                {user.username}
                            </span>
                            <div className='flex items-center gap-x-5'>
                                <Badge>
                                    {user.mashups.length}{' '}
                                    {declOfNum(user.mashups.length, ['Мэшап', 'Мэшапа', 'Мэшапов'])}
                                </Badge>
                                <Badge>
                                    {user.playlists.length}{' '}
                                    {declOfNum(user.mashups.length, [
                                        'Плейлист',
                                        'Плейлиста',
                                        'Плейлистов'
                                    ])}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5'>
                        {currentUser && currentUser.username === params.profileUsername && (
                            <Link to='/settings'>
                                <SettingsIcon />
                            </Link>
                        )}

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(
                                        `${import.meta.env.VITE_FRONTEND_URL}/user/${user.username}`
                                    )
                                    .then(() => {
                                        toast({
                                            element: (
                                                <CopiedToast
                                                    img={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
                                                    name={user.username}
                                                />
                                            ),
                                            duration: 2000
                                        });
                                    });
                            }}
                        >
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
            </div>

            {/*контент*/}
            <div className='grid grid-cols-2 gap-x-6 gap-y-6'>
                {mashups.length > 0 && (
                    <Section
                        title='Популярные мэшапы'
                        link={
                            user.mashups.length > 5
                                ? {
                                      href: `/user/${user.username}/tracks`,
                                      title: 'ПОКАЗАТЬ ВСЕ'
                                  }
                                : undefined
                        }
                    >
                        <div className='flex flex-col'>
                            {mashups.map((mashup, idx) => (
                                <MashupSmallThumb
                                    key={mashup.id}
                                    mashup={mashup}
                                    playlist={user.mashups}
                                    indexInPlaylist={idx}
                                    playlistName={`Мэшапы ${user.username}`}
                                    queueId={`user/${user.username}/tracks`}
                                />
                            ))}
                        </div>
                    </Section>
                )}

                {mashups.length > 0 && mashups[mashups.length - 1] && (
                    <Section title='Недавний релиз'>
                        <MashupThumb
                            mashup={mashups[mashups.length - 1]}
                            playlist={[mashups[mashups.length - 1].id]}
                            indexInPlaylist={0}
                            playlistName={`Недавний релиз ${user.username}`}
                            queueId={`user/${user.username}/tracks/recent`}
                        />
                    </Section>
                )}

                {playlists.length > 0 && (
                    <div className='col-span-full'>
                        <Section title='Плейлисты'>
                            <div className='flex items-center flex-wrap'>
                                {playlists.map((playlist) => (
                                    <PlaylistThumb playlist={playlist} key={playlist.id} />
                                ))}
                            </div>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
}
