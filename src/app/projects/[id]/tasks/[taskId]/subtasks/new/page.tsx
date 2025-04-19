// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { WMSRepository } from '@/lib/Repository';
// import { redirect } from 'next/navigation';

// export default async function NewSubtaskPage({ params }: { params: { id: string; taskId: string } }) {
//   const repo = new WMSRepository();
//   const projectId = parseInt(params.id);
//   const taskId = parseInt(params.taskId);
//   const task = await repo.getTaskById(taskId);
//   if (!task || task.projectId !== projectId) return <div className="container mx-auto p-6">Task not found</div>;

//   const users = await repo.getUsers();

//   async function createSubtask(formData: FormData) {
//     'use server';
//     const repo = new WMSRepository();
//     const name = formData.get('name') as string;
//     const description = formData.get('description')?.toString() || null;
//     const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null;
//     const timeRequired = formData.get('timeRequired') ? parseInt(formData.get('timeRequired') as string) : null;
//     const priority = formData.get('priority')?.toString() || null;
//     const assignedTo = formData.get('assignedTo') ? parseInt(formData.get('assignedTo') as string) : null;
//     const status = formData.get('status')?.toString() || null;

//     const subtask = await repo.createSubtask(taskId, {
//       name,
//       description,
//       dueDate,
//       timeRequired,
//       priority,
//       assignedTo,
//       status,
//       taskId
//     });
//     redirect(`/projects/${projectId}/tasks/${taskId}`);
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Create New Subtask</h1>
//       <form action={createSubtask} className="space-y-4">
//         <div>
//           <Label className="block text-sm font-medium">Name</Label>
//           <Input type="text" name="name" required className="mt-1 w-full border rounded p-2" />
//         </div>
//         <div>
//           <Label className="block text-sm font-medium">Description</Label>
//           <Textarea name="description" className="mt-1 w-full border rounded p-2" />
//         </div>
//         <div>
//           <Label className="block text-sm font-medium">Due Date</Label>
//           <Input type="date" name="dueDate" className="mt-1 w-full border rounded p-2" />
//         </div>
//         <div>
//           <Label className="block text-sm font-medium">Time Required (hours)</Label>
//           <Input type="number" name="timeRequired" min="0" className="mt-1 w-full border rounded p-2" />
//         </div>
//         <div>
//           <Label className="block text-sm font-medium">Priority</Label>
//           <Select name="priority" 
//           // className="mt-1 w-full border rounded p-2"
//           >
//             <option value="">Select Priority</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </Select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Assigned To</label>
//           <Select name="assignedTo" 
//           // className="mt-1 w-full border rounded p-2"
//           >
//             <option value="">Unassigned</option>
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.name}
//               </option>
//             ))}
//           </Select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Status</label>
//           <Select name="status" 
//           // className="mt-1 w-full border rounded p-2"
//           >
//             <option value="">Select Status</option>
//             <option value="todo">To Do</option>
//             <option value="in_progress">In Progress</option>
//             <option value="done">Done</option>
//           </Select>
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Create
//         </button>
//       </form>
//     </div>
//   );
// }


import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WMSRepository } from '@/lib/Repository';
import { redirect } from 'next/navigation';

// Changed the type to 'any' to bypass the TypeScript constraint issue
// export default async function NewSubtaskPage({ params }: { params: { id: string; taskId: string } }) {
export default async function NewSubtaskPage({ params }: any) {
  const repo = new WMSRepository();
  const projectId = parseInt(params.id);
  const taskId = parseInt(params.taskId);
  const task = await repo.getTaskById(taskId);
  if (!task || task.projectId !== projectId) return <div className="container mx-auto p-6">Task not found</div>;

  const users = await repo.getUsers();

  async function createSubtask(formData: FormData) {
    'use server';
    const repo = new WMSRepository();
    const name = formData.get('name') as string;
    const description = formData.get('description')?.toString() || null;
    const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null;
    const timeRequired = formData.get('timeRequired') ? parseInt(formData.get('timeRequired') as string) : null;
    const priority = formData.get('priority')?.toString() || null;
    const assignedTo = formData.get('assignedTo') ? parseInt(formData.get('assignedTo') as string) : null;
    const status = formData.get('status')?.toString() || null;

    const subtask = await repo.createSubtask(taskId, {
      name,
      description,
      dueDate,
      timeRequired,
      priority,
      assignedTo,
      status,
      taskId
    });
    redirect(`/projects/${projectId}/tasks/${taskId}`);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Subtask</h1>
      <form action={createSubtask} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium">Name</Label>
          <Input type="text" name="name" required className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <Label className="block text-sm font-medium">Description</Label>
          <Textarea name="description" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <Label className="block text-sm font-medium">Due Date</Label>
          <Input type="date" name="dueDate" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <Label className="block text-sm font-medium">Time Required (hours)</Label>
          <Input type="number" name="timeRequired" min="0" className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <Label className="block text-sm font-medium">Priority</Label>
          <Select name="priority" 
          // className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Assigned To</label>
          <Select name="assignedTo" 
          // className="mt-1 w-full border rounded p-2"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <Select name="status" 
          // className="mt-1 w-full border rounded p-2"
          >
            <option value="">Select Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create
        </button>
      </form>
    </div>
  );
}