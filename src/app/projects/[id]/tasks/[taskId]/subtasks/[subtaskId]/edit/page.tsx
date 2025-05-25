import { PageLayout } from "@/components/layouts/page-layout";
import { WMSRepository } from "@/lib/Repository";
import { SubtaskForm } from "@/components/subtask-form";
import { notFound } from "next/navigation";

interface PageParams {
  params: Promise<{
    id: string;
    taskId: string;
    subtaskId: string;
  }>
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
            subtask={subtask}
            users={users}
            projectId={projectId}
            taskId={taskId}
          />
        </div>
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading subtask:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load subtask. Please try again later.</p>
        </div>
      </div>
    );
  }
}