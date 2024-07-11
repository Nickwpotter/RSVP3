import { json, redirect, type RequestEvent } from '@sveltejs/kit';
import { stripeClient } from '../stripe';
import { createSubscription } from '$lib/server/database/subscription.model';
import { subscriptionTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/database/db';
import { TimeSpan, createDate } from 'oslo';

export async function POST(event: RequestEvent): Promise<Response> {
    const user = event.locals.user;

    if (!user) {
        // Check if the request expects JSON
        if (event.request.headers.get('accept')?.includes('application/json')) {
            return json({
                status: 302,
                redirect: "/login",
                error: "User not authenticated"
            });
        } else {
            throw redirect(302, "/login");
        }
    }

    const data = await event.request.json();
    const priceId = data.priceId;

    if (typeof priceId !== 'string') {
        return json({
            status: 400,
            error: {
                message: 'priceId is required'
            }
        });
    }

    // Check if the user already has a subscription
    const existingSubscription = await db.select().from(subscriptionTable).where(eq(subscriptionTable.userId, user.id)).limit(1);
    
    if (existingSubscription.length > 0) {
        return json({
            status: 400,
            error: {
                message: 'User already has a subscription'
            }
        });
    }

    // Handle free subscription plan
    if (priceId === "price_free") {
        try {
            const startDate = createDate(new TimeSpan(0, 'ms')).getTime(); // Use oslo to create the date
            await createSubscription({
                userId: user.id,
                plan: "free",
                startDate: startDate,
                eventsUsed: 0
            });
            return json({
                status: 200,
                message: 'Subscription created successfully'
            });
        } catch (error) {
            console.error('Error creating subscription:', error);
            return json({
                status: 500,
                error: {
                    message: 'Error creating subscription'
                }
            });
        }
    }

    // Handle paid subscription plans
    try {
        const session = await stripeClient.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${event.url.origin}/dashboard?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${event.url.origin}`
        });

        if (!session.url) {
            throw new Error('No session URL');
        }

        // Redirect to Stripe checkout session
        return json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        return json({
            status: 500,
            error
        });
    }
}
