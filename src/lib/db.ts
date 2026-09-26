import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

/**
 * Neon HTTP Driver Optimization:
 * The @neondatabase/serverless HTTP driver (`neon()`) communicates via stateless HTTP POST queries.
 * Neon explicitly documents that neon() must use the direct (unpooled) endpoint.
 * Supplying a '-pooler' endpoint forces queries through PgBouncer connection pooling overhead,
 * adding 2,000ms - 2,400ms of latency per query.
 * We automatically strip '-pooler' for the HTTP driver to achieve instant ~300ms direct responses.
 */
const dbUrl = process.env.DATABASE_URL.includes('-pooler.')
  ? process.env.DATABASE_URL.replace('-pooler.', '.')
  : process.env.DATABASE_URL;

// Create a singleton instance of the sql query function
export const sql = neon(dbUrl);

