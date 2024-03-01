/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['vtqahdoukfytmosthbyu.supabase.co'],
  },
}

module.exports = nextConfig
