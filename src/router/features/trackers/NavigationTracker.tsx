import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { useUserStore } from '@/store/entities/user.ts';
import { usePlaylistStore } from '@/store/entities/playlist.ts';

export default function NavigationTracker() {
    const location = useLocation();
    const [lastLocation, setLastLocation] = useState<string | null>(null);

    const getMashupById = useMashupStore((state) => state.getOneById);
    const getUserByStringKey = useUserStore((state) => state.getOneByStringKey);
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);

    const handleLocationChange = (newLocation: string) => {
        console.log(`Transition from ${lastLocation} to ${newLocation}`);
        if (lastLocation === '/search') {
            const splitResult = newLocation.slice(1).split('/');
            const resultType = splitResult[0];

            switch (resultType) {
                case 'playlist':
                    getPlaylistById(parseInt(splitResult[1])).then((r) =>
                        localStorage.setItem(
                            'search_history',
                            JSON.stringify([
                                {
                                    href: newLocation,
                                    type: 'playlist',
                                    object: r
                                },
                                ...JSON.parse(localStorage.getItem('search_history')!)
                            ])
                        )
                    );
                    break;

                case 'mashup':
                    getMashupById(parseInt(splitResult[1])).then((r) =>
                        localStorage.setItem(
                            'search_history',
                            JSON.stringify([
                                {
                                    href: newLocation,
                                    type: 'mashup',
                                    object: r
                                },
                                ...JSON.parse(localStorage.getItem('search_history')!)
                            ])
                        )
                    );
                    break;

                case 'user':
                    getUserByStringKey('username', splitResult[1]).then((r) =>
                        localStorage.setItem(
                            'search_history',
                            JSON.stringify([
                                {
                                    href: newLocation,
                                    type: 'user',
                                    object: r
                                },
                                ...JSON.parse(localStorage.getItem('search_history')!)
                            ])
                        )
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
