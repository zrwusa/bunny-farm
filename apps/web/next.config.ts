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
            },
            {
                hostname: 'lh3.googleusercontent.com'
            },
            {
                hostname: 'sydneytools.co.nz'
            },
            {
                hostname: 'c.media-amazon.com'
            },
            {
                hostname: 'www.rupes.com'
            },
            {
                hostname: 'media.cdn.festool.io'
            },
            {
                hostname: 'www.18650batterystore.com'
            },
            {
                hostname: 'www.toolnation.com'
            },
            {
                hostname: 'www.hilti.co.nz'
            },
            {
                hostname: 'www.metabo.com'
            },
            {
                hostname: 'images.makita.co.nz'
            }
        ]
    }
};

export default nextConfig;
