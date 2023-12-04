/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['https://vtqahdoukfytmosthbyu.supabase.co/'],
  },
}

module.exports = nextConfig
