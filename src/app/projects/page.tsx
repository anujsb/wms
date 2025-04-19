import { WMSRepository } from '@/lib/Repository';
import Link from 'next/link';

export default async function ProjectsPage() {
  const repo = new WMSRepository();
  const projects = await repo.getProjects();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/projects/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        New Project
      </Link>
    </div>
  );
}