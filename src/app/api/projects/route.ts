import { NextResponse } from 'next/server';
import { Repository } from '@/lib/Repository';

const repository = new Repository();

export async function GET() {
  try {
    const projects = await repository.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await repository.createProject(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 400 });
  }
}