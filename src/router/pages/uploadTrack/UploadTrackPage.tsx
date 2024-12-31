import { TabsSeparated, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-separated';
import UploadTrackFromYandexTab from '@/router/features/uploadTrack/UploadTrackFromYandexTab.tsx';
import UploadTrackFromYoutubeTab from '@/router/features/uploadTrack/UploadTrackFromYoutubeTab.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function UploadTrackPage() {
    const currentUser = useGlobalStore((state) => state.currentUser);
    if (currentUser === null) return null;

    return (
        <div className='flex flex-col gap-y-7 h-full'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>Загрузка трека</h1>
            </div>

            <TabsSeparated
                defaultValue='yandex'
                className='flex flex-col flex-1 items-start gap-y-4'
            >
                <TabsList>
                    <TabsTrigger value='yandex'>Загрузить из Яндекс.Музыки</TabsTrigger>
                    <TabsTrigger value='youtube'>Загрузить из YouTube</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='yandex'
                    className='flex flex-col flex-1 data-[state=inactive]:hidden'
                >
                    <UploadTrackFromYandexTab />
                </TabsContent>
                <TabsContent
                    value='youtube'
                    className='flex flex-col flex-1 data-[state=inactive]:hidden'
                >
                    <UploadTrackFromYoutubeTab />
                </TabsContent>
            </TabsSeparated>
        </div>
    );
}
