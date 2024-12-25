export interface GetSettingsResponse {
    status: string;
    response: {
        settings: number;
    };
}

export interface GetEmailResponse {
    status: string;
    response: {
        email: string;
    };
}
