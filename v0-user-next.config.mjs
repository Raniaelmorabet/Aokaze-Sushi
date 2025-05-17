/** @type {import('next').NextConfig} */
const userNextConfig = {
  // Configure how auth pages are handled during build
  experimental: {
    // This helps with the document not defined error
    optimizeCss: false,
    // Disable static generation for error pages
    serverComponentsExternalPackages: ['js-cookie']
  },
  // External packages for server components
  serverExternalPackages: ['js-cookie'],
  // Add specific page configs
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Configure images
  images: {
    domains: ['aokaze-sushi.vercel.app']
  },
  // Output configuration - force server components 
  output: 'standalone',
  // Help with asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Improve public file handling
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.next',
  // Exclude not-found page from static generation
  excludeDefaultMomentLocales: true,
  generateEtags: false,
  // Configure static generation
  env: {
    SERVER_ONLY_COOKIE_NAME: 'next-auth.session-token',
  },
  // Disallow static generation for problematic routes
  generateBuildId: async () => {
    return 'build-' + new Date().getTime()
  },
  // Force server-side rendering for all pages
  runtime: 'nodejs',
  // Global setting for incremental static regeneration
  staticPageGenerationTimeout: 120,
  // Disable static optimization
  reactStrictMode: false,
  // Prevent 404s on Next.js resources
  poweredByHeader: false,
  // Configure trailing slash
  trailingSlash: false
}

export default userNextConfig 