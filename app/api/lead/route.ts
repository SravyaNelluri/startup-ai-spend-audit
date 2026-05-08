import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const LeadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  auditId: z.string(),
  totalMonthlySavings: z.number(),
  honeypot: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid lead data"
      },
      { status: 400 }
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("leads").insert({
      email: parsed.data.email,
      company_name: parsed.data.companyName || null,
      role: parsed.data.role || null,
      team_size: parsed.data.teamSize || null,
      audit_id: parsed.data.auditId,
      monthly_savings: parsed.data.totalMonthlySavings
    });
  }

  if (resendKey) {
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Credex Audit <onboarding@resend.dev>",
      to: parsed.data.email,
      subject: "Your AI Spend Audit report",
      html: `
        <h2>Your AI Spend Audit is ready</h2>
        <p>Your audit found possible monthly savings of <strong>$${parsed.data.totalMonthlySavings}</strong>.</p>
        <p>If your savings are high, Credex may reach out with discounted AI credit options.</p>
      `
    });
  }

  return NextResponse.json({
    ok: true
  });
}