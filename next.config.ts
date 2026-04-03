import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};
export default nextConfig;