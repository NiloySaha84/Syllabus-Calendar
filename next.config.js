/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  },
  typescript: {
    
    ignoreBuildErrors: false,
  },
  eslint: {
    
    ignoreDuringBuilds: false,
  },
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
}

module.exports = nextConfig