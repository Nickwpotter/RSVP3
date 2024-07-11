import { db } from './db';
import { subscriptionTable } from './schema';
import { eq } from 'drizzle-orm';

// Create a subscription
export async function createSubscription(data: { userId: string; plan: string; startDate: number; endDate?: number; trialEnd?: number }) {
	const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
	await db.insert(subscriptionTable).values({
		...data,
		id: generateUniqueId(), // Function to generate a unique ID
		createdAt: now,
		updatedAt: now,
		eventsUsed: 0
	});
}

// Read a subscription by user ID
export async function getSubscriptionByUserId(userId: string) {
	return await db.select().from(subscriptionTable).where(eq(subscriptionTable.userId, userId)).get();
}

// Update a subscription
export async function updateSubscription(id: string, data: Partial<{ plan: string; startDate: number; endDate: number; eventsUsed: number; trialEnd: number }>) {
	const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
	await db.update(subscriptionTable).set({
		...data,
		updatedAt: now
	}).where(eq(subscriptionTable.id, id));
}

// Delete a subscription
export async function deleteSubscription(id: string) {
	await db.delete(subscriptionTable).where(eq(subscriptionTable.id, id));
}

// Check if user has maxed out their account
export async function checkIfMaxedOut(userId: string) {
	const subscription = await getSubscriptionByUserId(userId);
	if (!subscription) return false;

	const planLimits: { [key: string]: number } = {
		'Free': 2,
		'Premium': 15,
		'Enterprise': 100
	};

	const planLimit = planLimits[subscription.plan];
	if (subscription.eventsUsed >= planLimit) {
		return true;
	}
	return false;
}

function generateUniqueId() {
	// Generate a unique ID, e.g., using UUID or some other method
	return 'unique-id'; // Replace with your ID generation logic
}
