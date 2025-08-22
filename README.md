# WebMusicVault 🎵

A modern web music player built with React and TypeScript. Stream your music, create playlists, and enjoy a seamless listening experience.

![App Screenshot](./screenshots/app-preview.png) <!-- You should add screenshots -->

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/WebMusicVaultFrontend.git

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** TailwindCSS
- **Animations:** GSAP
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library
- **API Client:** Axios

## 📚 Core Features

### Music Player

- Full audio playback controls
- Real-time progress bar
- Shuffle and repeat modes
- Volume control with mute option

### Library Management

- Infinite scroll song list
- Sort by title, artist, duration
- Quick search functionality
- Upload new tracks

### Authentication

- JWT-based auth flow
- Protected routes
- Persistent sessions

## 🏗️ Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── redux/           # Redux store and slices
├── services/        # API services
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

## 💻 Development

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3000
VITE_JWT_SECRET=your_secret
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## ⚡ Performance

- Lazy loading for routes
- Image optimization
- Debounced search
- Virtualized lists for large datasets

## 🔒 Security

- JWT token refresh mechanism
- XSS protection
- CORS configured
- Secure cookie usage

## 🌟 Coming Soon

- [ ] Dark/Light theme toggle
- [ ] Playlist management
- [ ] Social sharing
- [ ] Offline support

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -am 'Add NewFeature'`)
4. Push branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📝 License

MIT © [Aaditya Chaurasiya]

## 🙏 Credits

Built with:

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
