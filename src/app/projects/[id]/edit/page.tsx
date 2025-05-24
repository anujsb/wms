import { PageLayout } from "@/components/layouts/page-layout";
import { WMSRepository } from "@/lib/Repository";
import { ProjectForm } from "@/components/project-form";
import { notFound } from "next/navigation";

interface PageParams {
  params: {
    id: string;
  }
}

export default async function EditProjectPage({ params }: PageParams) {
  const repo = new WMSRepository();
  const resolvedParams = await params;
  
  const projectId = parseInt(resolvedParams.id);

  if (isNaN(projectId)) {
    return notFound();
  }

  try {
    const project = await repo.getProjectById(projectId);

    if (!project) {
      return notFound();
    }

    const breadcrumbs = [
      { title: "Projects", href: "/projects" },
      { title: project.name, href: `/projects/${projectId}` },
      { title: "Edit Project", href: `/projects/${projectId}/edit` },
    ];

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto p-6 max-w-4xl">
          <ProjectForm 
            type="edit"
            projectId={projectId}
            initialData={project}
          />
        </div>
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading project:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load project. Please try again later.
        </div>
      </div>
    );
  }
}