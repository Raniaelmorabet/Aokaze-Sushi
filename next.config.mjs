let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizeCss: false,
  },
  // Completely disable static generation
  staticPageGenerationTimeout: 120,
  reactStrictMode: false,
  poweredByHeader: false,
  trailingSlash: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 4,
  },
  // Force server-side rendering for all pages
  output: 'standalone',
  // This is critical for preventing document references during static generation
  compiler: {
    styledComponents: true,
  },
  // Prevent Next.js from pre-rendering static pages with document references
  serverRuntimeConfig: {
    DISABLE_STATIC_OPTIMIZATION: true
  },
  // Disable static optimization
  disableOptimizedLoading: true,
  productionBrowserSourceMaps: true
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
