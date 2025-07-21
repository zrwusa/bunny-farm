import {withSentryConfig} from '@sentry/nextjs';
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
            {
                protocol: 'https',
                hostname: 'cdn2.ridgid.com',
                pathname: '/**',
            },
        ]
    }
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "bunny-farm-group",
project: "bunny-farm-web",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});