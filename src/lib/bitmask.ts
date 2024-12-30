function handleBitmask(
    bit: number
): [(bitmask: number) => boolean, (bitmask: number, value: boolean) => number] {
    return [
        (bitmask: number) => ((bitmask >> bit) & 1) == 1,
        (bitmask: number, value: boolean) => (value ? bitmask | (1 << bit) : bitmask & ~(1 << bit))
    ];
}

export function switchBit(
    bitmask: number,
    is: (bitmask: number) => boolean,
    set: (bitmask: number, value: boolean) => number
) {
    set(bitmask, !is(bitmask));
}

export const [isExplicit, setExplicit] = handleBitmask(0);
export const [isTwitchBanned, setTwitchBanned] = handleBitmask(1);
export const [isHashtagMashup, setHashtagMashup] = handleBitmask(2);
export const [isAlt, setAlt] = handleBitmask(3);
export const [isAdmin, setAdmin] = handleBitmask(0);
export const [isModerator, setModerator] = handleBitmask(1);
export const [isVerified, setVerified] = handleBitmask(2);
export const [isMashuper, setMashuper] = handleBitmask(3);
export const [isBanned, setBanned] = handleBitmask(4);
export const [explicitAllowed, setExplicitAllowed] = handleBitmask(0);
export const [multisessionAllowed, setMultisessionAllowed] = handleBitmask(1);
