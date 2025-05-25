import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const repo = new WMSRepository();
    await repo.deleteSubtask(parseInt(resolvedParams.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subtask" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const subtaskId = parseInt(resolvedParams.id);
    
    if (!subtaskId || isNaN(subtaskId)) {
      return NextResponse.json({ error: "Valid subtask ID is required" }, { status: 400 });
    }

    const repo = new WMSRepository();
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Subtask name is required" }, { status: 400 });
    }

    const cleanData = {
      name: data.name,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      timeRequired: data.timeRequired ? parseInt(data.timeRequired) : null,
      priority: data.priority || null,
      assignedTo: data.assignedTo ? parseInt(data.assignedTo) : null,
      status: data.status || null,
    };

    const subtask = await repo.updateSubtask(subtaskId, cleanData);
    return NextResponse.json(subtask);
  } catch (error) {
    console.error('Subtask update error:', error);
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}