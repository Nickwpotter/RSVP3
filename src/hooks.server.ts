import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database/db';
import { userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	const protectedRoutes = ['/dashboard']; // Add your protected routes here

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.subscriptionId = null;

		// Check for protected routes
		if (protectedRoutes.includes(event.url.pathname)) {
			throw redirect(302, '/login');
		}

		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
	}

	if (user) {
		const userData = await db.select({
			subscriptionId: userTable.subscriptionId
		}).from(userTable).where(eq(userTable.id, user.id)).get();

		event.locals.user = user;
		event.locals.session = session;
		event.locals.subscriptionId = userData?.subscriptionId || null;

		// Check for protected routes
		if (protectedRoutes.includes(event.url.pathname) && !userData?.subscriptionId) {
			throw redirect(302, '/pricing');
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.subscriptionId = null;

		// Check for protected routes
		if (protectedRoutes.includes(event.url.pathname)) {
			throw redirect(302, '/login');
		}
	}
	return resolve(event);
};
