import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ticketAssetUrl } from '@/lib/cdn.ts';
import { DEFAULT_SKIN } from '@/store/ticketDrafts.ts';
import TicketCard from './TicketCard.tsx';

vi.mock('./TicketCode.tsx', () => ({ default: () => null }));

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

it('картинки и два шрифта берёт с CDN, дату и лайнап из мероприятия', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            disconnect() {}
        }
    );
    const fontFace = vi.fn(function (family: string, source: string) {
        return {
            family,
            source,
            async load() {
                return this;
            }
        };
    });
    vi.stubGlobal('FontFace', fontFace);
    Object.defineProperty(document, 'fonts', { configurable: true, value: { add: vi.fn() } });
    const { container } = render(
        <TicketCard
            event={{
                name: 'Ночной концерт',
                startsAt: Date.UTC(2026, 11, 12, 17),
                timezone: 'Asia/Vladivostok',
                city: 'Владивосток',
                venue: 'Клуб',
                lineup: [{ name: 'Гость без аккаунта', userIds: [] }]
            }}
            skin={{
                ...DEFAULT_SKIN,
                foil: 'none',
                art: 'art.webp',
                foreground: 'fg.webp',
                back: 'back.webp',
                mask: 'mask.webp',
                emboss: 'emboss.webp',
                partners: 'partners.svg',
                customFont: { name: 'Title', data: 'title.woff2' },
                customFont2: { name: 'Body', data: 'body.ttf' },
                titleFont: 'custom',
                bodyFont: 'custom2'
            }}
            holder={{ username: 'guest' }}
            serial={137}
            code='SU-0007'
        />
    );
    expect(screen.getAllByText(/13 декабря.*03:00/)).toHaveLength(2);
    expect(screen.getByText('Гость без аккаунта')).toBeInTheDocument();
    for (const file of [
        'art.webp',
        'fg.webp',
        'back.webp',
        'mask.webp',
        'emboss.webp',
        'partners.svg'
    ])
        expect(container.innerHTML).toContain(ticketAssetUrl(file));
    await waitFor(() => expect(document.fonts.add).toHaveBeenCalledTimes(2));
    expect(fontFace.mock.calls.map((args) => args[1])).toEqual([
        `url(${ticketAssetUrl('title.woff2')})`,
        `url(${ticketAssetUrl('body.ttf')})`
    ]);
    expect(new Set(fontFace.mock.calls.map((args) => args[0])).size).toBe(2);
});
