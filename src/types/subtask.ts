export interface Subtask {
  id: number;
  taskId: number;
  name: string;
  description: string | null;
  dueDate: Date | null;
  timeRequired: number | null;
  priority: 'low' | 'medium' | 'high' | null;
  assignedTo: number | null;
  status: 'todo' | 'in_progress' | 'done' | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SubtaskFormData = Omit<Subtask, 'id' | 'createdAt' | 'updatedAt'>;