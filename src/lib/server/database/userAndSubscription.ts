import { db } from './db';
import { subscriptionTable, userTable } from './schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Create a subscription and update the user's subscriptionId
export async function createSubscriptionAndUpdateUser(data: { id: string; userId: string;plan: string; startDate: number; endDate?: number; active: boolean; status: string; qtyUsers: number; eventsUsed: number, stripeId?: string }) {
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const trialEnd = data.plan === 'free' ? now + 14 * 24 * 60 * 60 : null; // 14 days from now if plan is free

    // Create the subscription
    const [subscription] = await db.insert(subscriptionTable).values({
        ...data,
        id: data.id,
        stripeSubscriptionId: data.stripeId,
        trialEnd: trialEnd ? sql`${trialEnd}` : null,
        createdAt: sql`(unixepoch())`,
        updatedAt: sql`(unixepoch())`,
        qtyUsers: data.qtyUsers || 1
    }).returning({
        id: subscriptionTable.id
    });

    if (!subscription) {
        throw new Error('Failed to create subscription');
    }

    // Update the user's subscriptionId
    const result = await db.update(userTable).set({
        subscriptionId: subscription.id,
        updatedAt: sql`(unixepoch())`
    }).where(eq(userTable.id, data.userId)).returning();

    if (result.length === 0) {
        throw new Error('Failed to update user with subscription');
    }

    return { subscriptionId: subscription.id, userId: data.userId };
}