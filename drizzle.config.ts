import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({ path: '.env' });

export default {
	schema: './src/lib/server/database/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DB_URL!,
		authToken: process.env.TURSO_DB_AUTH_TOKEN!,
	}
} satisfies Config;
