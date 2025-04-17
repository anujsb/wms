import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const task = await repository.getTaskById(id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const updatedTask = await repository.updateTask(id, body);
    if (!updatedTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const deleted = await repository.deleteTask(id);
    if (!deleted) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}