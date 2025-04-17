import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET() {
  try {
    const tasks = await repository.getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = await repository.createTask(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 400 });
  }
}