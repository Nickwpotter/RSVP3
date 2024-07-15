import { db } from './db';
import { subscriptionTable } from './schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Create a subscription
export async function createSubscription(data: {  id: string; plan: string; startDate: number; endDate?: number; active: boolean; status: string; qtyUsers: number; eventsUsed: number, stripeId: string}) {
	const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
	const trialEnd = data.plan === 'free' ? now + 14 * 24 * 60 * 60 : null; // 14 days from now if plan is free

	await db.insert(subscriptionTable).values({
		...data,
		stripeSubscriptionId: data.stripeId,
		trialEnd: trialEnd ? sql`${trialEnd}` : null,
		createdAt: sql`(unixepoch())`,
		updatedAt: sql`(unixepoch())`,
		qtyUsers: data.qtyUsers || 1
	});
}

// Read a subscription by user ID
export async function getSubscriptionById(id: string) {
	return await db.select().from(subscriptionTable).where(eq(subscriptionTable.id, id)).get();
}

// Update a subscription
export async function updateSubscription(id: string, data: Partial<{ plan: string; startDate: number; endDate: number; eventsUsed: number; active: boolean; status: string; stripeId: string }>) {

	console.log('Stripe update subscription api:' + data.stripeId);

	await db.update(subscriptionTable).set({
		...data,
		plan: data.plan,
		stripeSubscriptionId: data.stripeId,
		updatedAt: sql`(unixepoch())`
	}).where(eq(subscriptionTable.id, id));
}

// Delete a subscription
export async function deleteSubscription(id: string) {
	await db.delete(subscriptionTable).where(eq(subscriptionTable.id, id));
}

// Check if user has maxed out their account
export async function checkIfMaxedOut(id: string) {
	const subscription = await getSubscriptionById(id);
	if (!subscription) return false;

	const planLimit = planLimits[subscription.plan];
	if (subscription.eventsUsed >= planLimit) {
		return true;
	}
	return false;
}

export const planLimits: { [key: string]: number } = {
	'free': 2,
	'premium': 15,
	'enterprise': 100
};
