import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Song } from '../types';

interface MusicContextType {
    songs: Song[];
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    playSong: (song: Song) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    queue: Song[];
    setQueue: (songs: Song[]) => void;
    seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ songs: Song[]; children: ReactNode }> = ({ songs, children }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [queue, setQueue] = useState<Song[]>([]);

    const playSong = useCallback((song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setProgress(0);
    }, []);

    const playNext = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        playSong(queue[nextIndex]);
    }, [currentSong, queue, playSong]);

    useEffect(() => {
        let interval: number;
        if (isPlaying && currentSong) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= (currentSong.duration * 1000)) {
                        playNext();
                        return 0;
                    }
                    return prev + 1000;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentSong, playNext]);

    const togglePlay = useCallback(() => {
        if (currentSong) {
            setIsPlaying(prev => !prev);
        }
    }, [currentSong]);
    
    const playPrev = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        playSong(queue[prevIndex]);
    }, [currentSong, queue, playSong]);

    const seek = useCallback((time: number) => {
        if (currentSong) {
            const newProgress = Math.max(0, Math.min(time, currentSong.duration * 1000));
            setProgress(newProgress);
        }
    }, [currentSong]);

    return (
        <MusicContext.Provider value={{ songs, currentSong, isPlaying, progress, playSong, togglePlay, playNext, playPrev, queue, setQueue, seek }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusicPlayer = (): MusicContextType => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusicPlayer must be used within a MusicProvider');
    }
    return context;
};