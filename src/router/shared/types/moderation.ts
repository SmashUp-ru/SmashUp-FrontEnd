import { UnpublishedMashup } from '@/store/moderation.ts';

export interface GetUnpublishedMashupsResponse {
    status: string;
    response: UnpublishedMashup[];
}
