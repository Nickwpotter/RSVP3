import type { signinTable } from './server/database/schema';

export type Link = {
	name: string;
	href: string;
};

export type Faq = {
	question: string;
	answer: string; // HTML
};

export type DefaultSeo = {
	pageTitle: string;
	pageDescription: string;
	twitterCard: string;
	twitterSite: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage: string;
	ogType: string;
	ogTitle?: string;
	ogDescription?: string;
	ogUrl: string;
	ogImage: string;
};

export type Signin = typeof signinTable.$inferInsert;

export type Seo = Partial<DefaultSeo>;

export const Free = 'price_free';  // Replace with your actual Basic plan price ID
export const Premium = 'price_1PbAMyEiOdndJtQHcPlqX0D7';  // Replace with your actual Premium plan price ID
export const Enterprise = 'price_1PbDIbEiOdndJtQHhEuDdBGu'; // Replace with your actual Enterprise plan price ID
