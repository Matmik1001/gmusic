
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import AuthScreen from './components/AuthScreen';
import MainApp from './components/MainApp';
import { mockUsers, mockSongs, mockPlaylists, mockAnnouncements } from './data';
import { User, Song, Playlist, Announcement, SubscriptionTier } from './types';

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();
    
    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-sans">
            {currentUser ? (
                <MusicProvider songs={mockSongs}>
                    <MainApp />
                </MusicProvider>
            ) : (
                <AuthScreen />
            )}
        </div>
    );
};


const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [songs, setSongs] = useState<Song[]>(mockSongs);
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

    const appData = useMemo(() => ({
        users,
        songs,
        playlists,
        announcements,
        setUsers,
        setSongs,
        setPlaylists,
        setAnnouncements,
    }), [users, songs, playlists, announcements]);

    return (
        <AuthProvider initialUsers={mockUsers}>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
