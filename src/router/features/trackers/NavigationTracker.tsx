import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearchStore } from '@/store/search.ts';

export default function NavigationTracker() {
    const location = useLocation();
    const { searchValue } = useSearchStore();

    const [lastLocation, setLastLocation] = useState<string | null>(null);

    const handleLocationChange = (newLocation: string) => {
        console.log(`Transition from ${lastLocation} to ${newLocation}`);
        if (lastLocation === '/search' && searchValue) {
            const splitResult = newLocation.slice(1).split('/');
            const resultType = splitResult[0];
            const resultId = splitResult[1];

            switch (resultType) {
                case 'playlist':
                    localStorage.setItem(
                        'search_history',
                        JSON.stringify([
                            {
                                type: 'playlist',
                                id: resultId
                            },
                            ...JSON.parse(localStorage.getItem('search_history')!)
                        ])
                    );
                    break;

                case 'mashup':
                    localStorage.setItem(
                        'search_history',
                        JSON.stringify([
                            {
                                type: 'mashup',
                                id: resultId
                            },
                            ...JSON.parse(localStorage.getItem('search_history')!)
                        ])
                    );
                    break;

                case 'user':
                    localStorage.setItem(
                        'search_history',
                        JSON.stringify([
                            {
                                type: 'user',
                                id: resultId
                            },
                            ...JSON.parse(localStorage.getItem('search_history')!)
                        ])
                    );
                    break;
            }
        }
    };

    useEffect(() => {
        if (location && location.pathname !== lastLocation) {
            handleLocationChange(location.pathname);
            setLastLocation(location.pathname);
        }
    }, [location]);

    return null;
}
