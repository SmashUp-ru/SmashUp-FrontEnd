import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosSession } from '@/lib/utils.ts';
import { DEFAULT_SKIN, normalizeTicketDesign } from '@/store/ticketDrafts.ts';
import { TICKET_ASSET_MAX_BYTES, uploadTicketAsset, validateTicketDesign } from './ticketAssets.ts';

vi.mock('@/lib/utils.ts', () => ({ axiosSession: { post: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

describe('дизайн билета', () => {
    it('новые поля берёт из дефолтов, уровни сохраняет частичными', () => {
        const design = normalizeTicketDesign({
            skin: { bg: '#000' },
            tiers: [{ id: 'vip', name: 'VIP', skin: { text: '#f00' } }],
            capacity: 500
        } as ReturnType<typeof normalizeTicketDesign>);
        expect(design.skin).toEqual({ ...DEFAULT_SKIN, bg: '#000' });
        expect(design.tiers[0].skin).toEqual({ text: '#f00' });
        expect(design.capacity).toBe(500);
        expect(normalizeTicketDesign(null)).toEqual({ skin: DEFAULT_SKIN, tiers: [] });
    });

    it('не отправляет data URL, включая шрифты и уровни', () => {
        const design = normalizeTicketDesign(null);
        design.tiers = [
            {
                id: 'vip',
                name: 'VIP',
                skin: { customFont: { name: 'Font', data: 'data:font/woff2;base64,AAAA' } }
            }
        ];
        expect(() => validateTicketDesign(design)).toThrow('data:');
        design.tiers[0].skin.customFont!.data = 'hash.woff2';
        expect(() => validateTicketDesign(design)).not.toThrow();
    });

    it('считает ограничение 512 КБ в UTF-8, а не в символах', () => {
        const design = normalizeTicketDesign(null);
        design.backText = 'я'.repeat(270_000);
        expect(() => validateTicketDesign(design)).toThrow('512 КБ');
    });
});

describe('ассеты билета', () => {
    it('отправляет base64 без префикса, читает имя из response', async () => {
        vi.mocked(axiosSession.post).mockResolvedValue({
            data: { status: 'ok', response: { name: 'hash.webp' } }
        });
        expect(await uploadTicketAsset('data:image/webp;base64,YWJj')).toBe('hash.webp');
        expect(axiosSession.post).toHaveBeenCalledWith('/ticket/asset', { basedFile: 'YWJj' });
    });

    it('не отправляет ассет больше 5 МБ', async () => {
        await expect(
            uploadTicketAsset(
                'data:font/woff;base64,' +
                    'A'.repeat(Math.ceil((TICKET_ASSET_MAX_BYTES + 1) / 3) * 4)
            )
        ).rejects.toThrow('5 МБ');
        expect(axiosSession.post).not.toHaveBeenCalled();
    });
});
