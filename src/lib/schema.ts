// src/lib/schema.ts
import { pgTable, serial, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  name: text('name').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  timeRequired: integer('time_required'),
  priority: varchar('priority', { length: 10 }),
  assignedTo: integer('assigned_to').references(() => users.id),
  status: varchar('status', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subtasks = pgTable('subtasks', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').references(() => tasks.id),
  name: text('name').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  timeRequired: integer('time_required'),
  priority: varchar('priority', { length: 10 }),
  assignedTo: integer('assigned_to').references(() => users.id),
  status: varchar('status', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});