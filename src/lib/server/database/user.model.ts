import { eq } from 'drizzle-orm';
import { db } from './db';
import { userTable } from './schema';
import { sql } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
    const user = await db.select().from(userTable).where(eq(userTable.email, email));
    if (user.length === 0) {
        return null;
    } else {
        return user[0];
    }
};

export const getUserById = async (id: string) => {
    const user = await db.select().from(userTable).where(eq(userTable.id, id));
    if (user.length === 0) {
        return null;
    } else {
        return user[0];
    }
};

type UpdateUser = Partial<typeof userTable.$inferInsert>;
export const updateUser = async (id: string, user: UpdateUser) => {
    const result = await db.update(userTable).set(user).where(eq(userTable.id, id)).returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

type NewUser = {
    id: string;
    addressId?: string | null;
    subscriptionId?: string | null;
    firstName?: string;
    lastName?: string;
    email: string;
    email_verified: boolean;
    phone?: string;
    canContact: boolean;
};

export const createNewUser = async (user: NewUser) => {
    const result = await db.insert(userTable).values({
        ...user,
        createdAt: sql`(unixepoch())`,
        updatedAt: sql`(unixepoch())`
    }).onConflictDoNothing().returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};

type OauthUser = {
    id: string;
    email: string;
    email_verified: boolean;
    canContact: boolean;
    addressId?: string | null;
    subscriptionId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
};

export const createNewOauthUser = async (user: OauthUser) => {
    const result = await db.insert(userTable).values({
        ...user,
        createdAt: sql`(unixepoch())`,
        updatedAt: sql`(unixepoch())`
    }).onConflictDoNothing().returning();
    if (result.length === 0) {
        return null;
    } else {
        return result[0];
    }
};