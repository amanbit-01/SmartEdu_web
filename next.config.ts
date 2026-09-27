import type { NextConfig } from "next";

// Normal Next.js deployment on Vercel; dynamic review routes remain supported.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  allowedDevOrigins: ["192.168.190.1", "localhost", "127.0.0.1"],
};

export default nextConfig;
