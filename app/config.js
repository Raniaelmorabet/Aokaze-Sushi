/**
 * This is a server-side config file that sets global revalidation settings
 * for all app routes. Next.js will pick up these values during build.
 */

// Set to false to disable static generation for all pages
export const revalidate = false

// Force all pages to be dynamically rendered at request time
export const dynamic = 'force-dynamic'

// Disable fetch caching for all fetch calls in the app
export const fetchCache = 'force-no-store' 