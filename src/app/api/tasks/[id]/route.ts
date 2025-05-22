import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const repo = new WMSRepository();
    const resolvedParams = await params;
    await repo.deleteTask(parseInt(resolvedParams.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    
    if (!resolvedParams.id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const taskId = parseInt(resolvedParams.id);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const repo = new WMSRepository();
    const data = await request.json();

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "Task name is required" }, { status: 400 });
    }

    // Clean up the data before updating
    const cleanData = {
      name: data.name,
      description: data.description || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      timeRequired: data.timeRequired ? parseInt(data.timeRequired) : null,
      priority: data.priority || null,
      assignedTo: data.assignedTo ? parseInt(data.assignedTo) : null,
      status: data.status || null,
    };

    const task = await repo.updateTask(taskId, cleanData);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json(
      { error: "Failed to update task" }, 
      { status: 500 }
    );
  }
}