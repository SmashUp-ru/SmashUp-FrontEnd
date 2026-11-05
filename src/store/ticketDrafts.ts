import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { createElement } from 'react';
import { toast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';

/**
 * Билеты на оффлайн-мероприятия — МОК: бэка нет, черновики живут в localStorage.
 * Когда появится API, стор заменится запросами; форма `TicketDraft` — черновик контракта.
 */

export type FoilType = 'none' | 'holo' | 'sparkle';
export type InfoLayout = 'bottom' | 'top' | 'minimal';
/** `custom` / `custom2` — шрифты организатора из `customFont` / `customFont2`. */
export type TicketFont = 'sans' | 'mono' | 'serif' | 'custom' | 'custom2';
export type CustomFontSlot = 'custom' | 'custom2';
export type TextAlign = 'left' | 'center' | 'right';
export type CodePosition = 'top' | 'center' | 'bottom';
/** Формат кода входа: набор, который читают и Apple Wallet, и сканеры на входе. */
export type CodeType = 'qr' | 'pdf417' | 'aztec' | 'code128' | 'text';

/** Оформление — даёт организатор; код карты один на всех. Картинки и шрифт — data URL. */
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

export interface TicketEvent {
    name: string;
    /** yyyy-mm-dd */
    date: string;
    /** hh:mm */
    time: string;
    city: string;
    venue: string;
    /** Тираж — номер показывается как «№ 0137 / 500». */
    capacity?: number;
    /** Текст оборота: правила входа, тайминг и т. п. */
    backText?: string;
    /** Надпись штампа после мероприятия. */
    stampText?: string;
    lineup?: LineupArtist[];
}

/** Мешапер в лайнапе — ссылка на профиль SmashUp. */
export interface LineupArtist {
    id: number;
    username: string;
    imageUrl?: string;
}

/** Уровень билета (VIP, бэкстейдж…): переопределяет часть оформления базового. */
export interface TicketTier {
    id: string;
    name: string;
    skin: Partial<TicketSkin>;
}

export interface TicketDraft {
    id: string;
    event: TicketEvent;
    skin: TicketSkin;
    tiers: TicketTier[];
    updatedAt: number;
}

export function formatTicketDate({ date, time }: Pick<TicketEvent, 'date' | 'time'>) {
    if (!date) return '';
    const d = new Date(`${date}T00:00`).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return time ? `${d}, ${time}` : d;
}

export const newTicketDraft = (): TicketDraft => ({
    id: crypto.randomUUID(),
    event: { name: 'Новое мероприятие', date: '', time: '', city: '', venue: '' },
    skin: { ...DEFAULT_SKIN },
    tiers: [],
    updatedAt: Date.now()
});

interface TicketDraftsState {
    drafts: TicketDraft[];
    save: (draft: TicketDraft) => void;
    remove: (id: string) => void;
}

// Картинки в data URL быстро съедают ~5 МБ localStorage — не падаем молча.
const safeStorage: StateStorage = {
    getItem: (k) => localStorage.getItem(k),
    removeItem: (k) => localStorage.removeItem(k),
    setItem: (k, v) => {
        try {
            localStorage.setItem(k, v);
        } catch {
            toast({
                element: createElement(ErrorToast, {
                    icon: true,
                    before: 'Не хватает места в браузере,',
                    after: 'последние изменения не сохранятся'
                }),
                duration: 4000,
                variant: 'destructive'
            });
        }
    }
};

export const useTicketDrafts = create<TicketDraftsState>()(
    persist(
        (set) => ({
            // Пустым редактор не бывает: всегда есть хотя бы один черновик.
            drafts: [newTicketDraft()],
            save: (draft) =>
                set((s) => {
                    const next = { ...draft, updatedAt: Date.now() };
                    const i = s.drafts.findIndex((d) => d.id === draft.id);
                    return {
                        drafts:
                            i === -1
                                ? [next, ...s.drafts]
                                : s.drafts.map((d) => (d.id === draft.id ? next : d))
                    };
                }),
            remove: (id) =>
                set((s) => {
                    const drafts = s.drafts.filter((d) => d.id !== id);
                    return { drafts: drafts.length ? drafts : [newTicketDraft()] };
                })
        }),
        {
            name: 'ticket-drafts',
            storage: createJSONStorage(() => safeStorage),
            // Новые поля скина у старых черновиков — из дефолтов.
            merge: (persisted, current) => {
                const drafts = (persisted as Partial<TicketDraftsState> | undefined)?.drafts;
                if (!drafts?.length) return current;
                return {
                    ...current,
                    drafts: drafts.map((d) => ({
                        ...d,
                        tiers: d.tiers ?? [],
                        skin: { ...DEFAULT_SKIN, ...d.skin }
                    }))
                };
            }
        }
    )
);
