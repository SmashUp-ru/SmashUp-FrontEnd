import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NavigationTracker() {
    const location = useLocation();

    const [lastLocation, setLastLocation] = useState<string | null>(null);

    const handleLocationChange = (newLocation: string, searchId: string | null) => {
        console.log(`Transition from ${lastLocation} to ${newLocation}`);

        if (!newLocation || !searchId) {
            return;
        }

        const splitResult = newLocation.slice(1).split('/');
        const resultType = splitResult[0];

        switch (resultType) {
            case 'playlist':
                localStorage.setItem(
                    'search_history',
                    JSON.stringify([
                        {
                            type: 'playlist',
                            id: searchId
                        },
                        ...JSON.parse(localStorage.getItem('search_history') || '[]')
                    ])
                );
                break;

            case 'mashup':
                localStorage.setItem(
                    'search_history',
                    JSON.stringify([
                        {
                            type: 'mashup',
                            id: searchId
                        },
                        ...JSON.parse(localStorage.getItem('search_history') || '[]')
                    ])
                );
                break;

            case 'user':
                localStorage.setItem(
                    'search_history',
                    JSON.stringify([
                        {
                            type: 'user',
                            id: searchId
                        },
                        ...JSON.parse(localStorage.getItem('search_history') || '[]')
                    ])
                );
                break;

            default:
                break;
        }
    };

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
