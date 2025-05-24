import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Remove the await on params as it's already resolved
    const repo = new WMSRepository();
    await repo.deleteProject(parseInt(params.id));
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
    // Remove the await here as well
    const projectId = parseInt(params.id);
    
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
