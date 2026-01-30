import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Vercel 배포 시 필요한 설정
  output: 'standalone',
  // 환경 변수 검증
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
