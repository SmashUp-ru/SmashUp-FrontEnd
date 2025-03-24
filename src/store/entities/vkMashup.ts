// export interface VkMashup {
//     name: string;
//     singer: string;
//     signerId: number | null;
//     duration: number;
//     postUrl: string;
//     fileURL: string;
//     coverURL: string | null;
//     createdAt: string;
//     audioIdVk: number;
//     audioOwnerId: number;
// }

export interface VkMashup {
    audioId: number;
    ownerId: number;
    signerId: number | null;
    artist: string;
    name: string;
    groupId: number;
    postId: number;
    publishTime: number;
    imageUrl: string | null;
    audioUrl: string | null;
    duration: number | null;
}

export interface CachedVkMashup extends VkMashup {
    page: number;
}

export interface VkMashupKey {
    audioId: number;
    ownerId: number;
}

export interface VkMashups {
    total: number;
    pages: Map<number, VkMashup[]>;
    mashups: Map<string, CachedVkMashup>;
}

export interface VkMashupsResponse {
    total: number;
    mashups: VkMashup[];
}
