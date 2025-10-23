import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Externalize native dependencies for server-side
            config.externals = config.externals || []
            config.externals.push({
                '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node',
                '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
            })
        }

        // Ignore node-specific files
        config.resolve.alias = {
            ...config.resolve.alias,
        }

        // Ignore certain file types
        config.module = config.module || {}
        config.module.rules = config.module.rules || []
        config.module.rules.push({
            test: /\.html$/,
            type: 'asset/resource',
        })

        return config
    },
}

export default nextConfig

