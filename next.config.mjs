/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent disk caching during development to eliminate Windows file-lock rename warnings
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
