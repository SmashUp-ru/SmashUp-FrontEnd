import { axiosSession } from '@/lib/utils.ts';
import type { SmashUpResponse } from '@/router/shared/types/smashup.ts';
import type { TicketDesign } from '@/store/ticketDrafts.ts';

export const TICKET_ASSET_MAX_BYTES = 5 * 1024 * 1024;

export async function uploadTicketAsset(data: string): Promise<string> {
    const basedFile = data.slice(data.indexOf(',') + 1);
    const bytes =
        (basedFile.length * 3) / 4 -
        (basedFile.endsWith('==') ? 2 : basedFile.endsWith('=') ? 1 : 0);
    if (bytes > TICKET_ASSET_MAX_BYTES) throw new Error('Файл должен быть не больше 5 МБ');
    const r = await axiosSession.post<SmashUpResponse<{ name: string }>>('/ticket/asset', {
        basedFile
    });
    return r.data.response.name;
}

export function validateTicketDesign(design: TicketDesign) {
    const json = JSON.stringify(design);
    if (json.includes('data:')) throw new Error('Оформление не должно содержать «data:»');
    if (new TextEncoder().encode(json).length > 512 * 1024)
        throw new Error('Оформление должно быть не больше 512 КБ');
}
