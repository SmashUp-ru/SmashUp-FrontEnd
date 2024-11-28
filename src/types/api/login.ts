export interface LoginResponse {
    status: string;
    message: string;
    response: {
        id: number;
        username: string;
        imageUrl: string;
        backgroundColor: number;
        permissions: number;
        playlists: number[];
        mashups: number[];
        token: string;
    };
}
