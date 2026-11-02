import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useUserPageData } from '@/router/features/user/useUserPageData.ts';
import UserPageSkeleton from '@/router/pages/user/UserPageSkeleton.tsx';
import { cn, declOfNum } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import Section from '@/router/shared/components/section/Section.tsx';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import MashupThumb from '@/router/shared/components/mashup/MashupThumb.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import { useGlobalStore } from '@/store/global.ts';
import SettingsIcon from '@/components/icons/Settings.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import ProfileIcon from '@/components/icons/Profile.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function UserPage() {
    const params = useParams();
    const { toast } = useToast();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const { user, mashups, latestMashup, playlists, isLoading, isError, notFound, reload } =
        useUserPageData(params.profileUsername);

    useDocumentTitle(user?.username);

    if (!params.profileUsername) return;
    if (isLoading) return <UserPageSkeleton />;
    if (notFound)
        return (
            <StateView
                icon={<ProfileIcon size={48} color='onSurfaceVariant' />}
                title='Такого пользователя нет'
                description={`Ник «${params.profileUsername}» не найден — возможно, его сменили`}
            />
        );
    if (isError) return <ErrorState onRetry={reload} />;
    if (!user) return null;

    return (
        <div className='flex flex-col gap-y-6'>
            {/*шапка*/}
            <div
                className={cn(
                    'bg-surface p-4 rounded-[30px] md:rounded-tl-[120px] md:rounded-bl-[120px] md:rounded-r-[50px]',
                    'flex flex-col md:flex-row items-center gap-6 md:gap-x-12 text-center md:text-left'
                )}
            >
                <ImageWithSkeleton
                    src={coverUrl('user', user.imageUrl, 800)}
                    alt={user.username}
                    className='w-[200px] h-[200px] rounded-full'
                />
                {/* gap-y-2: у кнопок-значков 44px свои поля сверху — с gap-y-4 ряд отрывался от ника */}
                <div className='flex flex-col gap-y-2'>
                    <div>
                        <span className='font-medium text-[15px] text-onSurfaceVariant'>
                            Профиль
                        </span>
                        <div className='flex flex-col md:flex-row items-center gap-3 md:gap-x-6'>
                            <span className='font-semibold text-xl sm:text-2xl md:text-[28px] break-words text-onSurface break-all md:break-normal'>
                                {user.username}
                            </span>
                            <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[15px] text-onSurfaceVariant tabular-nums'>
                                <span>
                                    {user.mashups.length}{' '}
                                    {declOfNum(user.mashups.length, ['мешап', 'мешапа', 'мешапов'])}
                                </span>
                                <span>
                                    {user.playlists.length}{' '}
                                    {declOfNum(user.playlists.length, [
                                        'плейлист',
                                        'плейлиста',
                                        'плейлистов'
                                    ])}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Кнопки 44×44 со своими полями: gap-x-1 вместо 5 (иначе между значками
                        ~40px), а -ml на десктопе выравнивает первый значок по левому краю ника —
                        иначе он «висел» на ширину поля кнопки правее текста. */}
                    <div className='flex items-center justify-center md:justify-start gap-x-1 md:-ml-2.5'>
                        {currentUser && currentUser.username === params.profileUsername && (
                            <Button asChild variant='ghost' size='control' aria-label='Настройки'>
                                <Link to='/settings'>
                                    <SettingsIcon size={24} />
                                </Link>
                            </Button>
                        )}

                        <Button
                            variant='ghost'
                            size='control'
                            aria-label='Поделиться профилем'
                            onClick={() => {
                                // Ник может содержать пробел и кириллицу: без кодирования
                                // ссылка рвалась на пробеле при вставке в мессенджер.
                                const url = `${import.meta.env.VITE_FRONTEND_URL}/user/${encodeURIComponent(user.username)}`;
                                // Телефон — системное меню «Поделиться», десктоп — буфер обмена.
                                if (
                                    navigator.share &&
                                    window.matchMedia('(pointer: coarse)').matches
                                ) {
                                    navigator
                                        .share({ title: user.username, url })
                                        .catch(() => undefined);
                                    return;
                                }
                                navigator.clipboard.writeText(url).then(() => {
                                    toast({
                                        element: (
                                            <CopiedToast
                                                img={coverUrl('user', user.imageUrl, 800)}
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6'>
                {mashups.length > 0 && (
                    <Section
                        title='Популярные мешапы'
                        link={
                            user.mashups.length > 5
                                ? {
                                      href: `/user/${user.username}/tracks`,
                                      title: 'Показать все'
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
                                    playlistName={`Мешапы ${user.username}`}
                                    queueId={`user/${user.username}/tracks`}
                                />
                            ))}
                        </div>
                    </Section>
                )}

                {latestMashup && (
                    <Section title='Недавний релиз'>
                        <MashupThumb
                            mashup={latestMashup}
                            playlist={[latestMashup.id]}
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
