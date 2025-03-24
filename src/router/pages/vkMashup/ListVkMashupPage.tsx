import { VkMashup } from '@/store/entities/vkMashup';
import { useVkMashups } from './useVkMashups';
import VkMashupItem from './VkMashupItem';
import { Button } from '@/components/ui/button';
import { axiosCatcher } from '@/router/shared/toasts/axios';
import { useToast } from '@/router/shared/hooks/use-toast';

export default function ListVkMashupPage() {
    const { toast } = useToast();

    const { isLoading, setLoading, vkMashups, updateVkMashups, loadVkMashups } = useVkMashups();

    if (vkMashups === null) {
        // TODO: skeleton
        return <></>;
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

    return (
        <div className='flex flex-col gap-y-5'>
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
