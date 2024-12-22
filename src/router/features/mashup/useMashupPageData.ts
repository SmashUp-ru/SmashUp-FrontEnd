import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useMashupPageData(mashupId?: string) {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const getMashupById = useMashupStore((state) => state.getOneById);

    const [mashupLoading, setMashupLoading] = useState<boolean>(false);

    useEffect(() => {
        setMashupLoading(true);
        startLoading();
    }, []);

    useEffect(() => {
        updateIsLoading(mashupLoading);
    }, [mashupLoading]);

    const [mashup, setMashup] = useState<Mashup | null>(null);

    useEffect(() => {
        if (mashupId) {
            getMashupById(parseInt(mashupId))
                .then((r) => setMashup(r))
                .then(() => setMashupLoading(false));
        }
    }, [mashupId]);

    return {
        mashup,
        isLoading: mashupLoading
    };
}
