import type { SmashUpEvent } from '@/store/entities/event.ts';

export type FoilType = 'none' | 'holo' | 'sparkle';
export type InfoLayout = 'bottom' | 'top' | 'minimal';
/** `custom` / `custom2` — шрифты организатора из `customFont` / `customFont2`. */
export type TicketFont = 'sans' | 'mono' | 'serif' | 'custom' | 'custom2';
export type CustomFontSlot = 'custom' | 'custom2';
export type TextAlign = 'left' | 'center' | 'right';
export type CodePosition = 'top' | 'center' | 'bottom';
/** Формат кода входа: набор, который читают и Apple Wallet, и сканеры на входе. */
export type CodeType = 'qr' | 'pdf417' | 'aztec' | 'code128' | 'text';

/** Оформление — даёт организатор; код карты один на всех. Картинки и шрифты хранятся именами ассетов. */
export interface TicketSkin {
    art?: string;
    /** PNG с прозрачностью — передний план, едет в параллаксе сильнее арта. */
    foreground?: string;
    back?: string;
    /** PNG с прозрачностью: фольга блестит только там, где маска непрозрачна. */
    mask?: string;
    /** PNG с прозрачностью: форма тиснения — светотень от наклона, без блеска. */
    emboss?: string;
    /** Полоса логотипов партнёров на обороте (PNG). */
    partners?: string;
    /** Свой шрифт организатора (woff2/woff/ttf/otf). */
    customFont?: { name: string; data: string };
    /** Второй шрифт организатора — например, отдельный для заголовка и для текста. */
    customFont2?: { name: string; data: string };
    bg: string;
    text: string;
    foil: FoilType;
    /** 0…1 */
    foilStrength: number;
    /** Сдвиг оттенка голограммы, градусы. */
    holoHue: number;
    /** Угол полос голограммы, градусы. */
    holoAngle: number;
    /** 0…1 */
    glare: number;
    /** Максимальный наклон, градусы. */
    tilt: number;
    /** Расхождение арта и переднего плана при наклоне, % ширины карты (каждый слой в свою сторону). */
    depth: number;
    info: InfoLayout;
    align: TextAlign;
    scrim: boolean;
    titleFont: TicketFont;
    bodyFont: TicketFont;
    /** Множитель кегля заголовка. */
    titleScale: number;
    uppercase: boolean;
    showAvatar: boolean;
    lineupOnFront: boolean;
    backCodePos: CodePosition;
    codeType: CodeType;
    /** Скругление, % ширины карты. */
    radius: number;
    /** Рамка: толщина в % ширины, 0 — нет. */
    frameWidth: number;
    frameColor: string;
}

export const DEFAULT_SKIN: TicketSkin = {
    bg: '#1d1630',
    text: '#ffffff',
    foil: 'holo',
    foilStrength: 0.6,
    holoHue: 0,
    holoAngle: 115,
    glare: 1,
    tilt: 14,
    depth: 2.5,
    info: 'bottom',
    align: 'left',
    scrim: true,
    titleFont: 'sans',
    bodyFont: 'sans',
    titleScale: 1,
    uppercase: false,
    showAvatar: true,
    lineupOnFront: false,
    backCodePos: 'center',
    codeType: 'qr',
    radius: 7,
    frameWidth: 0,
    frameColor: '#ffffff'
};

export interface TicketDesign {
    skin: TicketSkin;
    tiers: TicketTier[];
    capacity?: number;
    backText?: string;
    stampText?: string;
}

export type TicketEvent = Pick<
    SmashUpEvent,
    'name' | 'startsAt' | 'timezone' | 'city' | 'venue' | 'lineup'
> &
    Pick<TicketDesign, 'capacity' | 'backText' | 'stampText'>;

/** Мешапер в поиске лайнапа. */
export interface LineupArtist {
    id: number;
    username: string;
    imageUrl?: string;
}

/** Уровень билета переопределяет часть базового оформления. */
export interface TicketTier {
    id: string;
    name: string;
    skin: Partial<TicketSkin>;
}

export function normalizeTicketDesign(design: TicketDesign | null): TicketDesign {
    return { ...design, skin: { ...DEFAULT_SKIN, ...design?.skin }, tiers: design?.tiers ?? [] };
}
