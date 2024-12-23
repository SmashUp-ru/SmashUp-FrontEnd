export function isExplicit(bitmask: number): boolean {
    return ((bitmask >> 0) & 1) == 1;
}

export function isMashup(bitmask: number): boolean {
    return ((bitmask >> 1) & 1) == 1;
}

export function isAlt(bitmask: number): boolean {
    return ((bitmask >> 2) & 1) == 1;
}

export function isAdmin(bitmask: number): boolean {
    return ((bitmask >> 0) & 1) == 1;
}

export function isModerator(bitmask: number): boolean {
    return ((bitmask >> 1) & 1) == 1;
}

export function isVerified(bitmask: number): boolean {
    return ((bitmask >> 2) & 1) == 1;
}

export function isMashuper(bitmask: number): boolean {
    return ((bitmask >> 3) & 1) == 1;
}

export function isBanned(bitmask: number): boolean {
    return ((bitmask >> 4) & 1) == 1;
}

export function explicitAllowed(bitmask: number): boolean {
    return ((bitmask >> 0) & 1) == 1;
}

export function multisessionAllowed(bitmask: number): boolean {
    return ((bitmask >> 1) & 1) == 1;
}
