CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"age" integer,
	"is_active" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes_staging" (
	"id" text,
	"title" text,
	"content" text,
	"email" text,
	"created_at" text,
	"age" text,
	"active" text
);
--> statement-breakpoint
DROP TABLE "my_data" CASCADE;--> statement-breakpoint
DROP TABLE "my_data_staging" CASCADE;