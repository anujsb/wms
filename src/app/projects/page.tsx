// src/app/projects/page.tsx
import { WMSRepository } from "@/lib/Repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  User,
  AlertCircle,
  Plus,
  FolderOpen,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function ProjectsPage() {
  const repo = new WMSRepository();
  const projects = await repo.getProjects();

  // Get all tasks to count by project
  const allTasks = await Promise.all(
    projects.map(project => repo.getTasksByProjectId(project.id))
  );

  // Create a map of project ID to task count and status counts
  const projectMetrics = new Map();
  projects.forEach((project, index) => {
    const tasks = allTasks[index];
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
    const pendingTasks = tasks.filter(task => task.status === "pending").length;

    projectMetrics.set(project.id, {
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
    });
  });

  // Function to get status badge color
  const getStatusColor = (progress: number) => {
    if (progress >= 75) return "bg-green-100 text-green-800";
    if (progress >= 25) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };


  return (

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col space-y-6"> ̰
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-gray-500 mt-1">Manage and track all your project workflows</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <Link href="/projects/new">Create New Project</Link>
            </Button>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search projects..."
                className="pl-9 h-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Options Tabs */}
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{projects.length} projects found</p>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
            </div>

            {/* Grid View */}
            <TabsContent value="grid" className="pt-4">
              {projects.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => {
                    const metrics = projectMetrics.get(project.id);
                    return (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <Card className="h-full hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <Badge
                                className={`${getStatusColor(metrics.progress)} font-medium`}
                              >
                                {metrics.progress}% Complete
                              </Badge>
                              <div className="text-gray-500 flex items-center text-sm">
                                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                                {formatDate(project.createdAt ? project.createdAt.toString() : "")}
                              </div>
                            </div>
                            <CardTitle className="mt-2 text-xl">{project.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {project.description || "No description provided"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${metrics.progress}%` }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center text-gray-600">
                                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                  <span className="text-sm">Total</span>
                                </div>
                                <p className="font-medium">{metrics.totalTasks}</p>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-green-50 rounded-md">
                                <div className="flex items-center text-green-600">
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  <span className="text-sm">Done</span>
                                </div>
                                <p className="font-medium">{metrics.completedTasks}</p>
                              </div>
                              <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                                <div className="flex items-center text-yellow-600">
                                  <Clock3 className="h-3.5 w-3.5 mr-1" />
                                  <span className="text-sm">Pending</span>
                                </div>
                                <p className="font-medium">{metrics.pendingTasks}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table" className="pt-4">
              {projects.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Project Name</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="hidden md:table-cell">Tasks</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => {
                        const metrics = projectMetrics.get(project.id);
                        return (
                          <TableRow key={project.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <Link
                                href={`/projects/${project.id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {project.name}
                              </Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-xs">
                              <span className="text-gray-600 line-clamp-1">
                                {project.description || "No description"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${metrics.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{metrics.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {metrics.completedTasks} / {metrics.totalTasks}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-500">
                                {project.createdAt ? formatDate(project.createdAt.toString()) : 'N/A'}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}

function EmptyState() {
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-blue-50 p-4 mb-4">
          <FolderOpen className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Get started by creating your first project to organize and track your workflows.
        </p>
        <Button asChild>
          <Link href="/projects/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}