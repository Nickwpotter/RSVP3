import { lucia } from "$lib/server/auth";
import { db } from '$lib/server/database/db';
import { subscriptionTable, userTable } from '$lib/server/database/schema';
import { redirect } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from "./$types";

// Load user and subscription data for the page
export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        throw redirect(302, "/login");
    }

    const user = event.locals.user;
    const subscription = await db.select().from(subscriptionTable).where(eq(subscriptionTable.userId, user.id));
    console.log("subscription: " + !subscription.plan );
    if (!subscription.plan) {
        throw redirect(302, "/pricing");
    }

    // Fetch additional user profile data
    const userProfile = await db.select({
        id: userTable.id,
        email: userTable.email,
    }).from(userTable).where(eq(userTable.id, user.id));

    console.log(userProfile, subscription)

    return { user: userProfile, subscription };
};