import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Create a singleton instance of the sql query function with cache: 'no-store'
// to prevent Next.js from caching Neon serverless HTTP fetch calls
export const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
});
