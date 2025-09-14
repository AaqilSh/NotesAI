import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
	  id: serial("id").primaryKey(),
	  title: text("title").notNull(),
	  content: text("content").notNull(),
	  email: text("email").notNull(),
	  createdAt: timestamp("created_at").defaultNow().notNull(),
	  age: integer("age"),
	active: integer("active").default(1).notNull(),
});

export const notesStaging = pgTable("notes_staging", {
  id: text("id"),
  title: text("title"),
  content: text("content"),
  email: text("email"),
  created_at: text("created_at"),
  age: text("age"),
  active: text("active"),
});