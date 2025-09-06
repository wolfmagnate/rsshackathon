import type { NextConfig } from 'next';
import nextPwa from 'next-pwa';

// next-pwaの設定
const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  customWorkerDir: 'worker',
  // disable: process.env.NODE_ENV === 'development',
});

// Next.js本体の設定
const nextConfig: NextConfig = {
  // ここにNext.jsの独自設定を追加できます
  // 例: reactStrictMode: true,
};

export default withPWA(nextConfig);
