import type { Config } from 'drizzle-kit';
import { env } from '$env/dynamic/private';


export default {
	schema: './src/lib/server/database/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: env.TURSO_DB_URL!,
		authToken: env.TURSO_DB_AUTH_TOKEN!,
	}
} satisfies Config;
