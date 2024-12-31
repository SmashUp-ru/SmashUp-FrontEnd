import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean>(
        () => window.innerWidth < MOBILE_BREAKPOINT
    );

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        if (mql.addEventListener) {
            mql.addEventListener('change', onChange);
        } else {
            mql.addListener(onChange); // Для старых браузеров
        }

        // Устанавливаем начальное состояние
        setIsMobile(mql.matches);

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', onChange);
            } else {
                mql.removeListener(onChange); // Для старых браузеров
            }
        };
    }, []);

    return isMobile;
}
