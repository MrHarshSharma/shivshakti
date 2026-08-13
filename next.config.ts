import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosting (Hostinger VPS): emits .next/standalone with a server.js and only
  // the node_modules actually reached by the build, so the upload is a fraction of
  // a full install. Vercel ignores this setting, so it is safe to leave on.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'bfrrdnyucghofqgfaxmf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
