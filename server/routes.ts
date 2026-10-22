import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTaskSchema, insertProgressLogSchema, insertAudioNoteSchema } from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Task routes
  app.post("/api/tasks", requireAuth, async (req, res, next) => {
    try {
      // Transform the data before validation
      const transformedData = {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        targetHours: req.body.targetHours ? parseFloat(req.body.targetHours) : 0,
        tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? [req.body.tags] : []),
      };
      
      const validatedData = insertTaskSchema.parse(transformedData);
      const task = await storage.createTask(validatedData, req.user!.id);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tasks", requireAuth, async (req, res, next) => {
    try {
      const { search, status } = req.query;
      let tasks;
      
      if (search) {
        tasks = await storage.searchTasks(req.user!.id, search as string);
      } else if (status) {
        tasks = await storage.getTasksByStatus(req.user!.id, status as string);
      } else {
        tasks = await storage.getTasksByUserId(req.user!.id);
      }
      
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tasks/:id", requireAuth, async (req, res, next) => {
    try {
      const task = await storage.getTaskById(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/tasks/:id", requireAuth, async (req, res, next) => {
    try {
      const task = await storage.getTaskById(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Transform the data before validation
      const transformedData = {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        targetHours: req.body.targetHours ? parseFloat(req.body.targetHours) : undefined,
        tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : undefined,
      };
      
      const validatedData = insertTaskSchema.partial().parse(transformedData);
      const updatedTask = await storage.updateTask(parseInt(req.params.id), validatedData);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res, next) => {
    try {
      const task = await storage.getTaskById(parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (task.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteTask(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Progress log routes
  app.post("/api/progress-logs", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertProgressLogSchema.parse(req.body);
      const progressLog = await storage.createProgressLog(validatedData, req.user!.id);
      
      // Update task completion percentage
      await storage.updateTask(validatedData.taskId, {
        completionPercentage: validatedData.completionPercentage,
        status: validatedData.completionPercentage >= 100 ? "completed" : "in_progress"
      });
      
      res.status(201).json(progressLog);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/progress-logs", requireAuth, async (req, res, next) => {
    try {
      const { taskId } = req.query;
      let logs;
      
      if (taskId) {
        logs = await storage.getProgressLogsByTaskId(parseInt(taskId as string));
      } else {
        logs = await storage.getProgressLogsByUserId(req.user!.id);
      }
      
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  // Audio note routes
  app.post("/api/audio-notes", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertAudioNoteSchema.parse(req.body);
      const audioNote = await storage.createAudioNote(validatedData);
      res.status(201).json(audioNote);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/audio-notes/:progressLogId", requireAuth, async (req, res, next) => {
    try {
      const audioNotes = await storage.getAudioNotesByProgressLogId(
        parseInt(req.params.progressLogId)
      );
      res.json(audioNotes);
    } catch (error) {
      next(error);
    }
  });

  // Stats routes
  app.get("/api/stats", requireAuth, async (req, res, next) => {
    try {
      const stats = await storage.getTaskStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res, next) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/tasks", requireAdmin, async (req, res, next) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res, next) => {
    try {
      await storage.deleteUser(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
