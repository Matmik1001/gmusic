
import { User, Song, Playlist, Announcement, SubscriptionTier, SubscriptionFeatures } from './types';

export const ADMIN_CREDENTIALS = {
    name: 'matt',
    password: '2406'
};

export const SUBSCRIPTION_FEATURES: SubscriptionFeatures = {
    [SubscriptionTier.FREE]: { name: 'Free', ads: true, lyrics: false, video: false, aiPlaylists: false, hiFiAudio: false },
    [SubscriptionTier.STANDARD]: { name: 'Standard', ads: false, lyrics: true, video: false, aiPlaylists: false, hiFiAudio: false },
    [SubscriptionTier.PRO]: { name: 'Pro', ads: false, lyrics: true, video: true, aiPlaylists: false, hiFiAudio: false },
    [SubscriptionTier.ULTRA]: { name: 'Ultra', ads: false, lyrics: true, video: true, aiPlaylists: true, hiFiAudio: false },
    [SubscriptionTier.ULTRA_PROMAX]: { name: 'Ultra ProMax', ads: false, lyrics: true, video: true, aiPlaylists: true, hiFiAudio: true },
};

export const mockUsers: User[] = [
    { id: 1, name: 'matt', email: 'matt@geminimusic.com', password: '2406', subscription: SubscriptionTier.ULTRA_PROMAX, isAdmin: true },
    { id: 2, name: 'Alice', email: 'alice@email.com', password: 'password', subscription: SubscriptionTier.PRO, isAdmin: false },
    { id: 3, name: 'Bob', email: 'bob@email.com', password: 'password', subscription: SubscriptionTier.FREE, isAdmin: false },
    { id: 4, name: 'Charlie', email: 'charlie@email.com', password: 'password', subscription: SubscriptionTier.STANDARD, isAdmin: false },
];

export const mockSongs: Song[] = [
    { 
        id: 's1', title: 'Starlight', artist: 'Cosmic Echoes', album: 'Galaxy Tunes', duration: 210, 
        artwork: 'https://picsum.photos/seed/s1/500/500', 
        lyrics: [
            { time: 5, text: "Lost in the shimmer of a distant light" },
            { time: 10, text: "A cosmic ballet in the endless night" },
            { time: 15, text: "We're chasing comets, holding on so tight" },
            { time: 20, text: "Underneath the starlight, everything's alright" },
            { time: 25, text: "Yeah, the starlight..." },
        ],
        videoUrl: 'https://example.com/video1'
    },
    { 
        id: 's2', title: 'Ocean Deep', artist: 'Tidal Waves', album: 'Blue Horizon', duration: 185, 
        artwork: 'https://picsum.photos/seed/s2/500/500',
        lyrics: [
            { time: 5, text: "Beneath the surface, a world unseen" },
            { time: 10, text: "Where silent giants drift in liquid green" },
            { time: 15, text: "My heart is anchored in this serene" },
            { time: 20, text: "A tranquil, deep, and endless scene" },
        ]
    },
    { 
        id: 's3', title: 'City Lights', artist: 'Urban Pulse', album: 'Neon Dreams', duration: 240, 
        artwork: 'https://picsum.photos/seed/s3/500/500',
        videoUrl: 'https://example.com/video3'
    },
    { id: 's4', title: 'Forest Whisper', artist: 'Earthen Ring', album: 'Ancient Woods', duration: 300, artwork: 'https://picsum.photos/seed/s4/500/500' },
    { id: 's5', title: 'Retro Drive', artist: 'Synth Riders', album: '8-Bit Sunset', duration: 195, artwork: 'https://picsum.photos/seed/s5/500/500' },
    { id: 's6', title: 'Solar Flare', artist: 'Cosmic Echoes', album: 'Galaxy Tunes', duration: 220, artwork: 'https://picsum.photos/seed/s6/500/500' },
    { id: 's7', title: 'Mountain High', artist: 'Summit Seekers', album: 'Altitude', duration: 260, artwork: 'https://picsum.photos/seed/s7/500/500' }
];

export const mockPlaylists: Playlist[] = [
    { id: 'p1', name: 'Chill Vibes', description: 'Relax and unwind with these smooth tracks.', artwork: 'https://picsum.photos/seed/p1/500/500', songIds: ['s2', 's4'] },
    { id: 'p2', name: 'Workout Beats', description: 'Get pumped up for your workout session.', artwork: 'https://picsum.photos/seed/p2/500/500', songIds: ['s3', 's5', 's7'] },
    { id: 'p3', name: 'Cosmic Journey', description: 'Explore the universe with these epic sounds.', artwork: 'https://picsum.photos/seed/p3/500/500', songIds: ['s1', 's6'] },
];

export const mockAnnouncements: Announcement[] = [
    { id: 'a1', title: 'Welcome to Gemini Music!', content: 'The future of music is here. Enjoy AI-powered playlists and more.', date: '2023-10-26' },
    { id: 'a2', title: 'New Album: Galaxy Tunes', content: 'Listen to the latest album from Cosmic Echoes now!', date: '2023-10-25' },
];
