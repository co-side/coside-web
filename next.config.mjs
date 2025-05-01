const API_URL = process.env.NEXT_PUBLIC_API_URL;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    domains: [`558f30e55fa7.ngrok.app`],
  },
};

export default nextConfig;
