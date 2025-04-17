import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: 'images.homedepot.ca'
            },
            {
                hostname: 'images.homedepot.com'
            },
            {
                hostname: 'i0.wp.com'
            },
            {
                hostname: 'images.thdstatic.com'
            },
            {
                hostname: 'www.thdstatic.com'
            },
            {
                hostname: 'm.media-amazon.com'
            }
        ]
    }
};

export default nextConfig;
