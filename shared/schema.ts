import { pgTable, text, serial, integer, timestamp, date, varchar, json, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session table for connect-pg-simple
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
}, (table) => ({
  expireIdx: index("IDX_session_expire").on(table.expire),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  coachingCount: integer("coaching_count").default(0).notNull(),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'first_achievement', 'five_achievements', 'coaching_pro'
  awardedAt: timestamp("awarded_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  achievementDate: date("achievement_date").notNull(),
  coachingResponse: text("coaching_response"),
  xpEarned: integer("xp_earned").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertAchievementSchema = createInsertSchema(achievements).pick({ title: true, achievementDate: true });
export const insertBadgeSchema = createInsertSchema(badges);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
