import { useMashupStore } from '@/store/entities/mashup.ts';
import { useCachedEntityById } from '@/store/entities/useCachedEntity.ts';

export function useMashupPageData(mashupId?: string) {
    const getMashupById = useMashupStore((state) => state.getOneById);
    const mashupCache = useMashupStore((state) => state.cache);

    const { entity: mashup, isLoading } = useCachedEntityById(mashupId, getMashupById, mashupCache);

    return {
        mashup,
        isLoading
    };
}
