// import { WMSRepository } from '@/lib/Repository';
// import Link from 'next/link';

// export default async function ProjectsPage() {
//   const repo = new WMSRepository();
//   const projects = await repo.getProjects();

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Projects</h1>
//       <ul className="space-y-2">
//         {projects.map((project) => (
//           <li key={project.id}>
//             <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
//               {project.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <Link href="/projects/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//         New Project
//       </Link>
//     </div>
//   );
// }
import { WMSRepository } from "@/lib/Repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, AlertCircle } from "lucide-react";

export default async function ProjectsPage() {
  const repo = new WMSRepository();
  const projects = await repo.getProjects();
  
  // Get all tasks to count by project
  const allTasks = await Promise.all(
    projects.map(project => repo.getTasksByProjectId(project.id))
  );
  
  // Create a map of project ID to task count
  const taskCountMap = new Map<number, number>();
  projects.forEach((project, index) => {
    taskCountMap.set(project.id, allTasks[index].length);
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">Create New Project</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Project Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">
                    {project.description || "No description"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{taskCountMap.get(project.id) || 0} tasks</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{project.createdAt?.toLocaleDateString() || "N/A"}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Add FolderIcon component for the empty state
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}