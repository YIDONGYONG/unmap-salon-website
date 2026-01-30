import type { NextConfig } from "next";

// GitHub Pages base path 설정
// 저장소 이름이 base path가 됨 (예: unmap-salon-website)
const repositoryName = process.env.NEXT_PUBLIC_REPO_NAME || 'unmap-salon-website'
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? `/${repositoryName}` : ''

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages 배포를 위한 정적 export
  output: 'export',
  // GitHub Pages base path 설정
  basePath: basePath,
  assetPrefix: basePath,
};

export default nextConfig;
