import { useSearchStore } from '@/store/search.ts';
import CrossoverResults from '@/router/features/search/CrossoverResults.tsx';
import SearchResults from '@/router/features/search/SearchResults.tsx';

export default function SearchPageResults() {
    const type = useSearchStore((state) => state.type);

    if (type === 'search') {
        return <SearchResults />;
    }

    if (type === 'crossover') {
        return <CrossoverResults />;
    }
}
