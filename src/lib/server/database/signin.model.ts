import { eq, or } from 'drizzle-orm';
import { db } from './db';
import { signinTable } from './schema';
import { sql } from 'drizzle-orm';
import type { Signin } from '$lib/types';
// Function to get sign-ins based on email and IP address
export const getSignins = async (signin: { email: string; ipAddress: string }) => {
	// Delete all sign-ins that are older than 1 hour
	let batchResult = await db.batch([
		db.delete(signinTable).where(eq(signinTable.loggedInAt, sql`(unixepoch() - 3600)`)),
		db
			.select()
			.from(signinTable)
			.where(or(eq(signinTable.email, signin.email), eq(signinTable.ipAddress, signin.ipAddress)))
	]);
	return batchResult[1];
};

// Function to create a new sign-in record
export const createSignin = async (signin: Signin) => {
	await db.insert(signinTable).values(signin);
};
