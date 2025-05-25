import { NextRequest, NextResponse } from "next/server";
import { WMSRepository } from "@/lib/Repository";

export async function GET() {
  const repo = new WMSRepository();
  const projects = await repo.getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const repo = new WMSRepository();
  const project = await repo.createProject(data);
  return NextResponse.json(project, { status: 201 });
}
