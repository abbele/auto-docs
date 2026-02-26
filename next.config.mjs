/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/auto-docs',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
