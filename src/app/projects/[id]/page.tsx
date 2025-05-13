import { WMSRepository } from '@/lib/Repository';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Clock, 
  User, 
  AlertCircle, 
  Plus, 
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  BarChart3,
  FileText,
  ListTodo,
  PlusCircle,
  Filter,
  Search
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageLayout } from "@/components/layouts/page-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function ProjectPage({ params }: any) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  const project = await repo.getProjectById(projectId);
  if (!project) return <div>Project not found</div>;

  const tasks = await repo.getTasksWithSubtasksByProjectId(projectId);

  // Calculate project metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status?.toLowerCase() === 'in progress').length;
  const pendingTasks = tasks.filter(task => task.status?.toLowerCase() === 'pending').length;
 
  const totalSubtasks = tasks.reduce((acc, task) => acc + (task.subtasks?.length || 0), 0);
  const highPriorityTasks = tasks.filter(task => task.priority?.toLowerCase() === 'high').length;
  
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate time metrics
  const totalTimeRequired = tasks.reduce((acc, task) => acc + (task.timeRequired || 0), 0);
  const completedTime = tasks
    .filter(task => task.status?.toLowerCase() === 'completed')
    .reduce((acc, task) => acc + (task.timeRequired || 0), 0);

  // Determine overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < now && 
    task.status?.toLowerCase() !== 'completed'
  ).length;

  // Group by assigned user
  const assignedUsers = tasks.reduce((acc, task) => {
    const assignee = task.assignedTo || 'Unassigned';
    if (!acc[assignee]) acc[assignee] = 0;
    acc[assignee]++;
    return acc;
  }, {} as Record<string, number>);

  const breadcrumbs = [
    { title: "Projects", href: "/projects" },
    { title: project.name, href: `/projects/${project.id}` }
  ];

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
  
  // Format date nicely
  const formatDate = (dateString: Date | null | undefined) => {
    if (!dateString) return 'N/A';
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
    return new Date(dateString) < now;
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Project Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Badge className={`${getStatusColor(progress === 100 ? 'completed' : 'in progress')}`}>
                {progress === 100 ? 'Completed' : `${progress}% Complete`}
              </Badge>
            </div>
            <p className="text-gray-600">{project.description || 'No description provided'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Created: {formatDate(project.createdAt)}
              </div>
              {project.updatedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last updated: {formatDate(project.updatedAt)}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
            </Button>
            <Button asChild>
              <Link href={`/projects/${project.id}/tasks/new`} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Project Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Overall completion and project metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Overall Completion</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="rounded-lg p-2 bg-blue-50">
                      <ListTodo className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{totalTasks}</h3>
                        {totalSubtasks > 0 && (
                          <span className="text-xs text-gray-500">+ {totalSubtasks} subtasks</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="rounded-lg p-2 bg-green-50">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{completedTasks}</h3>
                        <span className="text-xs text-gray-500">
                          {totalTasks > 0 ? `(${Math.round((completedTasks / totalTasks) * 100)}%)` : '(0%)'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="rounded-lg p-2 bg-red-50">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">High Priority</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{highPriorityTasks}</h3>
                        <span className="text-xs text-gray-500">
                          {overdueTasks > 0 && `${overdueTasks} overdue`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="rounded-lg p-2 bg-purple-50">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time Required</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{completedTime}/{totalTimeRequired}h</h3>
                        <span className="text-xs text-gray-500">
                          {totalTimeRequired > 0 ? `(${Math.round((completedTime / totalTimeRequired) * 100)}%)` : '(0%)'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Task List */}
        <Tabs defaultValue="list" className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="board">Board View</TabsTrigger>
              <TabsTrigger value="calendar">Timeline</TabsTrigger>
            </TabsList>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input placeholder="Search tasks..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="list">
            {tasks.length === 0 ? (
              <EmptyTasksState projectId={projectId} />
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Task Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="hidden md:table-cell">Time</TableHead>
                      <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                      <TableHead className="hidden md:table-cell">Subtasks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <Link 
                            href={`/projects/${project.id}/tasks/${task.id}`}
                            className="hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            {task.name}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <Badge variant="outline" className="text-xs font-normal">
                                {task.subtasks.length}
                              </Badge>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status || 'Not Started'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority || 'None'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) && task.status?.toLowerCase() !== 'completed' ? 'text-red-600' : ''}`}>
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(task.dueDate)}</span>
                            {isOverdue(task.dueDate) && task.status?.toLowerCase() !== 'completed' && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-800 border-red-200">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{task.timeRequired || 0} hrs</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2 max-w-[150px] truncate">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                              <User className="h-3 w-3" />
                            </span>
                            <span className="truncate">{task.assignedTo || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {task.subtasks && task.subtasks.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={task.subtasks.filter(st => st.status?.toLowerCase() === 'completed').length / task.subtasks.length * 100} 
                                className="h-2 w-16"
                              />
                              <span className="text-sm">
                                {task.subtasks.filter(st => st.status?.toLowerCase() === 'completed').length}/{task.subtasks.length}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Column */}
              <TaskColumn 
                title="Pending" 
                count={pendingTasks}
                tasks={tasks.filter(task => !task.status || task.status.toLowerCase() === 'pending')}
                projectId={projectId}
                color="bg-yellow-50 text-yellow-800"
                icon={<ClipboardList className="h-4 w-4" />}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
              
              {/* In Progress Column */}
              <TaskColumn 
                title="In Progress" 
                count={inProgressTasks}
                tasks={tasks.filter(task => task.status?.toLowerCase() === 'in progress')}
                projectId={projectId}
                color="bg-blue-50 text-blue-800"
                icon={<BarChart3 className="h-4 w-4" />}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
              
              {/* Completed Column */}
              <TaskColumn 
                title="Completed" 
                count={completedTasks}
                tasks={tasks.filter(task => task.status?.toLowerCase() === 'completed')}
                projectId={projectId} 
                color="bg-green-50 text-green-800"
                icon={<CheckCircle2 className="h-4 w-4" />}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Timeline View</CardTitle>
                <CardDescription>Coming soon - visualize tasks on a timeline</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Timeline view is under development</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: any[];
  projectId: number;
  color: string;
  icon: React.ReactNode;
  formatDate: (date: Date | null | undefined) => string;
  isOverdue: (date: Date | null | undefined) => boolean;
}

function TaskColumn({ title, count, tasks, projectId, color, icon, formatDate, isOverdue }: TaskColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`rounded-md p-1 ${color}`}>
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
          <Badge variant="outline" className="ml-1">{count}</Badge>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px] space-y-3">
        {tasks.length === 0 ? (
          <div className="border border-dashed rounded-md h-24 flex items-center justify-center text-gray-400 text-sm">
            No tasks in this status
          </div>
        ) : (
          tasks.map(task => (
            <Link key={task.id} href={`/projects/${projectId}/tasks/${task.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium line-clamp-2">{task.name}</h4>
                    {task.priority && (
                      <Badge variant="outline" className={`text-xs ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    {task.dueDate && (
                      <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) && title !== 'Completed' ? 'text-red-600' : 'text-gray-500'}`}>
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDate(task.dueDate)}</span>
                        {isOverdue(task.dueDate) && title !== 'Completed' && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-800 border-red-200">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {task.assignedTo && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{task.assignedTo}</span>
                      </div>
                    )}
                    
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Subtasks</span>
                            <span>{task.subtasks.filter((st: { status: string }) => st.status?.toLowerCase() === 'completed').length}/{task.subtasks.length}</span>
                          </div>
                          <Progress 
                            value={task.subtasks.filter((st: { status: string }) => st.status?.toLowerCase() === 'completed').length / task.subtasks.length * 100} 
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      
      <Button variant="ghost" className="w-full mt-3 text-blue-600" asChild>
        <Link href={`/projects/${projectId}/tasks/new`} className="flex items-center justify-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add task</span>
        </Link>
      </Button>
    </div>
  );
}

function getPriorityBadgeColor(priority: string | null) {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-red-50 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-50 text-yellow-800 border-yellow-200'; 
    case 'low': return 'bg-green-50 text-green-800 border-green-200';
    default: return 'bg-gray-50 text-gray-800 border-gray-200';
  }
}

function EmptyTasksState({ projectId }: { projectId: number }) {
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-blue-50 p-4 mb-4">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Start by creating your first task to begin tracking work in this project.
        </p>
        <Button asChild>
          <Link href={`/projects/${projectId}/tasks/new`} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create First Task
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}