import { pgTable, text, serial, integer, boolean, timestamp, real, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags").array(),
  dueDate: timestamp("due_date"),
  targetHours: real("target_hours").default(0),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high'
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'overdue'
  completionPercentage: real("completion_percentage").default(0),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const progressLogs = pgTable("progress_logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  timeSpent: integer("time_spent").notNull(), // in minutes
  completionPercentage: real("completion_percentage").notNull(),
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

export const audioNotes = pgTable("audio_notes", {
  id: serial("id").primaryKey(),
  progressLogId: integer("progress_log_id").references(() => progressLogs.id).notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  progressLogs: many(progressLogs),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  progressLogs: many(progressLogs),
}));

export const progressLogsRelations = relations(progressLogs, ({ one, many }) => ({
  task: one(tasks, {
    fields: [progressLogs.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [progressLogs.userId],
    references: [users.id],
  }),
  audioNotes: many(audioNotes),
}));

export const audioNotesRelations = relations(audioNotes, ({ one }) => ({
  progressLog: one(progressLogs, {
    fields: [audioNotes.progressLogId],
    references: [progressLogs.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const insertProgressLogSchema = createInsertSchema(progressLogs).omit({
  id: true,
  loggedAt: true,
  userId: true,
});

export const insertAudioNoteSchema = createInsertSchema(audioNotes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type ProgressLog = typeof progressLogs.$inferSelect;
export type InsertProgressLog = z.infer<typeof insertProgressLogSchema>;
export type AudioNote = typeof audioNotes.$inferSelect;
export type InsertAudioNote = z.infer<typeof insertAudioNoteSchema>;
