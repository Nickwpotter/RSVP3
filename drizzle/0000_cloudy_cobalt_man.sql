CREATE TABLE `address` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`street_1` text NOT NULL,
	`street_2` text DEFAULT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` integer NOT NULL,
	`country` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `email_verification_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`address_id` text DEFAULT NULL,
	`event_name` text NOT NULL,
	`event_theme` text DEFAULT NULL,
	`email` text DEFAULT NULL,
	`phone` text DEFAULT NULL,
	`status` text NOT NULL,
	`description` text DEFAULT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `guest` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text DEFAULT NULL,
	`address_id` text DEFAULT NULL,
	`accompanying_guest` text DEFAULT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text DEFAULT NULL,
	`phone` text DEFAULT NULL,
	`is_attending` integer DEFAULT NULL,
	`can_contact` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `image` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`event_id` text NOT NULL,
	`image_data` blob NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `newsletter_user` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`user_id` text DEFAULT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`can_contact` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `signin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`logged_in_at` integer DEFAULT (unixepoch()) NOT NULL,
	`ip_address` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`plan` text NOT NULL,
	`events_used` integer DEFAULT 0 NOT NULL,
	`active` integer NOT NULL,
	`status` text NOT NULL,
	`qty_users` integer DEFAULT NULL,
	`trial_end` integer DEFAULT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`subscription_id` text DEFAULT NULL,
	`address_id` text DEFAULT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`can_contact` integer NOT NULL,
	`email_verified` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscription`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON UPDATE no action ON DELETE no action
);
