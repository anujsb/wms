import { PageLayout } from "@/components/layouts/page-layout";
import { WMSRepository } from "@/lib/Repository";
import { TaskForm } from "@/components/task-form";
import { notFound } from "next/navigation";

interface PageParams {
  params: Promise<{
    id: string;
    taskId: string;
  }>
}

export default async function EditTaskPage({ params }: PageParams) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  
  const projectId = parseInt(resolvedParams.id);
  const taskId = parseInt(resolvedParams.taskId);

  if (isNaN(projectId) || isNaN(taskId)) {
    return notFound();
  }

  try {
    const [task, project, users] = await Promise.all([
      repo.getTaskById(taskId),
      repo.getProjectById(projectId),
      repo.getUsers(),
    ]);

    if (!task || task.projectId !== projectId || !project) {
      return notFound();
    }

    const breadcrumbs = [
      { title: "Projects", href: "/projects" },
      { title: project.name, href: `/projects/${projectId}` },
      { title: task.name, href: `/projects/${projectId}/tasks/${taskId}` },
      { title: "Edit Task", href: `/projects/${projectId}/tasks/${taskId}/edit` },
    ];

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto p-6 max-w-4xl">
          <TaskForm 
            type="edit"
            projectId={projectId}
            taskId={taskId}
            users={users}
            initialData={task}
            projectName={project.name}
          />
        </div>
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading task:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load task. Please try again later.
        </div>
      </div>
    );
  }
}