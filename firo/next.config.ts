import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    devIndicators: false,
    allowedDevOrigins: ['192.168.1.2'],
    productionBrowserSourceMaps: false,
    async redirects() {
        return [
            { source: '/about', destination: '/', permanent: false },
            { source: '/projects/:path*', destination: '/', permanent: false },
            { source: '/blog/:path*', destination: '/', permanent: false }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.modulify.website'
            }
        ]
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
        cpus: 1,
        workerThreads: false
    }
}

export default nextConfig
