import { VkMashup } from '@/store/entities/vkMashup';
import { useVkMashups } from './useVkMashups';
import VkMashupItem from './VkMashupItem';
import { Button } from '@/components/ui/button';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useToast } from '@/router/shared/hooks/use-toast';
import VKIcon from '@/components/icons/VK';

export default function ListVkMashupPage() {
    const { toast } = useToast();

    const { isLoading, setLoading, notConnected, vkMashups, updateVkMashups, loadVkMashups } =
        useVkMashups();

    // VK ID не привязан — импортировать нечего.
    if (notConnected) {
        return (
            <div className='flex flex-col items-center justify-center gap-y-4 py-16 text-center'>
                <VKIcon size={48} />
                <span className='font-bold text-[24px] text-onSurface'>VK не подключён</span>
                <span className='max-w-[420px] font-medium text-onSurfaceVariant'>
                    Импорт мэшапов доступен, если к аккаунту привязан VK ID. Привязать VK можно
                    будет в настройках профиля.
                </span>
            </div>
        );
    }

    // Первичная загрузка.
    if (vkMashups === null) {
        return (
            <div className='flex flex-col gap-y-2'>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className='h-[60px] w-full rounded-[10px] bg-surfaceVariant animate-pulse'
                    />
                ))}
            </div>
        );
    }

    const mashups: VkMashup[] = [];
    let index = 0;
    for (; ; index++) {
        const page = vkMashups.pages.get(index);
        if (page === undefined) {
            break;
        }

        mashups.push(...page);
    }

    // VK подключён, но импортировать пока нечего.
    if (mashups.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center gap-y-3 py-16 text-center'>
                <VKIcon size={48} />
                <span className='font-bold text-[24px] text-onSurface'>Пока нет мэшапов</span>
                <span className='max-w-[420px] font-medium text-onSurfaceVariant'>
                    Новые мэшапы из вашего VK появятся здесь автоматически.
                </span>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-y-5 w-full'>
            <div className='flex flex-col gap-y-2'>
                {mashups.map((mashup) => (
                    <VkMashupItem key={mashup.ownerId + '_' + mashup.audioId} mashup={mashup} />
                ))}
            </div>

            {mashups.length != vkMashups.total && (
                <Button
                    variant='default'
                    disabled={isLoading}
                    className='py-[7px] w-full font-bold text-base rounded-xl'
                    onClick={() => {
                        if (isLoading) {
                            return;
                        }

                        setLoading(true);
                        loadVkMashups(vkMashups, index)
                            .then(updateVkMashups)
                            .catch(axiosCatcher(toast, 'при загрузке мэшапов из VK'))
                            .finally(() => setLoading(false));
                    }}
                >
                    Загрузить ещё
                </Button>
            )}
        </div>
    );
}
