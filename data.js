// --- CONFIGURATION ---
const DB_NAME = "AuraMusicDB";
const DB_VERSION = 1;
const STORE_SONGS = "songs";
const STORE_LIKED = "liked";

// --- DEFAULT DATA (50 Hits) ---
window.GENRES = ['Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', 'Focus', 'Chill', 'Mood', 'Workout', 'Party'];

const SPOTIFY_HITS = [
    { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
    { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
    { title: "Someone You Loved", artist: "Lewis Capaldi", genre: "Pop" },
    { title: "Sunflower", artist: "Post Malone, Swae Lee", genre: "Hip-Hop" },
    { title: "Starboy", artist: "The Weeknd, Daft Punk", genre: "Pop" },
    { title: "As It Was", artist: "Harry Styles", genre: "Pop" },
    { title: "Stay", artist: "The Kid LAROI, Justin Bieber", genre: "Pop" },
    { title: "Heat Waves", artist: "Glass Animals", genre: "Indie" },
    { title: "Dance Monkey", artist: "Tones and I", genre: "Pop" },
    { title: "One Dance", artist: "Drake", genre: "Hip-Hop" },
    { title: "Closer", artist: "The Chainsmokers", genre: "Electronic" },
    { title: "Rockstar", artist: "Post Malone", genre: "Hip-Hop" },
    { title: "Perfect", artist: "Ed Sheeran", genre: "Pop" },
    { title: "Lovely", artist: "Billie Eilish, Khalid", genre: "Mood" },
    { title: "Believer", artist: "Imagine Dragons", genre: "Rock" },
    { title: "Say You Won't Let Go", artist: "James Arthur", genre: "Pop" },
    { title: "Señorita", artist: "Shawn Mendes, Camila Cabello", genre: "Pop" },
    { title: "Bad Guy", artist: "Billie Eilish", genre: "Pop" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop" },
    { title: "God's Plan", artist: "Drake", genre: "Hip-Hop" },
    { title: "Lucid Dreams", artist: "Juice WRLD", genre: "Hip-Hop" },
    { title: "Photograph", artist: "Ed Sheeran", genre: "Pop" },
    { title: "Something Just Like This", artist: "The Chainsmokers", genre: "Electronic" },
    { title: "Shallow", artist: "Lady Gaga, Bradley Cooper", genre: "Pop" },
    { title: "Love Yourself", artist: "Justin Bieber", genre: "Pop" },
    { title: "Thunder", artist: "Imagine Dragons", genre: "Rock" },
    { title: "Circles", artist: "Post Malone", genre: "Hip-Hop" },
    { title: "SAD!", artist: "XXXTENTACION", genre: "Hip-Hop" },
    { title: "All of Me", artist: "John Legend", genre: "Pop" },
    { title: "Homicide", artist: "Logic, Eminem", genre: "Hip-Hop" },
    { title: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip-Hop" },
    { title: "XO Tour Llif3", artist: "Lil Uzi Vert", genre: "Hip-Hop" },
    { title: "SICKO MODE", artist: "Travis Scott", genre: "Hip-Hop" },
    { title: "7 rings", artist: "Ariana Grande", genre: "Pop" },
    { title: "thank u, next", artist: "Ariana Grande", genre: "Pop" },
    { title: "Without Me", artist: "Halsey", genre: "Pop" },
    { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
    { title: "Sweater Weather", artist: "The Neighbourhood", genre: "Indie" },
    { title: "Another Love", artist: "Tom Odell", genre: "Indie" },
    { title: "Take Me To Church", artist: "Hozier", genre: "Rock" },
    { title: "Counting Stars", artist: "OneRepublic", genre: "Pop" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop" },
    { title: "Wake Me Up", artist: "Avicii", genre: "Electronic" },
    { title: "Riptide", artist: "Vance Joy", genre: "Indie" },
    { title: "Demons", artist: "Imagine Dragons", genre: "Rock" },
    { title: "Stressed Out", artist: "Twenty One Pilots", genre: "Rock" },
    { title: "Ride", artist: "Twenty One Pilots", genre: "Rock" },
    { title: "The Hills", artist: "The Weeknd", genre: "Pop" },
    { title: "Goosebumps", artist: "Travis Scott", genre: "Hip-Hop" },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", genre: "Rock" }
];

// --- DATABASE SERVICE (IndexedDB) ---
window.DB = {
    db: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_SONGS)) {
                    db.createObjectStore(STORE_SONGS, { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains(STORE_LIKED)) {
                    db.createObjectStore(STORE_LIKED, { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.seedData().then(resolve);
            };

            request.onerror = (event) => reject("DB Error: " + event.target.errorCode);
        });
    },

    async seedData() {
        const count = await this.count(STORE_SONGS);
        if (count === 0) {
            console.log("Seeding default songs...");
            const defaultSongs = SPOTIFY_HITS.map((track, i) => {
                const id = i + 1;
                const audioIndex = (i % 15) + 1;
                return {
                    id: id,
                    title: track.title,
                    artist: track.artist,
                    genre: track.genre,
                    duration: 180 + (i * 7) % 100,
                    // We store URLs for default songs, Blobs for custom
                    cover: `https://picsum.photos/seed/${id * 456}/300/300`,
                    url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${audioIndex}.mp3`,
                    isCustom: false
                };
            });
            
            const tx = this.db.transaction([STORE_SONGS], "readwrite");
            const store = tx.objectStore(STORE_SONGS);
            defaultSongs.forEach(song => store.add(song));
            return new Promise(resolve => tx.oncomplete = resolve);
        }
    },

    async getAllSongs() {
        return new Promise(resolve => {
            const tx = this.db.transaction([STORE_SONGS], "readonly");
            const store = tx.objectStore(STORE_SONGS);
            const request = store.getAll();
            request.onsuccess = () => {
                // Convert Blobs to URLs for display if necessary
                const songs = request.result.map(song => {
                    if (song.isCustom) {
                        return {
                            ...song,
                            cover: URL.createObjectURL(song.coverBlob),
                            url: URL.createObjectURL(song.audioBlob)
                        };
                    }
                    return song;
                });
                resolve(songs.reverse()); // Show newest first
            };
        });
    },

    async addSong(song) {
        return new Promise(resolve => {
            const tx = this.db.transaction([STORE_SONGS], "readwrite");
            const store = tx.objectStore(STORE_SONGS);
            store.add(song);
            tx.oncomplete = () => resolve(song);
        });
    },

    async deleteSong(id) {
        return new Promise(resolve => {
            const tx = this.db.transaction([STORE_SONGS], "readwrite");
            const store = tx.objectStore(STORE_SONGS);
            store.delete(id);
            tx.oncomplete = resolve;
        });
    },

    async getLikedIds() {
        return new Promise(resolve => {
            const tx = this.db.transaction([STORE_LIKED], "readonly");
            const store = tx.objectStore(STORE_LIKED);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.map(item => item.id));
        });
    },

    async toggleLike(id) {
        const likedIds = await this.getLikedIds();
        const tx = this.db.transaction([STORE_LIKED], "readwrite");
        const store = tx.objectStore(STORE_LIKED);

        if (likedIds.includes(id)) {
            store.delete(id);
        } else {
            store.add({ id });
        }
        return new Promise(resolve => tx.oncomplete = resolve);
    },
    
    count(storeName) {
        return new Promise(resolve => {
            const tx = this.db.transaction([storeName], "readonly");
            const store = tx.objectStore(storeName);
            const req = store.count();
            req.onsuccess = () => resolve(req.result);
        });
    }
};

window.USER = {
    name: "Alex Beat",
    email: "alex.beat@auramusic.com",
    plan: "Free Tier",
    avatar: "https://i.pravatar.cc/150?img=11",
    joined: "Dec 2025"
};

window.formatTime = (seconds) => {
    if(!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};