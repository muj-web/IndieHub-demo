import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'okmxoxaxsotxkiyljcuy.supabase.co', // Rovnou přidávám i tvoji Supabase databázi!
      }
    ],
  },
};

export default nextConfig;