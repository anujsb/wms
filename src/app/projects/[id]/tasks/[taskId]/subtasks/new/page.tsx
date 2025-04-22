import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WMSRepository } from "@/lib/Repository";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function NewSubtaskPage({ params }: any) {
  const repo = new WMSRepository();
  const projectId = parseInt(params.id);
  const taskId = parseInt(params.taskId);
  const task = await repo.getTaskById(taskId);
  if (!task || task.projectId !== projectId)
    return <div className="container mx-auto p-6">Task not found</div>;

  const users = await repo.getUsers();

  async function createSubtask(formData: FormData) {
    "use server";
    const repo = new WMSRepository();
    const name = formData.get("name") as string;
    const description = formData.get("description")?.toString() || null;
    const dueDate = formData.get("dueDate")
      ? new Date(formData.get("dueDate") as string)
      : null;
    const timeRequired = formData.get("timeRequired")
      ? parseInt(formData.get("timeRequired") as string)
      : null;
    const priority = formData.get("priority")?.toString() || null;
    const assignedTo = formData.get("assignedTo")
      ? parseInt(formData.get("assignedTo") as string)
      : null;
    const status = formData.get("status")?.toString() || null;

    const subtask = await repo.createSubtask(taskId, {
      name,
      description,
      dueDate,
      timeRequired,
      priority,
      assignedTo,
      status,
      taskId,
    });
    redirect(`/projects/${projectId}/tasks/${taskId}`);
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Subtask</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSubtask} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Subtask Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Enter subtask name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter subtask description"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeRequired">Time Required (hours)</Label>
                <Input
                  id="timeRequired"
                  name="timeRequired"
                  type="number"
                  min="0"
                  placeholder="Enter hours"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select name="assignedTo">
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select assignee" />
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

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href={`/projects/${projectId}/tasks/${taskId}`}>Cancel</Link>
              </Button>
              <Button type="submit">Create Subtask</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
