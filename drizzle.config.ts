import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/lib/server/database/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DB_URL as string,
		authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
	}
} satisfies Config;
	