import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useState } from 'react';

export function useMashupPageData(mashupId?: string) {
    const getMashupById = useMashupStore((state) => state.getOneById);

    const [mashupLoading, setMashupLoading] = useState<boolean>(mashupId !== undefined);

    const [mashup, setMashup] = useState<Mashup | null>(null);

    useEffect(() => {
        if (mashupId) {
            getMashupById(parseInt(mashupId))
                .then((r) => setMashup(r))
                .finally(() => setMashupLoading(false));
        }
    }, [mashupId]);

    return {
        mashup,
        isLoading: mashupLoading
    };
}
