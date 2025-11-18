
export enum SubscriptionTier {
    FREE = 'free',
    STANDARD = 'standard',
    PRO = 'pro',
    ULTRA = 'ultra',
    ULTRA_PROMAX = 'ultra promax'
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    subscription: SubscriptionTier;
    isAdmin: boolean;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    artwork: string;
    lyrics?: { time: number; text: string }[];
    videoUrl?: string;
}

export interface Album {
    id: string;
    name: string;
    artist: string;
    artwork: string;
    songs: string[]; // array of song IDs
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    artwork: string;
    songIds: string[];
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
}

export interface SubscriptionFeatures {
    [key: string]: {
        name: string;
        ads: boolean;
        lyrics: boolean;
        video: boolean;
        aiPlaylists: boolean;
        hiFiAudio: boolean;
    }
}
