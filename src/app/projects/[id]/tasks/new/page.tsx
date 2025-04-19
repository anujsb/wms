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

export default async function NewTaskPage({ params }: any) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  const project = await repo.getProjectById(projectId);
  if (!project)
    return <div className="container mx-auto p-6">Project not found</div>;

  const users = await repo.getUsers();

  async function createTask(formData: FormData) {
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

    const task = await repo.createTask(projectId, {
      name,
      description,
      dueDate,
      timeRequired,
      priority,
      assignedTo,
      status,
      projectId,
    });
    redirect(`/projects/${projectId}/tasks/${task.id}`);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      <form action={createTask} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium">Name</Label>
          <Input
            type="text"
            name="name"
            required
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium">Description</Label>
          <Textarea
            name="description"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium">Due Date</Label>
          <Input
            type="date"
            name="dueDate"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium">
            Time Required (hours)
          </Label>
          <Input
            type="number"
            name="timeRequired"
            min="0"
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium">Priority</Label>
          <Select name="priority">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Priority" />
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
        <div>
          <Label className="block text-sm font-medium">Assigned To</Label>
          <Select name="assignedTo">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Assign To</SelectLabel>
                {/* <SelectItem value="">Unassigned</SelectItem> */}
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium">Status</Label>
          <Select name="status">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
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
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </Button>
      </form>
    </div>
  );
}
