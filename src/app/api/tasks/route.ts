import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const repo = new WMSRepository();
    const data = await request.json();
    const task = await repo.createTask(data.projectId, data);
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}