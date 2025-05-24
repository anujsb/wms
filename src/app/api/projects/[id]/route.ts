import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const repo = new WMSRepository();
    await repo.deleteProject(parseInt(resolvedParams.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);
    
    if (!projectId || isNaN(projectId)) {
      return NextResponse.json({ error: "Valid project ID is required" }, { status: 400 });
    }

    const repo = new WMSRepository();
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const cleanData = {
      name: data.name,
      description: data.description || null,
    };

    const project = await repo.updateProject(projectId, cleanData);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
