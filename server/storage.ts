import { users, tasks, progressLogs, audioNotes, type User, type InsertUser, type Task, type InsertTask, type ProgressLog, type InsertProgressLog, type AudioNote, type InsertAudioNote } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  createTask(task: InsertTask, userId: number): Promise<Task>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  searchTasks(userId: number, query: string): Promise<Task[]>;
  getTasksByStatus(userId: number, status: string): Promise<Task[]>;
  getAllTasks(): Promise<Task[]>;
  
  createProgressLog(progressLog: InsertProgressLog, userId: number): Promise<ProgressLog>;
  getProgressLogsByTaskId(taskId: number): Promise<ProgressLog[]>;
  getProgressLogsByUserId(userId: number): Promise<ProgressLog[]>;
  
  createAudioNote(audioNote: InsertAudioNote): Promise<AudioNote>;
  getAudioNotesByProgressLogId(progressLogId: number): Promise<AudioNote[]>;
  
  getTaskStats(userId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalHours: number;
  }>;
  
  getAdminStats(): Promise<{
    totalUsers: number;
    totalTasks: number;
    totalHours: number;
    activeToday: number;
  }>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createTask(task: InsertTask, userId: number): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({ ...task, userId })
      .returning();
    return newTask;
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchTasks(userId: number, query: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          or(
            like(tasks.title, `%${query}%`),
            like(tasks.description, `%${query}%`),
            sql`${tasks.tags}::text ILIKE ${`%${query}%`}`
          )
        )
      )
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByStatus(userId: number, status: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.status, status)))
      .orderBy(desc(tasks.createdAt));
  }

  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createProgressLog(progressLog: InsertProgressLog, userId: number): Promise<ProgressLog> {
    const [log] = await db
      .insert(progressLogs)
      .values({ ...progressLog, userId })
      .returning();
    return log;
  }

  async getProgressLogsByTaskId(taskId: number): Promise<ProgressLog[]> {
    return await db
      .select()
      .from(progressLogs)
      .where(eq(progressLogs.taskId, taskId))
      .orderBy(desc(progressLogs.loggedAt));
  }

  async getProgressLogsByUserId(userId: number): Promise<ProgressLog[]> {
    return await db
      .select()
      .from(progressLogs)
      .where(eq(progressLogs.userId, userId))
      .orderBy(desc(progressLogs.loggedAt));
  }

  async createAudioNote(audioNote: InsertAudioNote): Promise<AudioNote> {
    const [note] = await db
      .insert(audioNotes)
      .values(audioNote)
      .returning();
    return note;
  }

  async getAudioNotesByProgressLogId(progressLogId: number): Promise<AudioNote[]> {
    return await db
      .select()
      .from(audioNotes)
      .where(eq(audioNotes.progressLogId, progressLogId))
      .orderBy(desc(audioNotes.createdAt));
  }

  async getTaskStats(userId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalHours: number;
  }> {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const userProgressLogs = await db
      .select()
      .from(progressLogs)
      .where(eq(progressLogs.userId, userId));

    const totalHours = userProgressLogs.reduce((sum: number, log: any) => sum + log.timeSpent, 0) / 60;

    const now = new Date();
    const stats = {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === 'completed').length,
      inProgressTasks: userTasks.filter(t => t.status === 'in_progress').length,
      overdueTasks: userTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'completed').length,
      totalHours: Math.round(totalHours),
    };

    return stats;
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalTasks: number;
    totalHours: number;
    activeToday: number;
  }> {
    const allUsers = await db.select().from(users);
    const allTasks = await db.select().from(tasks);
    const allLogs = await db.select().from(progressLogs);

    const totalHours = allLogs.reduce((sum, log) => sum + log.timeSpent, 0) / 60;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await db
      .select()
      .from(progressLogs)
      .where(sql`${progressLogs.loggedAt} >= ${today}`);

    return {
      totalUsers: allUsers.length,
      totalTasks: allTasks.length,
      totalHours: Math.round(totalHours),
      activeToday: new Set(activeToday.map(log => log.userId)).size,
    };
  }
}

export const storage = new DatabaseStorage();
