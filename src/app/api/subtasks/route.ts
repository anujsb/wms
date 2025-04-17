import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET() {
  try {
    const subtasks = await repository.getAllSubtasks();
    return NextResponse.json(subtasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch subtasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSubtask = await repository.createSubtask(body);
    return NextResponse.json(newSubtask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create subtask' }, { status: 400 });
  }
}