"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { CalendarDays, Clock, User, AlertCircle, ListChecks } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TaskFormProps {
  type: "edit" | "create";
  projectId: number;
  taskId?: number;
  users: any[];
  initialData?: any;
  projectName: string;
}

export function TaskForm({ type, projectId, taskId, users, initialData, projectName }: TaskFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description")?.toString() || null,
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
        timeRequired: formData.get("timeRequired") ? parseInt(formData.get("timeRequired") as string) : null,
        priority: formData.get("priority")?.toString() || null,
        assignedTo: formData.get("assignedTo") ? parseInt(formData.get("assignedTo") as string) : null,
        status: formData.get("status")?.toString() || null,
        projectId: projectId,
      };

      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error("Task name is required");
      }

      const response = await fetch(
        type === "edit" ? `/api/tasks/${taskId}` : '/api/tasks',
        {
          method: type === "edit" ? "PATCH" : "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      const result = await response.json();
      
      router.push(`/projects/${projectId}/tasks/${result.id || taskId}`);
      router.refresh();
      toast.success(type === "edit" ? "Task updated successfully" : "Task created successfully", {
        description: data.name,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to save task", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      router.push(`/projects/${projectId}`);
      router.refresh();
      toast.success("Task deleted successfully", {
        description: initialData?.name,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete task");
      toast.error("Failed to delete task", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{type === "edit" ? "Edit Task" : "Create Task"}</CardTitle>
          <CardDescription>
            {type === "edit" 
              ? `Editing task in ${projectName}`
              : `Create a new task in ${projectName}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">Task Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialData?.name}
                  placeholder="Enter a clear, specific name for this task"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description}
                  placeholder="Describe what needs to be done in this task"
                  className="min-h-[120px] resize-y"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>Due Date</span>
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeRequired" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Time Required (hours)</span>
                </Label>
                <Input
                  id="timeRequired"
                  name="timeRequired"
                  type="number"
                  min="0"
                  step="0.5"
                  defaultValue={initialData?.timeRequired}
                  placeholder="Estimated hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <span>Priority</span>
                </Label>
                <Select name="priority" defaultValue={initialData?.priority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-gray-500" />
                  <span>Status</span>
                </Label>
                <Select name="status" defaultValue={initialData?.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="assignedTo" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Assigned To</span>
                </Label>
                <Select name="assignedTo" defaultValue={initialData?.assignedTo?.toString()}>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Assign To</SelectLabel>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              {type === "edit" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                >
                  Delete Task
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {type === "edit" ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task and all its subtasks. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}