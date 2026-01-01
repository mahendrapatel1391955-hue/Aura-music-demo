const { useState, useEffect, useRef, useMemo } = React;

const { GENRES, USER, formatTime, DB } = window;

// --- SUB-COMPONENTS ---

function Sidebar({ view, setView, adminUnlocked, handleLogoClick, likedCount }) {
    const NavItem = ({ icon, label, active, onClick, isRed }) => (
        <div onClick={onClick} className={`flex items-center gap-4 cursor-pointer transition ${isRed ? (active ? 'text-red-500' : 'text-gray-400 hover:text-red-400') : (active ? 'text-white' : 'text-gray-400 hover:text-white')}`}>
            <i className={`fa-solid fa-${icon} text-xl w-6`}></i>
            <span className="font-bold">{label}</span>
        </div>
    );

    return (
        <div className="w-64 bg-black p-2 hidden md:flex flex-col gap-2">
            <div className="p-4 cursor-pointer select-none group" onClick={handleLogoClick}>
                <div className="flex items-center gap-2 text-white group-hover:opacity-80 transition transform group-active:scale-95">
                    <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-music text-black text-sm"></i>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Aura</span>
                </div>
            </div>
            <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-5">
                <NavItem icon="house" label="Home" active={view === 'home'} onClick={() => setView('home')} />
                <NavItem icon="magnifying-glass" label="Search" active={view === 'search'} onClick={() => setView('search')} />
                {adminUnlocked && <NavItem icon="lock" label="Admin" active={view === 'admin'} onClick={() => setView('admin')} isRed />}
            </div>
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-4 hover:text-white cursor-pointer transition">
                    <i className="fa-solid fa-book text-xl"></i><span className="font-bold">Library</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    <div onClick={() => setView('liked')} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${view === 'liked' ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded flex items-center justify-center">
                            <i className="fa-solid fa-heart text-white text-xs"></i>
                        </div>
                        <div><p className={`font-bold text-sm ${view === 'liked' ? 'text-green-500' : 'text-white'}`}>Liked Songs</p><p className="text-xs text-gray-400">{likedCount} songs</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Header({ bgColor, handleLogoClick, setView }) {
    return (
        <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${bgColor} to-transparent z-20 px-4 md:px-6 flex items-center justify-between transition-colors duration-700`}>
            <div className="flex md:hidden cursor-pointer active:scale-95 transition-transform" onClick={handleLogoClick}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-music text-black text-sm"></i>
                    </div>
                    <span className="text-xl font-bold">Aura</span>
                </div>
            </div>
            <div className="hidden md:flex gap-2">
                <button className="bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white"><i className="fa-solid fa-chevron-left"></i></button>
            </div>
            <button onClick={() => setView('profile')} className="bg-black/60 hover:bg-[#2a2a2a] text-white pr-3 pl-1 py-1 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition border border-transparent hover:border-white/20">
                <img src={USER.avatar} className="w-7 h-7 rounded-full border border-white" />
                <span className="hidden md:inline">{USER.name}</span>
            </button>
        </div>
    );
}

function Player({ currentSong, isPlaying, togglePlay, nextSong, prevSong, volume, setVolume, progress, handleSeek, liked, toggleLike }) {
    const isLiked = currentSong && liked.includes(currentSong.id);
    return (
        <div className="h-20 md:h-24 bg-black border-t border-[#282828] px-2 md:px-4 flex items-center justify-between z-50 fixed bottom-14 md:bottom-0 w-full md:relative bg-opacity-95 backdrop-blur-lg">
            <div className="flex items-center gap-3 w-[70%] md:w-[30%]">
                {currentSong ? (
                    <>
                        <img src={currentSong.cover} className="w-12 h-12 rounded shadow object-cover" />
                        <div className="overflow-hidden"><div className="text-sm font-medium text-white truncate max-w-[150px]">{currentSong.title}</div><div className="text-xs text-gray-400 truncate max-w-[150px]">{currentSong.artist}</div></div>
                        <button onClick={() => toggleLike(currentSong.id)} className="text-gray-400 hover:text-white ml-2 hidden md:block"><i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart ${isLiked ? 'text-[#1ed760]' : ''}`}></i></button>
                    </>
                ) : (<div className="text-gray-500 text-xs md:text-sm pl-2">Select a song</div>)}
            </div>
            <div className="flex flex-col items-center justify-center md:w-[40%]">
                <div className="flex items-center gap-4 md:gap-6">
                    <i className="fa-solid fa-backward-step text-gray-300 hover:text-white cursor-pointer text-xl" onClick={prevSong}></i>
                    <button onClick={togglePlay} className="bg-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:scale-105 transition">{isPlaying ? <i className="fa-solid fa-pause text-black"></i> : <i className="fa-solid fa-play text-black ml-1"></i>}</button>
                    <i className="fa-solid fa-forward-step text-gray-300 hover:text-white cursor-pointer text-xl" onClick={nextSong}></i>
                </div>
                <div className="w-full hidden md:flex items-center gap-2 text-xs font-mono text-gray-400 mt-1"><span>{formatTime(progress)}</span><div className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"><div className="absolute h-full bg-white rounded-full group-hover:bg-green-500" style={{ width: currentSong ? `${(progress / currentSong.duration) * 100}%` : '0%' }}></div><input type="range" min="0" max="100" onChange={handleSeek} className="range-slider absolute top-[-1px] left-0 w-full h-full opacity-0 cursor-pointer" /></div><span>{currentSong ? formatTime(currentSong.duration) : "0:00"}</span></div>
            </div>
            <div className="hidden md:flex items-center justify-end gap-3 w-[30%] text-gray-400">
                <i className="fa-solid fa-volume-high text-sm"></i>
                <div className="flex items-center gap-2 w-24"><div className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer"><div className="absolute h-full bg-white rounded-full group-hover:bg-green-500" style={{ width: `${volume * 100}%` }}></div><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="range-slider absolute top-[-1px] left-0 w-full h-full opacity-0 cursor-pointer" /></div></div>
            </div>
        </div>
    );
}

function MobileNav({ view, setView, adminUnlocked }) {
    const NavItem = ({ name, icon, isRed }) => (
        <div onClick={() => setView(name)} className={`flex flex-col items-center gap-1 cursor-pointer w-full h-full justify-center ${view === name ? (isRed ? 'text-red-500' : 'text-white') : 'text-gray-500'}`}>
            <i className={`fa-solid fa-${icon} text-lg`}></i>
            <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        </div>
    );
    return (
        <div className="h-14 bg-[#121212] border-t border-[#282828] fixed bottom-0 w-full flex md:hidden justify-around items-center text-xs z-[60]">
            <NavItem name="home" icon="house" />
            <NavItem name="search" icon="magnifying-glass" />
            <NavItem name="liked" icon="heart" />
            {adminUnlocked && <NavItem name="admin" icon="lock" isRed />}
        </div>
    );
}

// --- SONG ROW COMPONENT ---
function SongRow({ song, index, playSong, isCurrent, liked, toggleLike }) {
    const isLiked = liked.includes(song.id);
    return (
        <div onClick={() => playSong(song)} className="flex items-center gap-4 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer group">
            {index !== undefined && <span className="text-gray-400 text-sm w-4">{index + 1}</span>}
            <img src={song.cover} className="w-10 h-10 rounded object-cover" />
            <div className="flex-1">
                <p className={`text-sm font-medium ${isCurrent ? 'text-green-500' : 'text-white'}`}>{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }} 
                className="text-gray-400 hover:text-white mr-4"
            >
                <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart ${isLiked ? 'text-[#1ed760]' : ''}`}></i>
            </button>
            <span className="text-xs text-gray-500">{formatTime(song.duration)}</span>
        </div>
    );
}

// --- PAGES ---

function Home({ songs, playSong, currentSong, isPlaying, liked, toggleLike }) {
    return (
        <div className="animate-fade-in mt-20 px-4 md:px-6 pb-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Good evening</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
                {songs.slice(0, 6).map(song => (
                    <div key={song.id} onClick={() => playSong(song)} className="flex items-center bg-[#ffffff1a] hover:bg-[#ffffff33] transition rounded-md overflow-hidden cursor-pointer group relative h-16 md:h-20">
                        <img src={song.cover} className="w-16 h-full md:w-20 md:h-full object-cover shadow-lg" />
                        <span className="font-bold px-3 text-xs md:text-sm truncate flex-1">{song.title}</span>
                        <div className={`hidden md:flex absolute right-4 bg-green-500 rounded-full w-10 h-10 items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isPlaying && currentSong?.id === song.id ? 'opacity-100 translate-y-0' : ''}`}>
                            <i className={`fa-solid fa-${isPlaying && currentSong?.id === song.id ? 'pause' : 'play'} text-black`}></i>
                        </div>
                    </div>
                ))}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4">Top Hits</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {songs.slice(6, 16).map(song => (
                    <div key={song.id} onClick={() => playSong(song)} className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition duration-300 cursor-pointer group">
                        <div className="relative mb-3">
                            <img src={song.cover} className="w-full aspect-square object-cover rounded-md shadow-lg" />
                            <div className="hidden md:flex absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"><i className="fa-solid fa-play text-black ml-1"></i></div>
                        </div>
                        <h4 className="font-bold truncate text-sm md:text-base">{song.title}</h4>
                        <p className="text-xs md:text-sm text-gray-400 mt-1 line-clamp-2">{song.artist}</p>
                    </div>
                ))}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 mt-8">All Tracks</h3>
            <div className="flex flex-col gap-2">
                {songs.map((song, i) => (
                    <SongRow key={song.id} song={song} index={i} playSong={playSong} isCurrent={currentSong?.id === song.id} liked={liked} toggleLike={toggleLike} />
                ))}
            </div>
        </div>
    );
}

function LikedView({ songs, liked, playSong, currentSong, toggleLike }) {
    const likedSongs = songs.filter(s => liked.includes(s.id));
    return (
        <div className="animate-fade-in mt-20 px-4 md:px-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center shadow-2xl">
                    <i className="fa-solid fa-heart text-6xl text-white"></i>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase">Playlist</p>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-2">Liked Songs</h1>
                    <p className="text-gray-400 text-sm">{likedSongs.length} songs</p>
                </div>
            </div>
            {likedSongs.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {likedSongs.map((song, i) => (
                        <SongRow key={song.id} song={song} index={i} playSong={playSong} isCurrent={currentSong?.id === song.id} liked={liked} toggleLike={toggleLike} />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-20 text-gray-500"><p>Songs you like will appear here</p></div>
            )}
        </div>
    );
}

function Search({ songs, playSong, currentSong, liked, toggleLike }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState(null);

    const filteredSongs = useMemo(() => {
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            return songs.filter(s => s.title.toLowerCase().includes(lower) || s.artist.toLowerCase().includes(lower) || (s.genre && s.genre.toLowerCase().includes(lower)));
        }
        if (selectedGenre) return songs.filter(s => s.genre === selectedGenre);
        return songs;
    }, [songs, searchQuery, selectedGenre]);

    return (
        <div className="animate-fade-in mt-20 px-4 md:px-6 pb-24">
            <h2 className="text-2xl font-bold mb-4">Search</h2>
            <div className="relative mb-8">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-black"></i>
                <input type="text" placeholder="What do you want to listen to?" className="w-full md:w-96 py-3 pl-12 pr-4 rounded-full text-black outline-none focus:ring-2 focus:ring-white" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSelectedGenre(null); }} autoFocus />
            </div>
            {searchQuery || selectedGenre ? (
                <div>
                    {selectedGenre && <button onClick={() => setSelectedGenre(null)} className="mb-4 bg-black/50 p-2 rounded-full w-8 h-8 flex items-center justify-center"><i className="fa-solid fa-arrow-left"></i></button>}
                    <h3 className="text-lg font-bold mb-4">{searchQuery ? "Top Results" : selectedGenre}</h3>
                    {filteredSongs.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {filteredSongs.map((song, i) => (
                                <SongRow key={song.id} song={song} index={i} playSong={playSong} isCurrent={currentSong?.id === song.id} liked={liked} toggleLike={toggleLike} />
                            ))}
                        </div>
                    ) : (<p className="text-gray-400">No results found.</p>)}
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-bold mb-4">Browse All</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {GENRES.map((genre, i) => (
                            <div key={i} onClick={() => setSelectedGenre(genre)} className={`aspect-square rounded-lg p-4 font-bold text-lg md:text-2xl relative overflow-hidden bg-gradient-to-br ${['from-red-500', 'from-blue-500', 'from-green-500', 'from-orange-500', 'from-purple-500', 'from-pink-500'][i % 6]} to-black cursor-pointer hover:scale-105 transition shadow-lg`}>
                                <span className="relative z-10">{genre}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Profile({ songCount, likedCount }) {
    return (
        <div className="animate-fade-in mt-20 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 text-center md:text-left">
                <img src={USER.avatar} className="w-32 h-32 md:w-52 md:h-52 rounded-full shadow-2xl border-4 border-[#121212]" />
                <div>
                    <p className="uppercase text-xs font-bold mt-2">Profile</p>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4">{USER.name}</h1>
                    <div className="text-sm text-gray-300 flex justify-center md:justify-start gap-2"><span>{songCount} Playlists</span> • <span>{likedCount} Liked Songs</span></div>
                </div>
            </div>
            <hr className="border-[#333] mb-6"/>
            <div className="bg-[#181818] p-6 rounded-lg max-w-2xl mx-auto md:mx-0">
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-400 uppercase">Email</label><p>{USER.email}</p></div>
                    <div><label className="text-xs text-gray-400 uppercase">Joined</label><p>{USER.joined}</p></div>
                </div>
            </div>
        </div>
    );
}

function Admin({ adminLoggedIn, handleLogin, handleLogout, songs, addSong, deleteSong }) {
    const [password, setPassword] = useState("");
    const [title, setTitle] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    const onLoginSubmit = (e) => { e.preventDefault(); handleLogin(password); setPassword(""); };
    
    const onAddSubmit = (e) => { 
        e.preventDefault();
        // Pass file objects directly to App to be handled by DB service
        addSong({ title, cover: coverFile, audio: audioFile });
        setTitle("");
        setCoverFile(null);
        setAudioFile(null);
        // Reset file inputs
        document.getElementById("coverInput").value = "";
        document.getElementById("audioInput").value = "";
    };

    if (!adminLoggedIn) {
        return (
            <div className="mt-20 flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
                <i className="fa-solid fa-lock text-4xl text-red-500"></i>
                <h2 className="text-2xl font-bold">Admin Locked</h2>
                <form onSubmit={onLoginSubmit} className="flex gap-2">
                    <input type="password" className="bg-[#2a2a2a] p-2 rounded text-white outline-none focus:ring-1 focus:ring-red-500" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500">Unlock</button>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in mt-20 px-4 md:px-6 pb-24">
            <div className="flex items-center justify-between mb-6 border-b border-red-900 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-red-500 flex items-center gap-2"><i className="fa-solid fa-user-shield"></i> Admin Panel</h1>
                <button onClick={handleLogout} className="bg-[#2a2a2a] hover:bg-red-900 text-white text-xs px-3 py-1 rounded border border-gray-700 transition"><i className="fa-solid fa-lock"></i> Logout & Lock</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#181818] p-4 md:p-6 rounded-lg border border-gray-800">
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-200">Upload Track (From Storage)</h3>
                    <form onSubmit={onAddSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Song Name</label>
                            <input type="text" placeholder="Enter Title" className="w-full bg-[#2a2a2a] p-3 rounded text-white outline-none focus:ring-1 focus:ring-red-500 text-sm mt-1" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Audio File (MP3/WAV)</label>
                            <input id="audioInput" type="file" accept="audio/*" className="w-full bg-[#2a2a2a] p-3 rounded text-gray-300 text-sm mt-1" onChange={e => setAudioFile(e.target.files[0])} required />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Cover Image</label>
                            <input id="coverInput" type="file" accept="image/*" className="w-full bg-[#2a2a2a] p-3 rounded text-gray-300 text-sm mt-1" onChange={e => setCoverFile(e.target.files[0])} required />
                        </div>
                        <button type="submit" className="bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition mt-2 text-sm">Add to Library</button>
                    </form>
                </div>
                <div className="bg-[#181818] p-4 md:p-6 rounded-lg border border-gray-800">
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-200">Database ({songs.length})</h3>
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                        {songs.map(song => (
                            <div key={song.id} className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded hover:bg-[#333]">
                                <div className="flex items-center gap-3 overflow-hidden"><img src={song.cover} className="w-10 h-10 rounded object-cover" /><div className="truncate"><p className="font-bold text-sm truncate text-gray-200">{song.title}</p></div></div>
                                <button onClick={() => deleteSong(song.id)} className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded transition"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- MAIN APP ---

function App() {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [progress, setProgress] = useState(0);
    const [view, setView] = useState('home');
    const [liked, setLiked] = useState([]);
    const [bgColor, setBgColor] = useState('from-emerald-900');
    const [logoClicks, setLogoClicks] = useState(0);
    const [adminUnlocked, setAdminUnlocked] = useState(false);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);

    const audioRef = useRef(new Audio());

    // Initialize Database
    useEffect(() => {
        const initApp = async () => {
            await DB.init();
            const loadedSongs = await DB.getAllSongs();
            setSongs(loadedSongs);
            const loadedLikes = await DB.getLikedIds();
            setLiked(loadedLikes);
        };
        initApp();
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleEnded = () => nextSong();
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, songs]);

    useEffect(() => { audioRef.current.volume = volume; }, [volume]);

    useEffect(() => {
        if (logoClicks >= 5 && !adminUnlocked) {
            setAdminUnlocked(true);
            alert("Admin Button Unlocked in Menu");
            setLogoClicks(0);
        }
    }, [logoClicks]);

    const handleLogoClick = () => setLogoClicks(prev => prev + 1);

    const handleAdminLogin = (password) => {
        if (password === "aura music") setAdminLoggedIn(true);
        else alert("Access Denied");
    };

    const handleAdminLogout = () => {
        setAdminLoggedIn(false);
        setAdminUnlocked(false);
        setLogoClicks(0);
        setView('home');
    };

    const toggleLike = async (id) => {
        await DB.toggleLike(id);
        const updatedLikes = await DB.getLikedIds();
        setLiked(updatedLikes);
    };

    const playSong = (song) => {
        if (currentSong?.id === song.id) { togglePlay(); }
        else {
            setCurrentSong(song);
            setBgColor(song.color || 'from-gray-900');
            audioRef.current.src = song.url;
            audioRef.current.play().catch(e => console.error(e));
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        if (!currentSong) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        if (!currentSong) return;
        const idx = songs.findIndex(s => s.id === currentSong.id);
        const nextIdx = (idx + 1) % songs.length;
        playSong(songs[nextIdx]);
    };

    const prevSong = () => {
        if (!currentSong) return;
        const idx = songs.findIndex(s => s.id === currentSong.id);
        const prevIdx = (idx - 1 + songs.length) % songs.length;
        playSong(songs[prevIdx]);
    };

    const handleSeek = (e) => {
        if (!currentSong) return;
        const seekTime = (e.target.value / 100) * currentSong.duration;
        audioRef.current.currentTime = seekTime;
        setProgress(seekTime);
    };

    // Add Song (Updated to handle Files)
    const addSong = async ({ title, cover, audio }) => {
        if (!title || !cover || !audio) {
            alert("Please select both Audio and Cover files.");
            return;
        }

        const newSong = {
            id: Date.now(),
            title: title,
            artist: "Local Artist",
            genre: "Custom",
            duration: 180, // Default duration since reading metadata is complex without libraries
            isCustom: true,
            color: "from-gray-700",
            coverBlob: cover, // Store blob in DB
            audioBlob: audio
        };

        await DB.addSong(newSong);
        const updatedSongs = await DB.getAllSongs();
        setSongs(updatedSongs);
        alert("Track saved to Database!");
    };

    const deleteSong = async (id) => {
        if(confirm("Delete this track?")) {
            await DB.deleteSong(id);
            setSongs(prev => prev.filter(s => s.id !== id));
            if(currentSong?.id === id) { audioRef.current.pause(); setCurrentSong(null); setIsPlaying(false); }
        }
    };

    const renderView = () => {
        switch (view) {
            case 'home': return <Home songs={songs} playSong={playSong} currentSong={currentSong} isPlaying={isPlaying} liked={liked} toggleLike={toggleLike} />;
            case 'search': return <Search songs={songs} playSong={playSong} currentSong={currentSong} liked={liked} toggleLike={toggleLike} />;
            case 'profile': return <Profile songCount={songs.length} likedCount={liked.length} />;
            case 'liked': return <LikedView songs={songs} liked={liked} playSong={playSong} currentSong={currentSong} toggleLike={toggleLike} />;
            case 'admin': return <Admin adminLoggedIn={adminLoggedIn} handleLogin={handleAdminLogin} handleLogout={handleAdminLogout} songs={songs} addSong={addSong} deleteSong={deleteSong} />;
            default: return <Home songs={songs} playSong={playSong} />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black">
            <div className="flex-1 flex overflow-hidden">
                <Sidebar view={view} setView={setView} adminUnlocked={adminUnlocked} handleLogoClick={handleLogoClick} likedCount={liked.length} />
                <div className="flex-1 bg-[#121212] md:m-2 rounded-lg overflow-hidden relative flex flex-col">
                    <Header bgColor={bgColor} handleLogoClick={handleLogoClick} setView={setView} />
                    <div className="flex-1 overflow-y-auto pb-36 md:pb-24 scrollbar-hide">
                        <div className={`h-64 bg-gradient-to-b ${bgColor} to-[#121212] transition-colors duration-700 absolute top-0 left-0 right-0 -z-10`}></div>
                        {renderView()}
                    </div>
                </div>
            </div>
            <Player currentSong={currentSong} isPlaying={isPlaying} togglePlay={togglePlay} nextSong={nextSong} prevSong={prevSong} volume={volume} setVolume={setVolume} progress={progress} handleSeek={handleSeek} liked={liked} toggleLike={toggleLike} />
            <MobileNav view={view} setView={setView} adminUnlocked={adminUnlocked} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);