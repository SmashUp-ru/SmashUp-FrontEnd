import { TabsSeparated, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-separated';
import ModerationMashup from '@/router/features/moderation/ModerationMashup.tsx';
import ModerationAlbum from '@/router/features/moderation/ModerationAlbum.tsx';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useModeration } from './useModeration';
import { useGlobalStore } from '@/store/global.ts';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import { StateView } from '@/router/shared/components/StateView.tsx';

export default function ModerationPage() {
    useDocumentTitle('Модерация');
    const { unpublishedMashups } = useModeration();
    const currentUser = useGlobalStore((state) => state.currentUser);

    if (currentUser === null) return null;
    if (unpublishedMashups === null) {
        // TODO: скелет
        return <></>;
    }

    // треки альбомов модерируются альбомом целиком — во вкладке «Альбомы», не среди одиночных
    const single = unpublishedMashups.filter((m) => !(m.albumId > 0));
    const albums = new Map<number, UnpublishedMashup[]>();
    for (const m of unpublishedMashups) {
        if (m.albumId > 0) albums.set(m.albumId, [...(albums.get(m.albumId) ?? []), m]);
    }
    for (const tracks of albums.values()) {
        tracks.sort((a, b) => (a.albumPosition ?? 0) - (b.albumPosition ?? 0) || a.id - b.id);
    }

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-[28px] text-onSurface'>Модерация</h1>
            </div>

            <TabsSeparated defaultValue='все' className='flex flex-col gap-y-6'>
                <TabsList className='justify-start md:justify-start'>
                    <TabsTrigger value='все'>Все мешапы</TabsTrigger>
                    <TabsTrigger value='альбомы'>
                        Альбомы{albums.size > 0 ? ` · ${albums.size}` : ''}
                    </TabsTrigger>
                    <TabsTrigger value='ссылка'>Со ссылкой на VK</TabsTrigger>
                    <TabsTrigger value='принятые'>Принятые</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='все'
                    className='flex flex-col gap-y-3 data-[state=inactive]:hidden'
                >
                    {single.map((mashup) => (
                        <ModerationMashup key={mashup.id} mashup={mashup} />
                    ))}
                </TabsContent>
                <TabsContent
                    value='альбомы'
                    className='flex flex-col gap-y-3 data-[state=inactive]:hidden'
                >
                    {albums.size === 0 ? (
                        <StateView
                            className='min-h-[240px]'
                            title='Альбомов на модерации нет'
                            description='Здесь появятся альбомы, все треки которых ждут проверки'
                        />
                    ) : (
                        [...albums.entries()].map(([albumId, tracks]) => (
                            <ModerationAlbum key={albumId} albumId={albumId} mashups={tracks} />
                        ))
                    )}
                </TabsContent>
                <TabsContent
                    value='ссылка'
                    className='flex flex-col gap-y-3 data-[state=inactive]:hidden'
                >
                    {single
                        .filter((mashup) => mashup.statusesUrls.length > 0)
                        .map((mashup) => (
                            <ModerationMashup key={mashup.id} mashup={mashup} />
                        ))}
                </TabsContent>
                <TabsContent value='принятые' className='data-[state=inactive]:hidden'>
                    <StateView
                        className='min-h-[240px]'
                        title='Пока пусто'
                        description='Здесь появятся принятые мешапы'
                    />
                </TabsContent>
            </TabsSeparated>
        </div>
    );
}
