import { PageLayout } from "@/components/layouts/page-layout";
import { WMSRepository } from "@/lib/Repository";
import { SubtaskForm } from "@/components/subtask-form";
import { notFound } from "next/navigation";

interface PageParams {
  params: {
    id: string;
    taskId: string;
    subtaskId: string;
  }
}

export default async function EditSubtaskPage({ params }: PageParams) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  
  const projectId = parseInt(resolvedParams.id);
  const taskId = parseInt(resolvedParams.taskId);
  const subtaskId = parseInt(resolvedParams.subtaskId);

  if (isNaN(projectId) || isNaN(taskId) || isNaN(subtaskId)) {
    return notFound();
  }

  try {
    const [subtask, task, project, users] = await Promise.all([
      repo.getSubtaskById(subtaskId),
      repo.getTaskById(taskId),
      repo.getProjectById(projectId),
      repo.getUsers(),
    ]);

    if (!subtask || !task || subtask.taskId !== taskId || task.projectId !== projectId) {
      return notFound();
    }

    const breadcrumbs = [
      { title: "Projects", href: "/projects" },
      { title: project?.name || "Project", href: `/projects/${projectId}` },
      { title: task.name, href: `/projects/${projectId}/tasks/${taskId}` },
      { title: subtask.name, href: `/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}` },
      { title: "Edit Subtask", href: `/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/edit` },
    ];

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto p-6 max-w-4xl">
          <SubtaskForm 
            type="edit"
            projectId={projectId}
            taskId={taskId}
            subtaskId={subtaskId}
            users={users}
            initialData={subtask}
            taskName={task.name}
          />
        </div>
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading subtask:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load subtask. Please try again later.
        </div>
      </div>
    );
  }
}