import { json, redirect, type RequestEvent } from "@sveltejs/kit";
import { stripeClient } from '../stripe';
import { updateSubscription, getSubscriptionById } from '$lib/server/database/subscription.model';
import { createSubscriptionAndUpdateUser } from '$lib/server/database/userAndSubscription';
import { getUserById } from '$lib/server/database/user.model';
import { db } from '$lib/server/database/db';
import { userTable } from '$lib/server/database/schema';
import { generateId } from 'lucia';
import { eq, sql } from 'drizzle-orm';
import { createDate, TimeSpan } from 'oslo';

export async function GET(event: RequestEvent) {
    const { url, locals } = event;
    console.log("Event locals user: ", locals.user);
    if (!locals.user) {
        console.log("User not authenticated, returning 401");
        return json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = locals.user;
    const subscriptionId = locals.subscriptionId;
    console.log("User ID: ", user.id);
    console.log("Subscription ID: ", subscriptionId);

    const sessionId = url.searchParams.get('sessionId');
    console.log("Session ID from URL: ", sessionId);

    let subscriptionSuccess = false;

    if (sessionId) {
        try {
            const session = await stripeClient.checkout.sessions.retrieve(sessionId);
            console.log("Stripe session retrieved: ", session);
            console.log("Session metadata: ", session.metadata);
            console.log("Session subscriptionId: ", session.subscription);
            if (!session || session.payment_status !== 'paid') {
                return json({ error: 'Payment was not successful' }, { status: 400 });
            }

            const startDate = createDate(new TimeSpan(0, 'ms')).getTime();
            console.log("Start date: ", startDate);

            const stripeSubscriptionId = session.subscription ? String(session.subscription) : undefined;
            console.log('Parsed stripesubscriptionId: ' + stripeSubscriptionId);
            if (subscriptionId) {
                console.log("Updating existing subscription");
                await updateSubscription(subscriptionId, {
                    plan: session.metadata?.plan || '',
                    active: true,
                    status: "good",
                    startDate,
                    stripeId: stripeSubscriptionId
                });
                console.log("Subscription updated successfully");
            } else {
                console.log("Creating new subscription");
                const newSubscriptionId = generateId(15);
                await createSubscriptionAndUpdateUser({
                    id: newSubscriptionId,
                    userId: user.id,
                    plan: session.metadata?.plan || '',
                    startDate: startDate,
                    active: true,
                    status: "good",
                    qtyUsers: 1,
                    eventsUsed: 0,
                    stripeId: stripeSubscriptionId
                });

                console.log("Updating user's subscription ID to: ", newSubscriptionId);
                await db.update(userTable).set({
                    subscriptionId: newSubscriptionId,
                    updatedAt: sql`(unixepoch())`
                }).where(eq(userTable.id, user.id));
                console.log("User's subscription ID updated successfully");
            }

            subscriptionSuccess = true;
        } catch (error) {
            console.error('Error creating subscription after payment:', error);
            return json({ error: 'Error creating subscription after payment' }, { status: 500 });
        }
    }

    const checkUser = await getUserById(user.id);
    console.log("Check user: ", checkUser);
    if (!checkUser || !checkUser.subscriptionId) {
        console.log("User has no subscription, returning 302 to pricing");
        throw redirect(302, '/pricing');
    }

    const subscription = await getSubscriptionById(checkUser.subscriptionId);
    console.log("Subscription: ", subscription);
    if (!subscription || subscription.plan == null || subscription.stripeSubscriptionId == null) {
        console.log("No valid subscription plan found, returning 302 to pricing");
        throw redirect(302, '/pricing');
    }

    // Fetch additional user profile data
    const userProfile = await db.select({
        id: userTable.id,
        email: userTable.email,
    }).from(userTable).where(eq(userTable.id, user.id));

    console.log("User profile: ", userProfile);
    console.log("Subscription: ", subscription);

    if (subscriptionSuccess) {
        console.log("Subscription success, redirecting to dashboard");
        throw redirect(302, "/dashboard");
    }

    return json({ user: userProfile, subscription, subscriptionSuccess });
}
