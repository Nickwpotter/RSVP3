import { drizzle } from 'drizzle-orm/libsql';
import { dev } from '$app/environment';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from '$lib/server/database/schema'

// modified to use TURSO_DB_URL for local development
// const url = dev ? 'file:local.db' : env.TURSO_DB_URL;

const url = import.meta.env.TURSO_DB_URL?.trim();

if (!url) {
	throw new Error('TURSO_DB_URL is not set');
}
if (!dev && !import.meta.env.TURSO_DB_AUTH_TOKEN?.trim()) {
	throw new Error('TURSO_DB_AUTH_TOKEN is not set');
}

const libsql = createClient({ url, authToken: import.meta.env.TURSO_DB_AUTH_TOKEN?.trim() });
export const db = drizzle(libsql, { schema });
