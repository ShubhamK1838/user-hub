
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => { // Added `webpack` from options
    if (!isServer) {
      // Exclude 'async_hooks' from client-side bundle
      config.resolve.alias.async_hooks = false; // Keep the alias
      
      // Add IgnorePlugin for 'async_hooks'
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^async_hooks$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
