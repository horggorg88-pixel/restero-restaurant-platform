/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router включен по умолчанию в Next.js 14
  output: 'standalone', // Включаем для Docker production
  images: { dangerouslyAllowSVG: true },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
