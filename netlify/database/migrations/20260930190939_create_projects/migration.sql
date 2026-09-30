CREATE TABLE "projects" (
	"id" text PRIMARY KEY,
	"edit_key" text NOT NULL,
	"brand_name" text NOT NULL,
	"slogan" text DEFAULT '' NOT NULL,
	"brief" jsonb NOT NULL,
	"concepts" jsonb NOT NULL,
	"design" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
