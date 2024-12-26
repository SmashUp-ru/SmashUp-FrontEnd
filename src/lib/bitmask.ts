function memoize(fn: (bitmask: number) => boolean): (bitmask: number) => boolean {
    const cache: Record<number, boolean> = {};
    return (bitmask: number) => {
        if (bitmask in cache) {
            return cache[bitmask];
        }
        const result = fn(bitmask);
        cache[bitmask] = result;
        return result;
    };
}

export const isExplicit = memoize((bitmask: number) => ((bitmask >> 0) & 1) == 1);
export const isTwitchBanned = memoize((bitmask: number) => ((bitmask >> 1) & 1) == 1);
export const isHashtagMashup = memoize((bitmask: number) => ((bitmask >> 2) & 1) == 1);
export const isAlt = memoize((bitmask: number) => ((bitmask >> 3) & 1) == 1);
export const isAdmin = memoize((bitmask: number) => ((bitmask >> 0) & 1) == 1);
export const isModerator = memoize((bitmask: number) => ((bitmask >> 1) & 1) == 1);
export const isVerified = memoize((bitmask: number) => ((bitmask >> 2) & 1) == 1);
export const isMashuper = memoize((bitmask: number) => ((bitmask >> 3) & 1) == 1);
export const isBanned = memoize((bitmask: number) => ((bitmask >> 4) & 1) == 1);
export const explicitAllowed = memoize((bitmask: number) => ((bitmask >> 0) & 1) == 1);
export const multisessionAllowed = memoize((bitmask: number) => ((bitmask >> 1) & 1) == 1);
