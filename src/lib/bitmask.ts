/**
 * Хелперы для работы с битовыми масками SmashUp.
 *
 * ⚠️ КРИТИЧНО: три независимые группы масок ПЕРЕИСПОЛЬЗУЮТ одни и те же
 * номера бит (0–4) для СОВЕРШЕННО РАЗНОГО смысла. Бит сам по себе ничего не
 * значит — значение определяется тем, к какому полю применён хелпер. Никогда
 * не передавай маску одной группы в хелпер другой (например `isExplicit` на
 * `user.permissions`) — компилятор это не поймает, оба аргумента просто `number`.
 *
 * Раскладка бит по группам:
 *
 * 1) `mashup.statuses` (статусы мешапа):
 *    - бит 0 → explicit (`isExplicit`/`setExplicit`)
 *    - бит 1 → забанен на Twitch (`isTwitchBanned`/`setTwitchBanned`)
 *    - бит 2 → хэштег-мешап / base (`isHashtagMashup`/`setHashtagMashup`)
 *    - бит 3 → alt-версия (`isAlt`/`setAlt`)
 *
 * 2) `user.permissions` (права пользователя):
 *    - бит 0 → админ (`isAdmin`/`setAdmin`)
 *    - бит 1 → модератор (`isModerator`/`setModerator`)
 *    - бит 2 → верифицирован (`isVerified`/`setVerified`)
 *    - бит 3 → мешапер (`isMashuper`/`setMashuper`)
 *    - бит 4 → забанен (`isBanned`/`setBanned`)
 *
 * 3) `settings` (настройки пользователя, см. `store/settings.ts`):
 *    - бит 0 → разрешён explicit-контент (`explicitAllowed`/`setExplicitAllowed`)
 *    - бит 1 → разрешено несколько сессий (`multisessionAllowed`/`setMultisessionAllowed`)
 */

/**
 * Фабрика пары хелперов для одного бита.
 *
 * Возвращает кортеж `[is, set]`:
 * - `is(bitmask)` — выставлен ли указанный бит;
 * - `set(bitmask, value)` — вернуть НОВУЮ маску с битом, выставленным в `value`
 *   (исходная маска не мутируется; при `value=false` бит сбрасывается).
 *
 * `bit` фиксируется в замыкании — отсюда и переиспользование одного и того же
 * номера бита в разных группах ниже (см. шапку файла).
 */
function handleBitmask(
    bit: number
): [(bitmask: number) => boolean, (bitmask: number, value: boolean) => number] {
    return [
        (bitmask: number) => ((bitmask >> bit) & 1) == 1,
        (bitmask: number, value: boolean) => (value ? bitmask | (1 << bit) : bitmask & ~(1 << bit))
    ];
}

/**
 * Инвертирует один бит маски (toggle).
 *
 * Принимает пару `is`/`set` от одного и того же `handleBitmask` — читает
 * текущее значение бита через `is` и записывает противоположное через `set`.
 * Передавай согласованную пару (например `isExplicit`, `setExplicit`):
 * хелперы от разных бит дадут бессмысленный результат, и TS этого не отловит.
 */
export function switchBit(
    bitmask: number,
    is: (bitmask: number) => boolean,
    set: (bitmask: number, value: boolean) => number
): number {
    return set(bitmask, !is(bitmask));
}

/** Группа 1 — маска `mashup.statuses` (биты 0–3 описаны в шапке файла). */
export const [isExplicit, setExplicit] = handleBitmask(0);
export const [isTwitchBanned, setTwitchBanned] = handleBitmask(1);
export const [isHashtagMashup, setHashtagMashup] = handleBitmask(2);
export const [isAlt, setAlt] = handleBitmask(3);

/**
 * Группа 2 — маска `user.permissions` (биты 0–4 описаны в шапке файла).
 * ⚠️ Биты 0–3 ПЕРЕСЕКАЮТСЯ по номерам с группой 1, но значат другое
 * (0=админ, не explicit; 1=модератор, не twitch-бан и т.д.).
 */
export const [isAdmin, setAdmin] = handleBitmask(0);
export const [isModerator, setModerator] = handleBitmask(1);
export const [isVerified, setVerified] = handleBitmask(2);
export const [isMashuper, setMashuper] = handleBitmask(3);
export const [isBanned, setBanned] = handleBitmask(4);

/**
 * Группа 3 — маска пользовательских `settings` (биты 0–1 описаны в шапке файла).
 * ⚠️ Бит 0 здесь = «разрешён explicit», бит 1 = «несколько сессий» — снова
 * другой смысл, чем у тех же бит в группах 1 и 2.
 */
export const [explicitAllowed, setExplicitAllowed] = handleBitmask(0);
export const [multisessionAllowed, setMultisessionAllowed] = handleBitmask(1);
