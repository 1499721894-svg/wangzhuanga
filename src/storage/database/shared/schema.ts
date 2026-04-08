import { pgTable, serial, varchar, text, date, timestamp, integer, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  username: varchar({ length: 50 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const gameRecords = pgTable("game_records", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  scenario: varchar({ length: 255 }).notNull(),
  finalScore: integer("final_score").notNull(),
  result: varchar({ length: 20 }).notNull(), // '通关' or '失败'
  playedAt: timestamp("played_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial().primaryKey().notNull(),
  title: varchar({ length: 255 }).notNull(),
  summary: text(),
  content: text(),
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
  readTime: varchar("read_time", { length: 20 }),
});

export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
