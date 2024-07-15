import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const signinTable = sqliteTable('signin', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	loggedInAt: integer('logged_in_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	ipAddress: text('ip_address').notNull(),
	email: text('email').notNull()
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const emailVerificationTokenTable = sqliteTable('email_verification_token', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id').notNull(),
	email: text('email').notNull(),
	expires_at: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Users table
export const userTable = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	subscriptionId: text('subscription_id').default(sql`NULL`).references(() => subscriptionTable.id),
	addressId: text('address_id').default(sql`NULL`).references(() => addressTable.id),
	firstName: text('first_name').default(sql`NULL`),
	lastName: text('last_name').default(sql`NULL`),
	email: text('email').notNull(),
	phone: text('phone').default(sql`NULL`),
	canContact: integer('can_contact', { mode: 'boolean' }).notNull(),
	email_verified: integer('email_verified', { mode: 'boolean' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});


export const subscriptionTable = sqliteTable('subscription', {
    id: text('id').notNull().primaryKey(),
    plan: text('plan').notNull(),
    eventsUsed: integer('events_used').notNull().default(0),
    active: integer('active', { mode: 'boolean' }).notNull(),
    status: text('status').notNull(),
    qtyUsers: integer('qty_users').default(sql`NULL`),
    trialEnd: integer('trial_end', { mode: 'timestamp' }).default(sql`NULL`),
    stripeSubscriptionId: text('stripe_subscription_id').default(sql`NULL`), // Add this line
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// Addresses table
export const addressTable = sqliteTable('address', {
	id: text('id').notNull().primaryKey(),
	street1: text('street_1').notNull(),
	street2: text('street_2').default(sql`NULL`),
	city: text('city').notNull(),
	state: text('state').notNull(),
	zipCode: integer('zip_code').notNull(),
	country: text('country').notNull()
});

// Events table
export const eventTable = sqliteTable('event', {
	id: text('id').notNull().primaryKey(),
	addressId: text('address_id').default(sql`NULL`).references(() => addressTable.id),
	eventName: text('event_name').notNull(),
	eventTheme: text('event_theme').default(sql`NULL`),
	email: text('email').default(sql`NULL`),
	phone: text('phone').default(sql`NULL`),
	status: text('status').notNull(),
	description: text('description').default(sql`NULL`),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// Images table
export const imageTable = sqliteTable('image', {
	id: text('id').notNull().primaryKey(),
	eventId: text('event_id').notNull().references(() => eventTable.id),
	imageData: blob('image_data').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// Guests table
export const guestTable = sqliteTable('guest', {
	id: text('id').notNull().primaryKey(),
	eventId: text('event_id').notNull().references(() => eventTable.id),
	userId: text('user_id').default(sql`NULL`).references(() => userTable.id),
	addressId: text('address_id').default(sql`NULL`).references(() => addressTable.id),
	accompanyingGuest: text('accompanying_guest').default(sql`NULL`),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').default(sql`NULL`),
	phone: text('phone').default(sql`NULL`),
	isAttending: integer('is_attending', { mode: 'boolean' }).default(sql`NULL`),
	canContact: integer('can_contact', { mode: 'boolean' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// Newsletter Users table
export const newsletterUserTable = sqliteTable('newsletter_user', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id').default(sql`NULL`).references(() => userTable.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	canContact: integer('can_contact', { mode: 'boolean' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});
