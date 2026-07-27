/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent disk caching during development to eliminate Windows file-lock rename warnings
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
