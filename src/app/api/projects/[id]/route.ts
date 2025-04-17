// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { projects } from '@/lib/schema';
// import { eq } from 'drizzle-orm';

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const project = await db.select().from(projects).where(eq(projects.id, parseInt(params.id)));
//   if (!project.length) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
//   return NextResponse.json(project[0]);
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const body = await request.json();
//   const updatedProject = await db
//     .update(projects)
//     .set(body)
//     .where(eq(projects.id, parseInt(params.id)))
//     .returning();
//   return NextResponse.json(updatedProject[0]);
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   await db.delete(projects).where(eq(projects.id, parseInt(params.id)));
//   return NextResponse.json({ message: 'Project deleted' });
// }