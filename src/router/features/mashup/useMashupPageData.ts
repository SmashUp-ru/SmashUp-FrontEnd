import { useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useMemo } from 'react';

export function useMashupPageData(mashupId?: string) {
    const getMashupById = useMashupStore((state) => state.getOneById);
    const mashupCache = useMashupStore((state) => state.cache);

    const mashup = useMemo(() => {
        if (!mashupId) return null;
        return mashupCache[parseInt(mashupId)];
    }, [mashupId, mashupCache]);

    const isLoading = useMemo(() => mashupId !== undefined && !mashup, [mashupId, mashup]);

    useEffect(() => {
        if (mashupId && !mashup) {
            getMashupById(parseInt(mashupId)).catch(console.error);
        }
    }, [mashupId, mashup, getMashupById]);

    return {
        mashup,
        isLoading
    };
}
