import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export const linktreeLinksTable = pgTable("linktree_links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  url: text("url").notNull(),
  icon: text("icon"),
  iconType: text("icon_type").default("emoji"),
  color: text("color").default("#00ffff"),
  badge: text("badge"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const soundsTable = pgTable("sounds", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  url: text("url").notNull(),
  cover: text("cover"),
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  type: text("type").default("general"),
  rating: integer("rating"),
  name: text("name"),
  email: text("email"),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communityLinksTable = pgTable("community_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").default("🌐"),
  description: text("description"),
  url: text("url").notNull(),
  members: text("members").default(""),
  btnText: text("btn_text").default("Visit"),
  color: text("color").default("#00e5ff"),
  badge: text("badge"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
