# WebMusicVault 🎵

A modern web-based music player application built with React, TypeScript, and Redux Toolkit.

## Features ✨

### Available Now

- 🎵 Music playback with play/pause controls
- ⏭️ Next/Previous track navigation
- 🔄 Repeat modes (single track, playlist, no repeat)
- 🔀 Shuffle play functionality
- 📜 Infinite scroll for song listing
- ↕️ Song sorting (ascending/descending)
- 🎚️ Animated player panel
- ⬆️ Music upload capabilities

### Authentication System 🔐

- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Protected routes for authenticated users
- Persistent login state
- Auto logout on token expiration
- Session management

### Coming Soon

- 📑 Playlist management
- 🔍 Advanced search functionality
- 📱 Mobile responsive design
- 🎨 Theme customization
- 📊 Music analytics
- 💾 Offline mode

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/WebMusicVaultFrontend.git
```

2. Install dependencies

```bash
cd WebMusicVaultFrontend
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory:

```env
VITE_API_URL=your_backend_url
VITE_JWT_SECRET=your_jwt_secret
```

4. Start the development server

```bash
npm run dev
```

## Authentication Flow 🔒

### Registration

```typescript
POST /api/auth/register
Body: {
  email: string,
  password: string,
  username: string
}
```

### Login

```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
```

### Password Reset

```typescript
POST / api / auth / reset - password;
Body: {
  email: string;
}
```

### Protected Routes

All music-related features require authentication. Protected routes are wrapped with `AuthGuard` component:

```typescript
<AuthGuard>
  <MusicPage />
</AuthGuard>
```

## Project Structure 📁

```
src/
├── components/         # Reusable components
├── pages/             # Page components
│   ├── Login.tsx     # Login page
│   ├── SignUp.tsx    # Registration page
│   └── ...other pages
├── reduxSlices/       # Redux state management
│   ├── auth/         # Authentication slice
│   └── song/         # Music player slice
├── services/          # API services
└── store/             # Redux store configuration
```

## State Management 📊

Using Redux Toolkit (RTK) for:

- Authentication state
- Music playback state
- Song queue management
- Application UI state

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

[MIT License](LICENSE)

## Acknowledgments 🙏

- [React Documentation](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
