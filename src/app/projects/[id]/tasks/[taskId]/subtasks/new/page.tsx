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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Link from "next/link";
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  User, 
  AlertCircle, 
  ListChecks,
  ClipboardList
} from "lucide-react";
import { PageLayout } from "@/components/layouts/page-layout";

export default async function NewSubtaskPage({ params }: any) {
  const repo = new WMSRepository();
  const projectId = parseInt(params.id);
  const taskId = parseInt(params.taskId);
  
  const [task, project, users] = await Promise.all([
    repo.getTaskById(taskId),
    repo.getProjectById(projectId),
    repo.getUsers()
  ]);
  
  if (!task || task.projectId !== projectId)
    return <div className="container mx-auto p-6">Task not found</div>;

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

  // Define breadcrumbs for page navigation
  const breadcrumbs = [
    { title: "Projects", href: "/projects" },
    { title: project?.name || "Project", href: `/projects/${projectId}` },
    { title: task.name, href: `/projects/${projectId}/tasks/${taskId}` },
    { title: "New Subtask", href: `/projects/${projectId}/tasks/${taskId}/subtasks/new` }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Context Information */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClipboardList className="h-4 w-4" />
              <span>Creating subtask for:</span>
              <span className="font-medium text-gray-700">{task.name}</span>
            </div>
          </div>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-50">
                  <ListChecks className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Create New Subtask</CardTitle>
                  <CardDescription>Add a new subtask to break down your work</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={createSubtask} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Subtask Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter a clear, specific name for this subtask"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what needs to be done in this subtask"
                      className="min-h-[120px] resize-y"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Details</span>
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
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">When should this subtask be completed?</p>
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
                      placeholder="Estimated hours"
                    />
                    <p className="text-xs text-gray-500">How much time will this subtask take?</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span>Priority</span>
                    </Label>
                    <Select name="priority">
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Set the importance level of this subtask</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-gray-500" />
                      <span>Status</span>
                    </Label>
                    <Select name="status">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Current progress status</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="assignedTo" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Assigned To</span>
                    </Label>
                    <Select name="assignedTo">
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Who is responsible for completing this subtask?</p>
                  </div>
                </div>

                <CardFooter className="flex justify-end gap-4 px-0 pt-4 border-t">
                  <Button variant="outline" type="button" asChild>
                    <Link href={`/projects/${projectId}/tasks/${taskId}`} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit">Create Subtask</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}