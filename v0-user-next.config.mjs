/** @type {import('next').NextConfig} */
const userNextConfig = {
  // Configure how auth pages are handled during build
  experimental: {
    // This helps with the document not defined error
    optimizeCss: false
  },
  // External packages for server components
  serverExternalPackages: ['js-cookie'],
  // Add specific page configs
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Configure images
  images: {
    domains: ['aokaze-sushi.vercel.app']
  },
  // Output configuration - helps with static file serving
  output: 'standalone',
  // Help with asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Improve public file handling
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.next'
}

export default userNextConfig 