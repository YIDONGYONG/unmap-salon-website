import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/unmap-salon-website' : ''

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages 배포를 위한 정적 export
  output: 'export',
  // GitHub Pages base path 설정 (저장소 이름이 base path가 됨)
  basePath: basePath,
  assetPrefix: basePath,
};

export default nextConfig;
