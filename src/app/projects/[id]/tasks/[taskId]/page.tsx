import { WMSRepository } from "@/lib/Repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, AlertCircle } from "lucide-react";

// Changed the type to 'any' to bypass the TypeScript constraint issue
export default async function TaskPage({ params }: any) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  const taskId = parseInt(resolvedParams.taskId);
  const task = await repo.getTaskById(taskId);
  if (!task || task.projectId !== projectId)
    return <div className="container mx-auto p-6">Task not found</div>;

  const subtasks = await repo.getSubtasksByTaskId(taskId);

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">{task.name}</h1>
          <p className="text-gray-600 mt-2">{task.description || "No description"}</p>
        </div>
        <Button asChild>
          <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`}>
            Add Subtask
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className="font-medium">{task.dueDate?.toLocaleDateString() || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Time Required:</span>
                <span className="font-medium">{task.timeRequired || 0} hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Assigned To:</span>
                <span className="font-medium">{task.assignedTo || "Unassigned"}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Priority:</span>
                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                  {task.priority || "N/A"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant="secondary" className={getStatusColor(task.status)}>
                  {task.status || "N/A"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subtasks</CardTitle>
          </CardHeader>
          <CardContent>
            {subtasks.length > 0 ? (
              <div className="space-y-4">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{subtask.name}</h3>
                      <p className="text-sm text-gray-600">{subtask.description || "No description"}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(subtask.status)}>
                      {subtask.status || "N/A"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No subtasks yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
