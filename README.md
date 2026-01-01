# 🎵 Aura Music

Aura Music is a **Spotify-inspired web music player** built using **React (via CDN)**, **Tailwind CSS**, and **IndexedDB**.  
It works fully in the browser and allows users to play songs, like tracks, search music, and even upload custom songs via an **Admin Panel**.

---

## 🚀 Features

- 🎧 Play / Pause / Next / Previous controls
- ❤️ Like & unlike songs (saved locally)
- 🔍 Search by song title, artist, or genre
- 🎼 Browse music by genres
- 📂 Persistent storage using **IndexedDB**
- 🧑‍💼 Hidden **Admin Panel** to upload custom songs
- 📱 Fully responsive (Desktop + Mobile)
- 🌙 Modern dark UI inspired by Spotify

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **Tailwind CSS**
- **JavaScript (ES6)**
- **React 18 (CDN)**
- **Font Awesome**
- **IndexedDB (Browser Database)**

---

## 📁 Project Structure

Aura-Music/ │ ├── index.html      # Main HTML file ├── style.css       # Custom CSS ├── data.js         # Song data & IndexedDB logic ├── script.js       # React application logic └── README.md

---

## ▶️ How to Run the Project

### Option 1: Open directly
1. Download or clone the repository
2. Open `index.html` in any modern browser

### Option 2: Using Live Server (Recommended)
1. Open the project in VS Code
2. Install **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

---

## 🔐 Admin Panel Access

The Admin panel is **hidden by default**.

### How to unlock Admin menu:
1. Click the **Aura logo 5 times**
2. Admin option will appear in the sidebar

### Admin Login Credentials:
Password: aura music

### Admin Capabilities:
- Upload custom audio files (MP3/WAV)
- Upload cover images
- Delete songs from database

---

## 💾 Data Storage

- Songs & likes are stored using **IndexedDB**
- Liked songs persist even after page reload
- Custom uploaded songs are stored locally in the browser

⚠️ Clearing browser data will reset the app.

---

## 📸 Screenshots

> *(Add screenshots here if you want)*

```markdown
![Home Page](screenshots/home.png)
![Player](screenshots/player.png)
![Admin Panel](screenshots/admin.png)
