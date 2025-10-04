import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { removeItem } from '@/lib/utils';

export default function NavigationTracker() {
    const location = useLocation();

    const [lastLocation, setLastLocation] = useState<string | null>(null);

    const handleLocationChange = useCallback((newLocation: string, searchId: string | null) => {
        if (!newLocation || !searchId) {
            return;
        }

        const splitResult = newLocation.slice(1).split('/');
        const resultType = splitResult[0];

        let entity;

        switch (resultType) {
            case 'playlist':
                entity = {
                    type: 'playlist',
                    id: searchId
                };
                break;

            case 'mashup':
                entity = {
                    type: 'mashup',
                    id: searchId
                };
                break;

            case 'user':
                entity = {
                    type: 'user',
                    id: searchId
                };
                break;

            default:
                break;
        }

        if (entity) {
            let history = JSON.parse(localStorage.getItem('search_history') || '[]');
            history = removeItem(history, entity, (l, r) => l.type === r.type && l.id === r.id);

            history = [entity, ...history];

            if (history.length > 15) {
                history.pop();
            }

            localStorage.setItem('search_history', JSON.stringify(history));
        }
    }, []);

    useEffect(() => {
        if (location && location.pathname !== lastLocation) {
            const params = new URLSearchParams(location.search);
            const searchId = params.get('searchId');
            handleLocationChange(location.pathname, searchId);
            setLastLocation(location.pathname);
        }
    }, [location]);

    return null;
}
