import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicContext';
import { mockSongs, mockPlaylists, mockAnnouncements, SUBSCRIPTION_FEATURES } from '../data';
import { Playlist, Song, Announcement, SubscriptionTier } from '../types';
import AdminPanel from './AdminPanel';
import { generatePlaylistFromPrompt } from '../services/geminiService';


const MainApp: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [view, setView] = useState('browse');
    const features = useMemo(() => currentUser ? SUBSCRIPTION_FEATURES[currentUser.subscription] : SUBSCRIPTION_FEATURES[SubscriptionTier.FREE], [currentUser]);

    const content = () => {
        switch(view) {
            case 'admin':
                return currentUser?.isAdmin ? <AdminPanel setView={setView}/> : <Browse setView={setView}/>;
            case 'browse':
            default:
                return <Browse setView={setView}/>;
        }
    };

    return (
        <div className="grid grid-rows-[1fr_auto] h-screen">
            <div className="grid grid-cols-[250px_1fr] overflow-hidden">
                <Sidebar setView={setView} />
                <main className="overflow-y-auto p-8 relative">
                    {features.ads && <AdBanner />}
                    {content()}
                </main>
            </div>
            <Player />
        </div>
    );
};

// Sub-components defined outside MainApp to prevent re-renders
const AdBanner: React.FC = () => (
    <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-center p-2 text-sm font-semibold z-20">
        Upgrade to remove ads and unlock more features!
    </div>
);

// FIX: Destructured `setView` from props to make it accessible.
const Sidebar: React.FC<{setView: (view: string) => void}> = ({setView}) => {
    const { currentUser, logout } = useAuth();
    return (
        <aside className="bg-black/20 backdrop-blur-lg p-6 flex flex-col justify-between border-r border-white/10">
            <div>
                <h1 className="text-2xl font-bold tracking-wider mb-10">Gemini Music</h1>
                <nav className="space-y-4">
                    <button onClick={() => setView('browse')} className="flex items-center space-x-3 text-lg font-semibold text-gray-300 hover:text-white transition w-full">
                        <span>Browse</span>
                    </button>
                    {currentUser?.isAdmin && (
                        <button onClick={() => setView('admin')} className="flex items-center space-x-3 text-lg font-semibold text-gray-300 hover:text-white transition w-full">
                            <span>Admin Panel</span>
                        </button>
                    )}
                </nav>
            </div>
            <div className="space-y-4">
                 <div className="text-sm">
                    <p className="font-semibold">{currentUser?.name}</p>
                    <p className="text-purple-300">{SUBSCRIPTION_FEATURES[currentUser?.subscription ?? SubscriptionTier.FREE].name} User</p>
                </div>
                <button onClick={logout} className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-semibold">
                    Logout
                </button>
            </div>
        </aside>
    );
}

const Player: React.FC = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrev, progress, seek } = useMusicPlayer();
    const { currentUser } = useAuth();
    const [showLyrics, setShowLyrics] = useState(false);
    const features = useMemo(() => currentUser ? SUBSCRIPTION_FEATURES[currentUser.subscription] : SUBSCRIPTION_FEATURES[SubscriptionTier.FREE], [currentUser]);
    const progressBarRef = React.useRef<HTMLDivElement>(null);

    if (!currentSong) return <div className="h-24 bg-black/30 backdrop-blur-xl flex items-center justify-center text-gray-400 border-t border-white/10">Select a song to play</div>;

    const progressPercent = (progress / (currentSong.duration * 1000)) * 100;

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !currentSong) return;

        const bar = progressBarRef.current;
        const rect = bar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const barWidth = bar.clientWidth;
        const seekRatio = Math.max(0, Math.min(1, offsetX / barWidth));
        seek(seekRatio * currentSong.duration * 1000);
    };

    return (
        <>
        <footer className="h-24 bg-black/30 backdrop-blur-xl flex items-center justify-between p-4 border-t border-white/10 relative z-30">
            <div className="flex items-center space-x-4 w-1/4">
                <img src={currentSong.artwork} alt={currentSong.album} className="w-16 h-16 rounded-md" />
                <div>
                    <p className="font-semibold">{currentSong.title}</p>
                    <p className="text-sm text-gray-300">{currentSong.artist}</p>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-2 w-1/2">
                <div className="flex items-center space-x-6">
                    <button onClick={playPrev} className="text-gray-300 hover:text-white transition"><IconPrev /></button>
                    <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center bg-purple-600 rounded-full text-white hover:bg-purple-500 transition transform hover:scale-110">
                        {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>
                    <button onClick={playNext} className="text-gray-300 hover:text-white transition"><IconNext /></button>
                </div>
                <div className="w-full flex items-center space-x-2 text-xs">
                    <span>{formatTime(progress / 1000)}</span>
                    <div
                        ref={progressBarRef}
                        onClick={handleSeek}
                        className="w-full h-1 bg-white/20 rounded-full cursor-pointer group"
                    >
                        <div
                            className="bg-purple-500 h-1 rounded-full relative group-hover:bg-purple-400 transition-colors"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'translate(50%, -50%)' }} />
                        </div>
                    </div>
                    <span>{formatTime(currentSong.duration)}</span>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4 w-1/4">
                {features.lyrics && currentSong.lyrics && (
                    <button onClick={() => setShowLyrics(prev => !prev)} className={`p-2 rounded-full ${showLyrics ? 'bg-purple-500/50' : ''} hover:bg-white/20 transition`} title="Show Lyrics"><IconLyrics /></button>
                )}
                {features.video && currentSong.videoUrl && (
                     <a href={currentSong.videoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition" title="Watch Video"><IconVideo /></a>
                )}
            </div>
        </footer>
        {showLyrics && <InteractiveLyrics lyrics={currentSong.lyrics || []} progress={progress} onClose={() => setShowLyrics(false)} artwork={currentSong.artwork} />}
        </>
    );
};

const Browse: React.FC<{setView: (view: string) => void}> = () => {
    const { playSong, setQueue, songs } = useMusicPlayer();
    const [playlists, setPlaylists] = useState(mockPlaylists);
    const [isAIOpen, setIsAIOpen] = useState(false);
    // FIX: currentUser was not defined. Added call to useAuth() to get it.
    const { currentUser } = useAuth();
    
    const features = useMemo(() => currentUser ? SUBSCRIPTION_FEATURES[currentUser.subscription] : SUBSCRIPTION_FEATURES[SubscriptionTier.FREE], [currentUser]);
    
    const handlePlaylistPlay = (playlist: Playlist) => {
        const playlistSongs = songs.filter(s => playlist.songIds.includes(s.id));
        if (playlistSongs.length > 0) {
            setQueue(playlistSongs);
            playSong(playlistSongs[0]);
        }
    };
    
    return (
        <div className="space-y-12">
            <h2 className="text-4xl font-bold text-shadow">Browse</h2>

            {features.aiPlaylists && (
                <GlassCard className="flex flex-col md:flex-row items-center justify-between p-6">
                    <div>
                        <h3 className="text-2xl font-bold">Create with AI</h3>
                        <p className="text-purple-200 mt-1">Generate a custom playlist based on your mood or any prompt.</p>
                    </div>
                    <button onClick={() => setIsAIOpen(true)} className="mt-4 md:mt-0 px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 animate-glow">
                        Generate Playlist
                    </button>
                </GlassCard>
            )}

            <section>
                <h3 className="text-2xl font-bold mb-4 text-shadow">Featured Playlists</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map(p => (
                        <div key={p.id} className="group relative cursor-pointer" onClick={() => handlePlaylistPlay(p)}>
                            <GlassCard className="overflow-hidden aspect-square">
                                <img src={p.artwork} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white">
                                        <IconPlay size={32} />
                                    </div>
                                </div>
                            </GlassCard>
                             <p className="mt-2 font-semibold truncate">{p.name}</p>
                            <p className="text-sm text-gray-300 truncate">{p.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            {isAIOpen && <AIPlaylistModal setIsOpen={setIsAIOpen} setPlaylists={setPlaylists}/>}
        </div>
    );
};

const AIPlaylistModal: React.FC<{setIsOpen: (isOpen: boolean) => void; setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>}> = ({setIsOpen, setPlaylists}) => {
    const { songs } = useMusicPlayer();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        try {
            const songIds = await generatePlaylistFromPrompt(prompt, songs);
            const newPlaylist: Playlist = {
                id: `ai-${Date.now()}`,
                name: `AI: ${prompt}`,
                description: `Generated from your prompt.`,
                artwork: `https://picsum.photos/seed/ai${Date.now()}/500/500`,
                songIds: songIds
            };
            setPlaylists(prev => [newPlaylist, ...prev]);
            setIsOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassCard className="w-full max-w-lg p-8 relative">
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <IconClose />
                </button>
                <h3 className="text-2xl font-bold mb-4">Generate AI Playlist</h3>
                <p className="text-purple-200 mb-6">Describe the vibe, mood, or occasion. For example, "upbeat songs for a morning run" or "lo-fi beats to study to".</p>
                <textarea 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="w-full h-24 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    disabled={isLoading}
                />
                 {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-6 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isLoading ? 'Generating...' : 'Create Playlist'}
                </button>
            </GlassCard>
        </div>
    );
};

const InteractiveLyrics: React.FC<{lyrics: {time: number, text: string}[], progress: number, onClose: () => void, artwork: string}> = ({lyrics, progress, onClose, artwork}) => {
    const currentLineIndex = useMemo(() => {
        const currentTime = progress / 1000;
        let index = lyrics.findIndex(line => line.time > currentTime) - 1;
        if (index < -1) index = lyrics.length - 1; // All lines passed
        return Math.max(0, index);
    }, [progress, lyrics]);

    const lyricsContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = lyricsContainerRef.current;
        const activeLine = container?.querySelector<HTMLParagraphElement>('.active-lyric');
        if (container && activeLine) {
            const containerHeight = container.clientHeight;
            const activeLineTop = activeLine.offsetTop;
            const activeLineHeight = activeLine.clientHeight;
            
            container.scrollTo({
                top: activeLineTop - containerHeight / 2 + activeLineHeight / 2,
                behavior: 'smooth'
            });
        }
    }, [currentLineIndex]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl flex z-40" onClick={onClose}>
            <div className="w-1/3 h-full flex items-center justify-center p-12">
                <img src={artwork} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="album art" />
            </div>
            <div ref={lyricsContainerRef} className="w-2/3 h-full overflow-y-auto p-12 text-center flex flex-col justify-center">
                {lyrics.map((line, index) => (
                    <p key={index} className={`py-2 text-4xl font-bold transition-all duration-500 ${index === currentLineIndex ? 'active-lyric text-white scale-105' : 'text-gray-500 scale-100'}`}>
                        {line.text}
                    </p>
                ))}
            </div>
        </div>
    );
};

// SVG Icons
const IconPlay: React.FC<{size?: number}> = ({size=24}) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>);
const IconPause: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>);
const IconNext: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>);
const IconPrev: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>);
const IconLyrics: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/></svg>);
const IconVideo: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>);
const IconClose: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

const GlassCard: React.FC<{children: React.ReactNode; className?: string}> = ({children, className}) => (
    <div className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${className}`}>
        {children}
    </div>
);

const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export default MainApp;