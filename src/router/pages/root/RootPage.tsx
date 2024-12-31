import Section from '@/router/shared/components/section/Section.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import RootPageSkeleton from '@/router/pages/root/RootPageSkeleton.tsx';
import { useRootPageData } from '@/router/features/root/useRootPageData.ts';

export default function RootPage() {
    const { isLoading, playlists } = useRootPageData();

    if (isLoading) return <RootPageSkeleton />;

    return (
        <div className='flex flex-col gap-8 pb-12'>
            <Section title='Подборки'>
                <div className='flex items-center flex-wrap'>
                    {playlists
                        .filter((playlist) => playlist.mashups.length > 0)
                        .map((playlist) => (
                            <PlaylistThumb key={playlist.id} playlist={playlist} />
                        ))}
                </div>
            </Section>
        </div>
    );
}
