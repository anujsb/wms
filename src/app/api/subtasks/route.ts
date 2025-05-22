import { WMSRepository } from "@/lib/Repository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const repo = new WMSRepository();
    const data = await request.json();
    const subtask = await repo.createSubtask(data.taskId, data);
    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subtask" }, { status: 500 });
  }
}