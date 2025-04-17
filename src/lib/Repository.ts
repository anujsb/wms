// import { db } from '@/lib/db';
// import { users } from '@/lib/schema';
// import { eq } from 'drizzle-orm';
// import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// type UserSelect = InferSelectModel<typeof users>;
// type UserInsert = InferInsertModel<typeof users>;

// async function getAllUsers(): Promise<UserSelect[]> {
//   return await db.select().from(users);
// }

// async function getUserById(id: number): Promise<UserSelect | null> {
//   const result = await db.select().from(users).where(eq(users.id, id));
//   return result.length > 0 ? result[0] : null;
// }

// async function createUser(userData: Partial<UserInsert>): Promise<UserSelect> {
//   const newUser = await db.insert(users).values({
//     name: userData.name as string,
//     email: userData.email as string,
//     ...userData,
//   }).returning();
//   return newUser[0];
// }

// async function updateUser(id: number, userData: Partial<UserInsert>): Promise<UserSelect | null> {
//   const updatedUser = await db
//     .update(users)
//     .set(userData)
//     .where(eq(users.id, id))
//     .returning();
//   return updatedUser.length > 0 ? updatedUser[0] : null;
// }

// async function deleteUser(id: number): Promise<boolean> {
//   const result = await db.delete(users).where(eq(users.id, id)).returning();
//   return result.length > 0;
// }

// const userRepository = {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// };

// export default userRepository;



import { db } from '@/lib/db';
import { users, projects, tasks, subtasks } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Infer types for each entity
type UserSelect = InferSelectModel<typeof users>;
type UserInsert = InferInsertModel<typeof users>;
type ProjectSelect = InferSelectModel<typeof projects>;
type ProjectInsert = InferInsertModel<typeof projects>;
type TaskSelect = InferSelectModel<typeof tasks>;
type TaskInsert = InferInsertModel<typeof tasks>;
type SubtaskSelect = InferSelectModel<typeof subtasks>;
type SubtaskInsert = InferInsertModel<typeof subtasks>;

export class Repository {
  // User methods
  async getAllUsers(): Promise<UserSelect[]> {
    return await db.select().from(users);
  }

  async getUserById(id: number): Promise<UserSelect | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async createUser(userData: Partial<UserInsert>): Promise<UserSelect> {
    const newUser = await db.insert(users).values(userData).returning();
    return newUser[0];
  }

  async updateUser(id: number, userData: Partial<UserInsert>): Promise<UserSelect | null> {
    const updatedUser = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser.length > 0 ? updatedUser[0] : null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Project methods
  async getAllProjects(): Promise<ProjectSelect[]> {
    return await db.select().from(projects);
  }

  async getProjectById(id: number): Promise<ProjectSelect | null> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async createProject(projectData: Partial<ProjectInsert>): Promise<ProjectSelect> {
    const newProject = await db.insert(projects).values(projectData).returning();
    return newProject[0];
  }

  async updateProject(id: number, projectData: Partial<ProjectInsert>): Promise<ProjectSelect | null> {
    const updatedProject = await db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject.length > 0 ? updatedProject[0] : null;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Task methods
  async getAllTasks(): Promise<TaskSelect[]> {
    return await db.select().from(tasks);
  }

  async getTaskById(id: number): Promise<TaskSelect | null> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async createTask(taskData: Partial<TaskInsert>): Promise<TaskSelect> {
    const newTask = await db.insert(tasks).values(taskData).returning();
    return newTask[0];
  }

  async updateTask(id: number, taskData: Partial<TaskInsert>): Promise<TaskSelect | null> {
    const updatedTask = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask.length > 0 ? updatedTask[0] : null;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  }

  // Subtask methods
  async getAllSubtasks(): Promise<SubtaskSelect[]> {
    return await db.select().from(subtasks);
  }

  async getSubtaskById(id: number): Promise<SubtaskSelect | null> {
    const result = await db.select().from(subtasks).where(eq(subtasks.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async createSubtask(subtaskData: Partial<SubtaskInsert>): Promise<SubtaskSelect> {
    const newSubtask = await db.insert(subtasks).values(subtaskData).returning();
    return newSubtask[0];
  }

  async updateSubtask(id: number, subtaskData: Partial<SubtaskInsert>): Promise<SubtaskSelect | null> {
    const updatedSubtask = await db
      .update(subtasks)
      .set(subtaskData)
      .where(eq(subtasks.id, id))
      .returning();
    return updatedSubtask.length > 0 ? updatedSubtask[0] : null;
  }

  async deleteSubtask(id: number): Promise<boolean> {
    const result = await db.delete(subtasks).where(eq(subtasks.id, id)).returning();
    return result.length > 0;
  }
}