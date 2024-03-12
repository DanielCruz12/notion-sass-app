/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vtqahdoukfytmosthbyu.supabase.co',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
