/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow any remote image and local SVGs
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // When deployed behind a path-based proxy (e.g. the Perplexity sandbox proxy),
  // set NEXT_PUBLIC_BASE_PATH='/port/3000' so all links and assets use that prefix.
  // For local dev and Raspberry Pi deploy, leave unset.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Allow the Next server to serve through any host header (proxy)
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
};
export default nextConfig;
