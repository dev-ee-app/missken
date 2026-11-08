import { pgTable, text, timestamp, boolean, jsonb, uuid, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("teacher"), // 'teacher' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  sequenceTitle: varchar("sequence_title", { length: 255 }).notNull(),
  level: varchar("level", { length: 10 }).notNull(), // '1AM', '2AM', '3AM', '4AM'
  targetCompetence: text("target_competence"),
  sessionOutcome: text("session_outcome"),
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull().default({}),
  stages: jsonb("stages").$type<any[]>().notNull().default([]),
  contentTree: jsonb("content_tree").$type<Record<string, any>>().default({}),
  pageSettings: jsonb("page_settings").$type<Record<string, any>>().notNull().default({}),
  backgroundSettings: jsonb("background_settings").$type<Record<string, any>>().default({}),
  watermarkSettings: jsonb("watermark_settings").$type<Record<string, any>>().default({}),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }), // null if system template
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  level: varchar("level", { length: 10 }).notNull().default("All"),
  framework: varchar("framework", { length: 50 }).notNull().default("PPU"),
  structure: jsonb("structure").$type<Record<string, any>>().notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const backgrounds = pgTable("backgrounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("marble"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  fullUrl: text("full_url").notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const stickers = pgTable("stickers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("mascot"),
  imageUrl: text("image_url").notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url"),
  filePath: text("file_path"),
  contentText: text("content_text").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // 'export', 'ai_generation', 'system'
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 100 }).notNull(),
  targetId: varchar("target_id", { length: 255 }),
  details: jsonb("details").$type<Record<string, any>>().default({}),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
