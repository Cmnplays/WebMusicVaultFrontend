# 🎧 WebMusicVault - Premium Streaming Frontend

Welcome to the **WebMusicVault** frontend. This is a state-of-the-art Next.js application designed for audiophiles who value aesthetics as much as performance. It features a custom-built music engine, glassmorphism design, and professional-grade animations.

---

## 📑 Table of Contents
- [Visual Experience](#-visual-experience)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [State Management](#-state-management)
- [Deep-Linking System](#-deep-linking-system)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)

---

## 🎨 Visual Experience

WebMusicVault isn't just an app; it's a visual journey. We've combined modern design principles to create a "wow" factor from the first second of loading.

- **Glassmorphism UI**: High-opacity blurs (`backdrop-blur-xl`) and subtle gradients create a layered, "glassy" depth.
- **GSAP Animations**: Every interaction—from clicking a song to navigating a 404 page—is smoothed by GreenSock animations for a fluid, high-end feel.
- **Dynamic UX**: Interactive hover effects, skeleton loaders for every list, and micro-animations on playback controls.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Components)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with [Redux Persist](https://github.com/rt2zz/redux-persist) for session continuity.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom Vanilla CSS for the glassmorphism engine.
- **Animations**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform).
- **Icons**: [Lucide React](https://lucide.dev/) for clean, consistent iconography.
- **Networking**: [Axios](https://axios-http.com/) with centralized service layers.

---

## 🚀 Core Features

### 1. Advanced Music Player
- **Persistence**: Thanks to Redux Persist, your current track and progress survive page refreshes.
- **Shuffle & Repeat**: Native support for smart playback modes.
- **Global Access**: The player remains accessible across all music-related routes without interrupting the stream.

### 2. High-End Upload System
- **DropZone**: An accessible, drag-and-drop interface with immediate file validation.
- **Sequential Queue**: Uploads are processed one-by-one to ensure stability and precise progress tracking.
- **Metadata Editor**: Real-time editing of song titles, artists, and cover images before the final commit.

### 3. SEO & Accessibility (A11y)
- **Dynamic Titles**: Page titles update dynamically based on the current track or page context.
- **Semantic HTML**: Fully compliant with HTML5 semantic standards (buttons, navs, and landmarks).
- **ARIA Standards**: Every interactive element is optimized for screen readers and keyboard navigation.

---

## 🔗 Deep-Linking System

The "Share" feature in WebMusicVault isn't just a link; it's an automated experience.

1. **Generation**: The app generates a link like `webmusicvault.app/?song=123`.
2. **Detection**: Upon landing, a specialized `useEffect` detects the `song` parameter.
3. **Execution**: The app fetches the song metadata, loads it into the global player, and starts playback automatically.
4. **Cleanup**: It then cleans the URL using `router.replace` without triggering a page reload, keeping the user's view clean.

---

## 📂 Project Architecture

```text
src/
├── app/             # Next.js App Router (Pages & Layouts)
├── components/      # UI Component Library (Navbar, Player, Cards)
├── hooks/           # Custom Logic (usePlaySong, useUpload, useInfiniteScroll)
├── reduxSlices/     # Modular State (Auth, Player, Songs, UI)
├── services/        # API Communication Layer (Song, User, Auth)
├── store/           # Redux Store Configuration & Persist Logic
└── utils/           # Shared Helpers (Formatters, Validators)
```

---

## ⚙️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

---
*Developed by Aaditya0222.*
