/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "m.media-amazon.com", "example.com"],
  },
  output: 'standalone',
  // Enable SWC minification for improved performance
  swcMinify: true,
};

export default nextConfig;
