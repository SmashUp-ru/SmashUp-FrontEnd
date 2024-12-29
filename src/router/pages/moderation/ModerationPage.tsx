import { TabsSeparated, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-separated';
import ModerationMashup from '@/router/features/moderation/ModerationMashup.tsx';
import { useModeration } from './useModeration';

export default function ModerationPage() {
    const { unpublishedMashups } = useModeration();

    if (unpublishedMashups === null) {
        // TODO: скелет
        return <></>;
    }

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-4xl text-onSurface'>Модерация</h1>
            </div>

            <TabsSeparated defaultValue='ожидают' className='flex flex-col gap-y-6'>
                <TabsList className='justify-start'>
                    <TabsTrigger value='ожидают'>Ожидает проверки</TabsTrigger>
                    <TabsTrigger value='принятые'>Принятые</TabsTrigger>
                </TabsList>

                <TabsContent value='ожидают' className='flex flex-col gap-y-6'>
                    {unpublishedMashups &&
                        unpublishedMashups.map((mashup) => <ModerationMashup mashup={mashup} />)}
                </TabsContent>
                <TabsContent value='принятые'>Тут ничего нет 👀</TabsContent>
            </TabsSeparated>
        </div>
    );
}
