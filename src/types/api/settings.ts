import { User } from '@/store/entities/user.ts';

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

export interface UpdateUserImageResponse {
    status: string;
    response: User;
}

export interface UpdateUsernameConfirmResponse {
    status: string;
    response: {
        username: string;
    };
}

export interface UpdateEmailConfirmResponse {
    status: string;
    response: {
        email: string;
    };
}
