import { UnpublishedMashup } from '@/store/moderation.ts';

export interface GenUnpublishedMashupsResponse {
    status: string;
    response: UnpublishedMashup[];
}
