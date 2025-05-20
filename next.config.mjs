const API_URL = process.env.NEXT_PUBLIC_API_URL;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "coside-api-dev.zeabur.app",
      }
    ],
    domains: [`coside-api.zeabur.app`],
  },
};

export default nextConfig;
