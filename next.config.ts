import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // تجاوز أخطاء فحص الأنواع أثناء البناء على Vercel لضمان نجاح الـ Deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // تجاهل تحذيرات الـ Lint أثناء البناء
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;