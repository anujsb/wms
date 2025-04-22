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
import { WMSRepository } from '@/lib/Repository';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Rocket, 
  Code, 
  Star, 
  FileText, 
  Layout,
  Zap,
  Settings,
  Package,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Function to get an icon based on project name
function getProjectIcon(projectName: string) {
  // Use the first letter to select an icon
  const firstLetter = projectName.charAt(0).toLowerCase();
  
  // Map letters to icons
  const iconMap: Record<string, typeof Star> = {
    a: Rocket,
    b: Package,
    c: Code,
    d: FileText,
    e: Zap,
    f: FileText,
    g: Layout,
    h: Star,
    i: Code,
    j: Settings,
    k: Rocket,
    l: Package,
    m: FileText,
    n: Layout,
    o: Star,
    p: Code,
    q: Zap,
    r: Settings,
    s: Rocket,
    t: Package,
    u: FileText,
    v: Layout,
    w: Star,
    x: Code,
    y: Zap,
    z: Settings
  };
  
  return iconMap[firstLetter] || Star;
}

// Function to generate a color based on project name
function getProjectColor(projectName: string): string {
  let hash = 0;
  for (let i = 0; i < projectName.length; i++) {
    hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
}

// Format date for display
function formatDate(dateString: string | Date | null): string {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage and access all your projects</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-6">
                <FolderIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No projects yet</h3>
              <p className="text-muted-foreground max-w-md">
                Create your first project to get started with tracking and managing your work.
              </p>
              <Button asChild className="mt-4">
                <Link href="/projects/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create a project
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const ProjectIcon = getProjectIcon(project.name);
            const iconColor = getProjectColor(project.name);
            const taskCount = taskCountMap.get(project.id) || 0;
            
            return (
              <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-full p-2" style={{ backgroundColor: `${iconColor}20` }}>
                      <ProjectIcon size={24} style={{ color: iconColor }} />
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Updated {formatDate(project.updatedAt)}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </Badge>
                      {/* <Badge variant="outline" className="text-xs">
                        Created {formatDate(project.createdAt)}
                      </Badge> */}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
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