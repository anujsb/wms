import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const subtask = await repository.getSubtaskById(id);
    if (!subtask) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    return NextResponse.json(subtask);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch subtask' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const updatedSubtask = await repository.updateSubtask(id, body);
    if (!updatedSubtask) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    return NextResponse.json(updatedSubtask);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const deleted = await repository.deleteSubtask(id);
    if (!deleted) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    return NextResponse.json({ message: 'Subtask deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
  }
}