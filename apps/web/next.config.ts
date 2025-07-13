import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.homedepot.ca',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.homedepot.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i0.wp.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.thdstatic.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.thdstatic.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'sydneytools.co.nz',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'c.media-amazon.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.rupes.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.cdn.festool.io',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.18650batterystore.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.toolnation.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.hilti.co.nz',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.metabo.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.makita.co.nz',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.makitatools.com',
                pathname: '/**',
            },
        ]
    }
};

export default nextConfig;
