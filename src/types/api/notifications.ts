export interface NotificationType {
    id: number;
    imageUrl: string | null;
    meta: Record<string, string | number | boolean>;
}

export interface ConfirmCoAuthorshipNotificationType extends NotificationType {
    meta: {
        type: 'CONFIRM_CO_AUTHORSHIP';
        mashupId: number;
    };
}

export interface MashupStatusNotificationType extends NotificationType {
    meta: {
        type: 'MASHUP_STATUS';
        mashupName: string;
        published: boolean;
        reason: string;
    };
}
