// import { NextRequest, NextResponse } from "next/server";
// import { WMSRepository } from "@/lib/Repository";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const repo = new WMSRepository();
//   const project = await repo.getProjectById(Number(params.id));
//   if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
//   return NextResponse.json(project);
// }
