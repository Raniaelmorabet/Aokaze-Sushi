/**
 * This is a server-side config file that sets global revalidation settings
 * for all app routes. Next.js will pick up these values during build.
 * 
 * Important: If specific routes need to override these settings, they 
 * should not use the same exports to avoid conflicts.
 */

// Disable all static generation and caching
export const revalidate = false

// Force all pages to be dynamically rendered at request time
export const dynamic = 'force-dynamic'

// Disable fetch caching for all fetch calls in the app
export const fetchCache = 'force-no-store'

// Disable static exports - we want everything to be server-rendered
export const generateStaticParams = () => { return [] }

// Export a comment to indicate this file was loaded
export const __CONFIG_LOADED__ = true 