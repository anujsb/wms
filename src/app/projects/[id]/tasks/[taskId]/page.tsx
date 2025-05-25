// src/app/projects/[id]/tasks/[taskId]/page.tsx
import { WMSRepository } from "@/lib/Repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CalendarDays, 
  Clock, 
  User, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  ClipboardList,
  PlusCircle,
  Edit,
  ArrowLeft
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PageLayout } from "@/components/layouts/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function TaskPage({ params }: { params: Promise<{ id: string; taskId: string }> }) {
  const repo = new WMSRepository();
  
  try {
    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);
    const taskId = parseInt(resolvedParams.taskId);

    const [task, project, subtasks] = await Promise.all([
      repo.getTaskById(taskId),
      repo.getProjectById(projectId),
      repo.getSubtasksByTaskId(taskId)
    ]);

    if (!task || task.projectId !== projectId) {
      return <div className="container mx-auto p-6">Task not found</div>;
    }

    // Calculate subtask metrics
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(subtask => 
      subtask.status?.toLowerCase() === 'completed'
    ).length;
    
    const subtaskProgress = totalSubtasks > 0 
      ? Math.round((completedSubtasks / totalSubtasks) * 100) 
      : 0;

    // Format date nicely
    const formatDate = (dateString: Date | null | undefined) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    };

    // Check if date is overdue
    const isOverdue = (dateString: Date | null | undefined) => {
      if (!dateString) return false;
      const now = new Date();
      return new Date(dateString) < now && task.status?.toLowerCase() !== 'completed';
    };

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

    // Define breadcrumbs for page navigation
    const breadcrumbs = [
      { title: "Projects", href: "/projects" },
      { title: project?.name || "Project", href: `/projects/${projectId}` },
      { title: task.name, href: `/projects/${projectId}/tasks/${taskId}` }
    ];

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Task Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{task.name}</h1>
                <Badge className={getStatusColor(task.status)}>
                  {task.status || "Not Started"}
                </Badge>
              </div>
              <p className="text-gray-600 max-w-3xl">{task.description || "No description provided"}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                    <CalendarDays className="h-4 w-4" />
                    Due: {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && (
                      <Badge variant="outline" className="ml-1 text-xs bg-red-50 text-red-800 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>
                )}
                {task.timeRequired !== null && task.timeRequired !== undefined && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time required: {task.timeRequired} hrs
                  </div>
                )}
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Assigned to: {task.assignedTo}
                  </div>
                )}
                {task.priority && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Priority: 
                    <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={`/projects/${projectId}`} className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Project
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/projects/${projectId}/tasks/${taskId}/edit`} className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Task
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Subtask
                </Link>
              </Button>
            </div>
          </div>

          {/* Task Details and Subtasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                  <CardDescription>Information about this task</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge className={`w-fit ${getStatusColor(task.status)}`}>
                        {task.status || "Not Started"}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Priority</span>
                      <Badge className={`w-fit ${getPriorityColor(task.priority)}`}>
                        {task.priority || "Not Set"}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Due Date</span>
                      <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}>
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Time Required</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{task.timeRequired || 0} hrs</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Assigned To</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-3 w-3" />
                        </span>
                        <span>{task.assignedTo || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {totalSubtasks > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Subtask Progress</CardTitle>
                    <CardDescription>Overall completion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Completion</span>
                          <span className="font-medium">{subtaskProgress}%</span>
                        </div>
                        <Progress value={subtaskProgress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Card>
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="rounded-lg p-2 bg-blue-50">
                              <ClipboardList className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Total</p>
                              <h3 className="text-xl font-bold">{totalSubtasks}</h3>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="rounded-lg p-2 bg-green-50">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Completed</p>
                              <h3 className="text-xl font-bold">{completedSubtasks}</h3>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Subtasks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Subtasks</CardTitle>
                    <CardDescription>List of subtasks for this task</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`} className="flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" />
                      New Subtask
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {subtasks.length > 0 ? (
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All ({subtasks.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({subtasks.filter(st => st.status?.toLowerCase() !== 'completed').length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({subtasks.filter(st => st.status?.toLowerCase() === 'completed').length})</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="space-y-4">
                        {subtasks.map((subtask) => (
                          <SubtaskCard 
                            key={subtask.id} 
                            subtask={subtask} 
                            getStatusColor={getStatusColor}
                            projectId={projectId}
                            taskId={taskId}
                          />
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="pending" className="space-y-4">
                        {subtasks
                          .filter(st => st.status?.toLowerCase() !== 'completed')
                          .map((subtask) => (
                            <SubtaskCard 
                              key={subtask.id} 
                              subtask={subtask} 
                              getStatusColor={getStatusColor}
                              projectId={projectId}
                              taskId={taskId}
                            />
                          ))}
                      </TabsContent>
                      
                      <TabsContent value="completed" className="space-y-4">
                        {subtasks
                          .filter(st => st.status?.toLowerCase() === 'completed')
                          .map((subtask) => (
                            <SubtaskCard 
                              key={subtask.id} 
                              subtask={subtask} 
                              getStatusColor={getStatusColor}
                              projectId={projectId}
                              taskId={taskId}
                            />
                          ))}
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-blue-50 p-4 mb-4">
                        <ClipboardList className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No subtasks yet</h3>
                      <p className="text-gray-500 text-center max-w-md mb-6">
                        Break down this task into smaller pieces by creating subtasks.
                      </p>
                      <Button asChild>
                        <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create First Subtask
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading task: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
}

interface SubtaskCardProps {
  subtask: any;
  getStatusColor: (status: string | null) => string;
  projectId: number;
  taskId: number;
}

function SubtaskCard({ subtask, getStatusColor, projectId, taskId }: SubtaskCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{subtask.name}</h3>
              <Badge className={getStatusColor(subtask.status)}>
                {subtask.status || "Not Started"}
              </Badge>
            </div>
            {subtask.description && (
              <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}