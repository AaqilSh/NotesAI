CREATE TABLE "my_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"age" integer,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "my_data_staging" (
	"id" text,
	"name" text,
	"email" text,
	"created_at" text,
	"age" text,
	"active" text
);
