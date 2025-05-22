export interface Task {
  id: number;
  name: string;
  description: string | null;
  dueDate: Date | null;
  timeRequired: number | null;
  priority: 'low' | 'medium' | 'high' | null;
  assignedTo: number | null;
  status: 'todo' | 'in_progress' | 'done' | null;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;