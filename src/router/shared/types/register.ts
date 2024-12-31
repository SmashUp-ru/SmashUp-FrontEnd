export interface RegisterResponse {
    status: string;
    message: string;
    response: {
        id: number;
        username: string;
        imageUrl: string;
        backgroundColor: number;
        permissions: number;
        token: string;
    };
}
