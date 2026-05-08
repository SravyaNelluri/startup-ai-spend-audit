import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { runAudit } from "@/lib/audit";

const ToolSchema = z.object({
  id: z.string(),
  vendor: z.string(),
  plan: z.string(),
  monthlySpend: z.number().min(0),
  seats: z.number().min(1)
});

const AuditSchema = z.object({
  companyName: z.string(),
  teamSize: z.number().min(1),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(ToolSchema).min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = AuditSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid audit input",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const result = runAudit(nanoid(10), parsed.data);

  return NextResponse.json({ result });
}