# 🎵 GT650 — Minimal Glass Music Player

<p align="center">
  <strong>A lightweight, glassmorphism-inspired music player powered by the YouTube IFrame API.</strong>
</p>

<p align="center">
  <a href="https://github.com/rageaman/GT650">
    <img src="https://img.shields.io/badge/GT650-Music%20Player-c8102e?style=for-the-badge" alt="GT650">
  </a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/YouTube%20API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube">
</p>

<p align="center">
  <em>Simple. Smooth. Minimal. Music-focused.</em>
</p>

---

## ✨ Overview

**GT650** is a minimal browser-based music player designed around a clean **glassmorphism UI**.

Instead of using a traditional large music-player interface, GT650 keeps the controls inside a compact floating dock at the bottom of the screen.

The player uses the **YouTube IFrame Player API** as its playback engine while providing a custom interface for playback controls and playlist navigation.

> 🎧 A minimal music experience without unnecessary UI clutter.

---

## 🖼️ Interface

The interface is built around a floating glass dock containing:

| Component           | Purpose                                |
| ------------------- | -------------------------------------- |
| 🎚️ Seek Bar        | View and control playback progress     |
| 🖼️ Track Thumbnail | Displays the current track artwork     |
| 📝 Track Info       | Shows current track title and position |
| ⏮️ Previous         | Go to the previous track               |
| ▶️ Play / Pause     | Control playback                       |
| ⏭️ Next             | Skip to the next track                 |
| 🔇 Mute             | Toggle audio mute                      |
| ☰ Playlist          | Open the floating playlist             |

---

## 🚀 Features

<div align="center">

| 🎵 Playback              | 🎨 Interface               |
| ------------------------ | -------------------------- |
| YouTube playlist support | Glassmorphism design       |
| Play / Pause             | Floating bottom dock       |
| Previous / Next          | Blur & translucent effects |
| Seek / Scrubbing         | Responsive layout          |
| Mute / Unmute            | Minimal controls           |

| 📋 Playlist               | ⚡ Performance            |
| ------------------------- | ------------------------ |
| Dynamic playlist loading  | Vanilla JavaScript       |
| Track titles              | No framework required    |
| Track thumbnails          | No build process         |
| Active track highlighting | Lightweight architecture |

</div>

---

## 🧩 Tech Stack

```text
GT650
│
├── HTML5
│   └── Player structure & controls
│
├── CSS3
│   ├── Glassmorphism
│   ├── Responsive layout
│   └── Custom player styling
│
├── Vanilla JavaScript
│   ├── Player state
│   ├── Playlist management
│   ├── Seek controls
│   └── UI synchronization
│
└── YouTube IFrame API
    └── Audio / video playback engine
```

### Technologies

* **HTML5** — Structure
* **CSS3** — Styling and responsive UI
* **Vanilla JavaScript** — Player logic
* **YouTube IFrame Player API** — Playback
* **YouTube oEmbed** — Track metadata
* **SVG** — Lightweight control icons

---

## 📁 Project Structure

```text
GT650/
│
├── background.jpg    # Player background
├── index.html        # Main application UI
├── script.js         # Player & playlist logic
├── style.css         # Complete UI styling
└── README.md         # Project documentation
```

---

## ⚙️ How It Works

```text
                    ┌──────────────────────┐
                    │      index.html      │
                    │   Player Interface   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       script.js      │
                    │   Player Controller  │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
       ┌──────────────────┐        ┌──────────────────┐
       │ YouTube IFrame   │        │ YouTube oEmbed   │
       │      API         │        │ Track Metadata   │
       └────────┬─────────┘        └────────┬─────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌──────────────────────┐
                    │   Custom Glass UI    │
                    │ Playback + Playlist  │
                    └──────────────────────┘
```

---

## 🎛️ Player Controls

### Playback

* **Play** — Start the current track
* **Pause** — Pause playback
* **Previous** — Move to previous playlist item
* **Next** — Move to next playlist item
* **Seek** — Jump to a specific position
* **Mute** — Toggle audio mute

### Playlist

Click the **playlist button** to open the floating playlist panel.

The active track is highlighted automatically.

---

## 🔧 Configuration

The YouTube playlist is configured inside:

```text
script.js
```

Look for:

```js
const PLAYLIST_ID = "PLYKPXq99tkmM";
```

Replace the value with your own YouTube playlist ID:

```js
const PLAYLIST_ID = "YOUR_PLAYLIST_ID";
```

> 💡 Keep the playlist publicly accessible if you want the player to load its contents normally.

---

## ▶️ Run Locally

GT650 does not require Node.js, npm, a bundler, or any framework.

### Option 1 — Open directly

Simply open:

```text
index.html
```

in a modern browser.

### Option 2 — Local server

For a more reliable development environment, serve the folder through a local HTTP server.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 🌐 Browser Compatibility

GT650 is designed for modern browsers supporting:

* ES6 JavaScript
* CSS backdrop filters
* HTML5
* YouTube IFrame API

Recommended:

| Browser       | Support |
| ------------- | ------- |
| Chrome        | ✅       |
| Edge          | ✅       |
| Firefox       | ✅       |
| Safari        | ✅       |
| Mobile Chrome | ✅       |
| Mobile Safari | ✅       |

> ⚠️ Playback behavior can still vary depending on browser autoplay policies and YouTube restrictions.

---

## 🎨 Design Philosophy

GT650 follows a simple design principle:

> **The interface should stay out of the way of the music.**

The UI intentionally uses:

* Transparent surfaces
* Background blur
* Rounded corners
* Subtle shadows
* Minimal icons
* Compact controls
* Responsive sizing

The result is a player that feels more like a **floating system media control** than a traditional music website.

---

## ⚡ Performance Notes

GT650 intentionally avoids large frontend frameworks.

### Why Vanilla JavaScript?

```text
No React
No Vue
No Angular
No Tailwind build
No npm
No bundler
```

This keeps the project:

* Easy to understand
* Easy to deploy
* Fast to load
* Simple to modify
* Beginner-friendly

The main JavaScript logic is contained in a single file and communicates directly with the YouTube player.

---

## 🛠️ Possible Improvements

GT650 is intentionally minimal, but the following upgrades could make it even stronger:

* [ ] Add volume slider
* [ ] Add shuffle mode
* [ ] Add repeat mode
* [ ] Add keyboard shortcuts
* [ ] Add loading states
* [ ] Add better error messages
* [ ] Cache playlist metadata
* [ ] Improve mobile touch controls
* [ ] Optimize `background.jpg`
* [ ] Add PWA support
* [ ] Add light/dark visual modes
* [ ] Add persistent playback preferences

---

## 📦 Deployment

Because GT650 is a static frontend project, it can be deployed on most static hosting platforms.

Suitable options include:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* Any static web server

No backend server is required for the current architecture.

---

## 🔐 Security

GT650 currently does not require a private API key.

The project uses:

```text
YouTube IFrame API
        +
YouTube oEmbed
```

No passwords, tokens, or private credentials are included in the frontend source.

> ⚠️ Never put private API keys, secrets, passwords, or authentication tokens directly into client-side JavaScript.

---

## 📌 Current Project Status

<div align="center">

### 🟢 Active Development

**Current version:** Early / lightweight release

**Architecture:** Static frontend

**Dependencies:** Minimal

**Backend:** None

</div>

---

## ❤️ Why GT650?

GT650 is built around a straightforward idea:

> **Music should be accessible without making the interface complicated.**

Instead of filling the screen with menus and controls, GT650 keeps everything compact and focused on the current track.

---

## 👨‍💻 Author

Created and maintained by **RageAman**.

GitHub:

**[@rageaman](https://github.com/rageaman)**

Project:

**[GT650](https://github.com/rageaman/GT650)**

---

## 📄 License

If you plan to publish or distribute this project, add an appropriate license file such as:

```text
LICENSE
```

A license makes it clear how other people are allowed to use, modify, and distribute the project.

---

## ⭐ Support

If you find GT650 useful or interesting:

<div align="center">

### ⭐ Star the repository

### 🍴 Fork the project

### 🐛 Report issues

### 💡 Suggest improvements

</div>

---

<p align="center">
  <strong>GT650</strong>
  <br>
  <em>Minimal UI • Glassmorphism • YouTube Powered</em>
</p>

<p align="center">
  Made with ❤️ and JavaScript
</p>
