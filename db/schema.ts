import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text().primaryKey(),
  editKey: text("edit_key").notNull(),
  brandName: text("brand_name").notNull(),
  slogan: text().notNull().default(""),
  brief: jsonb().notNull(),
  concepts: jsonb().notNull(),
  design: jsonb().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
