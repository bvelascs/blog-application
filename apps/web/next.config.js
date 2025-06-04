/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "m.media-amazon.com", "example.com"],
  },
  output: 'standalone',
  // Next.js 15+ enables SWC minification by default, no need to specify
};

export default nextConfig;
