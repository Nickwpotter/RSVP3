

CREATE TABLE `user` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `subscription_id` TEXT DEFAULT NULL REFERENCES `subscription`(`id`),
  `address_id` TEXT DEFAULT NULL REFERENCES `address`(`id`),
  `first_name` TEXT DEFAULT NULL,
  `last_name` TEXT DEFAULT NULL,
  `email` TEXT NOT NULL,
  `phone` TEXT DEFAULT NULL,
  `can_contact` INTEGER NOT NULL,
  `email_verified` INTEGER,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `subscription` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `plan` TEXT NOT NULL,
  `events_used` INTEGER NOT NULL DEFAULT 0,
  `active` INTEGER NOT NULL,
  `status` TEXT NOT NULL,
  `qty_users` INTEGER DEFAULT NULL,
  `trial_end` INTEGER DEFAULT NULL,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `address` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `street_1` TEXT NOT NULL,
  `street_2` TEXT DEFAULT NULL,
  `city` TEXT NOT NULL,
  `state` TEXT NOT NULL,
  `zip_code` INTEGER NOT NULL,
  `country` TEXT NOT NULL
);

CREATE TABLE `event` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `address_id` TEXT DEFAULT NULL REFERENCES `address`(`id`),
  `event_name` TEXT NOT NULL,
  `event_theme` TEXT DEFAULT NULL,
  `email` TEXT DEFAULT NULL,
  `phone` TEXT DEFAULT NULL,
  `status` TEXT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `image` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `event_id` TEXT NOT NULL REFERENCES `event`(`id`),
  `image_data` BLOB NOT NULL,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `guest` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `event_id` TEXT NOT NULL REFERENCES `event`(`id`),
  `user_id` TEXT DEFAULT NULL REFERENCES `user`(`id`),
  `address_id` TEXT DEFAULT NULL REFERENCES `address`(`id`),
  `accompanying_guest` TEXT DEFAULT NULL,
  `first_name` TEXT NOT NULL,
  `last_name` TEXT NOT NULL,
  `email` TEXT DEFAULT NULL,
  `phone` TEXT DEFAULT NULL,
  `is_attending` INTEGER DEFAULT NULL,
  `can_contact` INTEGER NOT NULL,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `newsletter_user` (
  `id` TEXT PRIMARY KEY NOT NULL DEFAULT (uuid()),
  `user_id` TEXT DEFAULT NULL REFERENCES `user`(`id`),
  `first_name` TEXT NOT NULL,
  `last_name` TEXT NOT NULL,
  `email` TEXT NOT NULL,
  `phone` TEXT NOT NULL,
  `can_contact` INTEGER NOT NULL,
  `created_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `updated_at` INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `signin` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `logged_in_at` INTEGER NOT NULL DEFAULT (unixepoch()),
  `ip_address` TEXT NOT NULL,
  `email` TEXT NOT NULL
);

CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `email_verification_token` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL REFERENCES `user`(`id`),
  `email` TEXT NOT NULL,
  `expires_at` INTEGER NOT NULL
);
