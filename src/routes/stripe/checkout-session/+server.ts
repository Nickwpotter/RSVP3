import { json, redirect, type RequestEvent } from '@sveltejs/kit';
import { stripeClient } from '../stripe';
import { createSubscriptionAndUpdateUser } from '$lib/server/database/userAndSubscription';
import { updateSubscription } from '$lib/server/database/subscription.model';
import { subscriptionTable, userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/database/db';
import { TimeSpan, createDate } from 'oslo';
import { generateId } from 'lucia';

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
    const userWithSubscription = await db
        .select()
        .from(userTable)
        .leftJoin(subscriptionTable, eq(userTable.subscriptionId, subscriptionTable.id))
        .where(eq(userTable.id, user.id))
        .limit(1);

    // Extract existing subscription and plan details
    const existingSubscription = userWithSubscription[0]?.subscription?.stripeSubscriptionId || null;
    const subscriptionId =userWithSubscription[0]?.subscription?.id;
    const existingPlan = userWithSubscription[0]?.subscription?.plan || null;
    console.log(existingSubscription)

    if (existingSubscription) {
        // Check if the user selected the same plan
        if (existingPlan === data.plan) {
            return json({
                status: 200,
                message: 'User already has this subscription',
                url: '/dashboard'
            });
        }

        // Handle scenario where user selects free plan but has an existing paid subscription
        if (priceId === "price_free" && existingPlan !== "free") {
            // Cancel the existing Stripe subscription if it exists and is not free
            try {
                await stripeClient.subscriptions.cancel(existingSubscription);
                console.log('canceled subscription successfuly')
            } catch (error) {
                console.error('Error canceling Stripe subscription:', error);
                return json({
                    status: 500,
                    error: {
                        message: 'Error canceling Stripe subscription'
                    }
                });
            }

            try {
                const startDate = createDate(new TimeSpan(0, 'ms')).getTime(); // Use oslo to create the date
                console.log('starting update subscription.')
                console.log('existingSubscription: ' + existingSubscription)
                await updateSubscription(subscriptionId!, {
                    plan: data.plan,
                    active: true,
                    status: "good",
                    startDate,
                    stripeId: existingSubscription
                });
                console.log("finished updating subscription;")
                // Optionally, update the user's subscriptionId in the user table if needed
                // await db.update(userTable).set({
                //     subscriptionId: existingSubscription,
                //     updatedAt: sql`(unixepoch())`
                // }).where(eq(userTable.id, user.id));

                return json({
                    status: 200,
                    message: 'Subscription updated successfully',
                    url: '/dashboard'
                });
            } catch (error) {
                console.error('Error updating subscription:', error);
                return json({
                    status: 500,
                    error: {
                        message: 'Error updating subscription'
                    }
                });
            }
        }

        // Handle scenario where user wants to upgrade plan
        if (existingPlan !== data.plan && data.plan !== "free") {
            try {
                // // Create a Stripe checkout session for the upgrade
                // console.log('attempt to upgrade current subscription');
                // console.log('Existing subscription: ' + existingSubscription)
                // const subscriptionData = await stripeClient.subscriptions.update(existingSubscription, {
                //     items: [
                //         {
                //             price: priceId,
                //             quantity: 1
                //         }
                //     ],
                //     metadata: {'plan': data.plan},
                // });
                // console.log(subscriptionData);
                // if (subscriptionData){
                //     const startDate = createDate(new TimeSpan(0, 'ms')).getTime(); // Use oslo to create the date
                //     console.log('starting update subscription.')
                //     console.log('existingSubscription: ' + existingSubscription)
                //     await updateSubscription(subscriptionId!, {
                //         plan: subscriptionData.metadata.plan,
                //         active: true,
                //         status: "good",
                //         startDate,
                //         stripeId: existingSubscription
                //     });
                //     console.log("finished updating subscription;")
                // }

                const session = await stripeClient.checkout.sessions.create({
                    mode: 'subscription',
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price: priceId,
                            quantity: 1
                        }
                    ],
                    metadata: {'plan': data.plan},
                    success_url: `${event.url.origin}/stripe/success?sessionId={CHECKOUT_SESSION_ID}`,
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
                    error: {
                        message: 'Error creating Stripe session'
                    }
                });
            }
        }
    }
    // Handle scenario where user selects free plan and has no existing subscription
    if (priceId === "price_free") {
        try {
            const startDate = createDate(new TimeSpan(0, 'ms')).getTime(); // Use oslo to create the date
            await createSubscriptionAndUpdateUser({
                id: generateId(15),
                userId: user.id,
                plan: "free",
                startDate: startDate,
                active: true,
                status: "good",
                qtyUsers: 1,
                eventsUsed: 0
            });
            return json({
                status: 200,
                message: 'Subscription created successfully',
                url: '/dashboard'
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
            metadata: {'plan': data.plan},
            success_url: `${event.url.origin}/stripe/success?sessionId={CHECKOUT_SESSION_ID}`,
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

// // Add a new GET handler to check the subscription status after the user is redirected back from Stripe
// export async function GET(event: RequestEvent): Promise<Response> {
//     const sessionId = event.url.searchParams.get('sessionId');
//     if (!sessionId) {
//         return json({
//             status: 400,
//             error: {
//                 message: 'sessionId is required'
//             }
//         });
//     }

//     try {
//         const session = await stripeClient.checkout.sessions.retrieve(sessionId);
//         if (!session || session.payment_status !== 'paid') {
//             return json({
//                 status: 400,
//                 error: {
//                     message: 'Payment was not successful'
//                 }
//             });
//         }

//         const user = event.locals.user;
//         if (!user) {
//             throw new Error('User is not authenticated');
//         }
//         const startDate = createDate(new TimeSpan(0, 'ms')).getTime();
//         await createSubscriptionAndUpdateUser({
//             id: generateId(15),
//             userId: user.id,
//             plan: session.metadata?.plan || '',
//             startDate: startDate,
//             active: true,
//             status: "good",
//             qtyUsers: 1,
//             eventsUsed: 0,
//             stripeId: session.id
//         });

//         return json({
//             status: 200,
//             message: 'Subscription created successfully',
//             url: '/dashboard'
//         });
//     } catch (error) {
//         console.error('Error creating subscription after payment:', error);
//         return json({
//             status: 500,
//             error: {
//                 message: 'Error creating subscription after payment'
//             }
//         });
//     }
// }
