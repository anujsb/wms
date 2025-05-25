"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
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

interface SubtaskFormProps {
  subtask: {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    dueDate: Date | null;
    timeRequired: number | null;
    priority: string | null;
    assignedTo: number | null;
    status: string | null;
    taskId: number | null;
  };
  users: {
    id: number;
    name: string;
    email: string;
  }[];
  projectId: number;
  taskId: number;
}

function formatDateForInput(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function SubtaskForm({ subtask, users, projectId, taskId }: SubtaskFormProps) {
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
        taskId: taskId,
      };

      const response = await fetch(
        `/api/subtasks/${subtask.id}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save subtask");
      }

      router.push(`/projects/${projectId}/tasks/${taskId}`);
      router.refresh();
      toast.success("Subtask updated");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to save subtask");
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subtasks/${subtask.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete subtask");
      }

      router.push(`/projects/${projectId}/tasks/${taskId}`);
      router.refresh();
      toast.success("Subtask deleted");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete subtask");
      toast.error("Failed to delete subtask");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Subtask</CardTitle>
          <CardDescription>
            Editing subtask in {subtask.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={subtask.name}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={subtask.description || ''} // Convert null to empty string
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    defaultValue={formatDateForInput(subtask.dueDate)}
                  />
                </div>

                <div>
                  <Label htmlFor="timeRequired">Time Required (hours)</Label>
                  <Input
                    type="number"
                    id="timeRequired"
                    name="timeRequired"
                    defaultValue={subtask.timeRequired?.toString() || ''} // Convert null to empty string
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue={subtask.priority || undefined}> // Convert null to undefined
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select name="assignedTo" defaultValue={subtask.assignedTo?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={subtask.status || undefined}> // Convert null to undefined
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                Delete Subtask
              </Button>

              <Button type="submit" disabled={isLoading}>
                Update Subtask
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
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete Subtask
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}