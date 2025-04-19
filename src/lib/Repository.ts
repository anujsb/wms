import { db } from './db';
import { projects, tasks, subtasks, users } from './schema';
import { eq } from 'drizzle-orm';
import { InferModel } from 'drizzle-orm';

// Define TypeScript types based on schema
type Project = InferModel<typeof projects>;
type Task = InferModel<typeof tasks>;
type Subtask = InferModel<typeof subtasks>;
type User = InferModel<typeof users>;

// Utility type to omit fields that are auto-generated or managed by the DB
type OmitAutoFields<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export class WMSRepository {
  // Project Methods
  async createProject(data: OmitAutoFields<Project> & { name: string }): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectById(id: number): Promise<Project | null> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || null;
  }

  // Task Methods
  async createTask(projectId: number, data: OmitAutoFields<Task> & { name: string }): Promise<Task> {
    const [task] = await db.insert(tasks).values({ ...data, projectId }).returning();
    return task;
  }

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getTaskById(id: number): Promise<Task | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  }

  // Subtask Methods
  async createSubtask(taskId: number, data: OmitAutoFields<Subtask> & { name: string }): Promise<Subtask> {
    const [subtask] = await db.insert(subtasks).values({ ...data, taskId }).returning();
    return subtask;
  }

  async getSubtasksByTaskId(taskId: number): Promise<Subtask[]> {
    return await db.select().from(subtasks).where(eq(subtasks.taskId, taskId));
  }

  // User Methods (for assignment purposes)
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getTasksWithSubtasksByProjectId(projectId: number): Promise<(Task & { subtasks: Subtask[] })[]> {
    return await db
      .select()
      .from(tasks)
      .leftJoin(subtasks, eq(tasks.id, subtasks.taskId))
      .where(eq(tasks.projectId, projectId))
      .then((rows) => {
        const tasksMap = new Map<number, Task & { subtasks: Subtask[] }>();
        rows.forEach((row) => {
          const task = row.tasks;
          const subtask = row.subtasks;
          if (!tasksMap.has(task.id)) {
            tasksMap.set(task.id, { ...task, subtasks: [] });
          }
          if (subtask) {
            tasksMap.get(task.id)!.subtasks.push(subtask);
          }
        });
        return Array.from(tasksMap.values());
      });
  }
}

