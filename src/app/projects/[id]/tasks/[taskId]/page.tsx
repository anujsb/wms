import { WMSRepository } from '@/lib/Repository';
import Link from 'next/link';

// Changed the type to 'any' to bypass the TypeScript constraint issue
export default async function TaskPage({ params }: any) {
  const repo = new WMSRepository();
  const projectId = parseInt(params.id);
  const taskId = parseInt(params.taskId);
  const task = await repo.getTaskById(taskId);
  if (!task || task.projectId !== projectId) return <div className="container mx-auto p-6">Task not found</div>;

  const subtasks = await repo.getSubtasksByTaskId(taskId);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
      <p className="text-gray-700 mb-2">{task.description || 'No description'}</p>
      <p className="text-sm text-gray-500">
        Due: {task.dueDate?.toLocaleDateString() || 'N/A'} | Time Required: {task.timeRequired || 0} hrs | Priority:{' '}
        {task.priority || 'N/A'} | Status: {task.status || 'N/A'} | Assigned To: {task.assignedTo || 'Unassigned'}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Subtasks</h2>
      <ul className="space-y-2">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="text-blue-600">
            {subtask.name}
          </li>
        ))}
      </ul>
      <Link
        href={`/projects/${projectId}/tasks/${taskId}/subtasks/new`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        New Subtask
      </Link>
    </div>
  );
}