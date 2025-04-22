// import { WMSRepository } from '@/lib/Repository';
// import Link from 'next/link';

// export default async function ProjectPage({ params }: { params: { id: string } }) {
//   const repo = new WMSRepository();
//   const projectId = parseInt(params.id);
//   const project = await repo.getProjectById(projectId);
//   if (!project) return <div className="container mx-auto p-6">Project not found</div>;

//   const tasks = await repo.getTasksByProjectId(projectId);

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
//       <p className="text-gray-700 mb-6">{project.description || 'No description'}</p>
//       <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
//       <ul className="space-y-2">
//         {tasks.map((task) => (
//           <li key={task.id}>
//             <Link href={`/projects/${project.id}/tasks/${task.id}`} className="text-blue-600 hover:underline">
//               {task.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <Link
//         href={`/projects/${project.id}/tasks/new`}
//         className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         New Task
//       </Link>
//     </div>
//   );
// }

import { WMSRepository } from '@/lib/Repository';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type assertion to bypass TypeScript check
export default async function ProjectPage({ params }: any) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  const project = await repo.getProjectById(projectId);
  if (!project) return <div>Project not found</div>;

  const tasks = await repo.getTasksWithSubtasksByProjectId(projectId);

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description || 'No description'}</p>
        </div>
        <Button asChild>
          <Link href={`/projects/${project.id}/tasks/new`}>
            Create New Task
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Time Required</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Subtasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <Link 
                    href={`/projects/${project.id}/tasks/${task.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {task.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(task.status)}>
                    {task.status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{task.dueDate?.toLocaleDateString() || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{task.timeRequired || 0} hrs</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {task.subtasks && task.subtasks.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{task.subtasks.length} subtasks</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No subtasks</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}