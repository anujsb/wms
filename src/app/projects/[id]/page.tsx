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

// Type assertion to bypass TypeScript check
export default async function ProjectPage({ params }: any) {
  const repo = new WMSRepository();
  const projectId = parseInt(params.id);
  const project = await repo.getProjectById(projectId);
  if (!project) return <div>Project not found</div>;

  const tasks = await repo.getTasksWithSubtasksByProjectId(projectId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-700 mb-6">{project.description || 'No description'}</p>
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 bg-white rounded shadow">
            <Link href={`/projects/${project.id}/tasks/${task.id}`} className="text-blue-600 hover:underline">
              {task.name}
            </Link>
            <p className="text-sm text-gray-500">
              Due: {task.dueDate?.toLocaleDateString() || 'N/A'} | Time Required: {task.timeRequired || 0} hrs | Priority:{' '}
              {task.priority || 'N/A'} | Status: {task.status || 'N/A'} | Assigned To: {task.assignedTo || 'Unassigned'}
            </p>
            <h3 className="text-lg font-medium mt-2">Subtasks</h3>
            <ul className="ml-4 space-y-2">
              {task.subtasks?.map((subtask) => (
                <li key={subtask.id} className="text-gray-700">
                  {subtask.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Link
        href={`/projects/${project.id}/tasks/new`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        New Task
      </Link>
    </div>
  );
}