import { useCrossover } from '@/router/features/search/useCrossover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import Section from '@/router/shared/section/Section.tsx';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import { useSearchStore } from '@/store/search.ts';
import SearchResultsSkeleton from '@/router/features/search/SearchResultsSkeleton.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function CrossoverResults() {
    const { isLoading } = useGlobalStore();
    const { updateType, crossoverArtists, crossoverTracks } = useSearchStore();

    const { mashups } = useCrossover(crossoverTracks, crossoverArtists);

    if (isLoading) return <SearchResultsSkeleton />;

    return (
        <div className='flex-1'>
            <div className='flex items-center justify-between'>
                <Button size='sm' variant='ghost' className='bg-primary text-surfaceVariant'>
                    Мэшапы
                </Button>

                <div className='flex items-center justify-between'>
                    <div className='flex bg-surfaceVariant rounded-xl'>
                        <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => updateType('search')}
                            className={cn('bg-surfaceVariant text-onSurfaceVariant')}
                        >
                            Поиск
                        </Button>
                        <Button
                            size='sm'
                            variant='ghost'
                            className={cn('bg-primary text-surfaceVariant')}
                        >
                            Кроссовер
                        </Button>
                    </div>
                </div>
            </div>

            <Section title='Мэшапы' className='mt-2'>
                <div className='flex items-center '>
                    <div className='flex flex-wrap items-center'>
                        {mashups.map((mashup) => (
                            <MashupThumb mashup={mashup} searchMode key={mashup.id} />
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
