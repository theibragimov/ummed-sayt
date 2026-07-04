/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    outputFileTracingIncludes: {
      '/api/*': [
        './node_modules/.prisma/client/**/*',
        './node_modules/@prisma/client/**/*',
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
      { protocol: 'https', hostname: 'miniature-prod.moysklad.ru' },
      { protocol: 'https', hostname: '*.moysklad.ru' },
    ],
  },

  async redirects() {
    return [
      {
        source: '/yangi-ummed-pro-burun-aspiratori-u-08',
        destination: '/mahsulot/yangi-ummed-pro-burun-aspiratori-u-08',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-webhook-secret' },
        ],
      },
    ]
  },
}

export default nextConfig
