import type { NextConfig } from 'next';

const isPages = process.env.DEPLOY_TARGET === 'github-pages';
const nextConfig: NextConfig = {
  ...(isPages ? { output: 'export', basePath: '/Decrypte', images: { unoptimized: true }, trailingSlash: true } : {}),
};
export default nextConfig;
