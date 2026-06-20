// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
  },
  devIndicators: false,
  images: {
    qualities: [50, 75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "example.com" },
    ],
  },
};

export default nextConfig;
