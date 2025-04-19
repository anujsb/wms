import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WMSRepository } from '@/lib/Repository';
import { redirect } from 'next/navigation';

export default function NewProjectPage() {
  async function createProject(formData: FormData) {
    'use server';
    const repo = new WMSRepository();
    const name = formData.get('name') as string;
    const description = formData.get('description')?.toString() || null;
    const project = await repo.createProject({ name, description });
    redirect(`/projects/${project.id}`);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <form action={createProject} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input
            type="text"
            name="name"
            required
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium">Description</Label>
          <Textarea name="description" className="mt-1 w-full border rounded p-2" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create
        </button>
      </form>
    </div>
  );
}