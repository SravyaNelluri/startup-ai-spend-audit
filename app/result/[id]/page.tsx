"use client";

import Link from "next/link";
import { use, useState } from "react";
import type { AuditResult } from "@/lib/audit";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getSavedResult(id: string): AuditResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = localStorage.getItem(`credex-audit-${id}`);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as AuditResult;
  } catch {
    localStorage.removeItem(`credex-audit-${id}`);
    return null;
  }
}

export default function ResultPage({ params }: Props) {
  const resolvedParams = use(params);
  const [result] = useState<AuditResult | null>(() =>
    getSavedResult(resolvedParams.id)
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [leadStatus, setLeadStatus] = useState("");

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    alert("Result link copied!");
  }

  async function submitLead() {
    if (!result) return;

    setLeadStatus("Saving...");

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        role,
        companyName,
        teamSize: result.teamSize,
        auditId: result.id,
        totalMonthlySavings: result.totalMonthlySavings,
        honeypot: ""
      })
    });

    if (response.ok) {
      setLeadStatus("Done! Your email has been saved.");
    } else {
      setLeadStatus("Something went wrong. Please try again.");
    }
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8">
          <h1 className="text-3xl font-black">Audit not found</h1>

          <p className="mt-4 text-slate-300">
            Please go back and generate a new audit.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950"
          >
            Run new audit
          </Link>
        </div>
      </main>
    );
  }

  const highSavings = result.totalMonthlySavings > 500;
  const optimized = result.totalMonthlySavings < 100;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-5 py-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            StackLeak Audit
          </Link>

          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl bg-slate-800 px-4 py-2 font-bold"
          >
            Copy result URL
          </button>
        </nav>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-8">
          <p className="text-emerald-200">
            Audit result for {result.publicCompanyName}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            ${result.totalMonthlySavings}/month potential savings
          </h1>

          <p className="mt-4 text-xl text-slate-300">
            That is about ${result.totalAnnualSavings}/year.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-900 p-5">
              <p className="text-slate-400">Current monthly spend</p>
              <div className="mt-2 text-3xl font-black">
                ${result.totalMonthlySpend}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5">
              <p className="text-slate-400">Team size</p>
              <div className="mt-2 text-3xl font-black">{result.teamSize}</div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5">
              <p className="text-slate-400">Use case</p>
              <div className="mt-2 text-3xl font-black capitalize">
                {result.primaryUseCase}
              </div>
            </div>
          </div>

          <p className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-100">
            {result.summary}
          </p>

          {highSavings && (
            <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5">
              <h2 className="text-2xl font-black text-yellow-100">
                Credex can help capture this savings
              </h2>

              <p className="mt-2 text-yellow-50">
                Your audit shows more than $500/month in possible savings. This
                is a strong case for discounted AI credits and vendor spend
                review.
              </p>
            </div>
          )}

          {optimized && (
            <div className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-400/10 p-5">
              <h2 className="text-2xl font-black text-blue-100">
                You are spending well
              </h2>

              <p className="mt-2 text-blue-50">
                Your current AI spend does not show major waste. You can still
                sign up to get notified when new optimizations apply.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-black">Per-tool breakdown</h2>

          <div className="mt-5 space-y-4">
            {result.recommendations.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <h3 className="text-xl font-bold">
                  {item.vendor} — {item.plan}
                </h3>

                <p className="mt-2 text-slate-300">{item.reason}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <p className="rounded-xl bg-slate-950 p-3">
                    Current: ${item.currentSpend}
                  </p>

                  <p className="rounded-xl bg-slate-950 p-3">
                    Recommended: ${item.recommendedSpend}
                  </p>

                  <p className="rounded-xl bg-slate-950 p-3">
                    Monthly savings: ${item.monthlySavings}
                  </p>

                  <p className="rounded-xl bg-slate-950 p-3">
                    Annual: ${item.annualSavings}
                  </p>
                </div>

                <p className="mt-4 font-semibold text-emerald-100">
                  {item.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-black">Capture the report</h2>

          <p className="mt-2 text-slate-300">
            Email is asked only after showing value.
          </p>

          <label className="mt-4 block text-sm font-bold">Email</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
          />

          <label className="mt-4 block text-sm font-bold">Company name</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Optional"
          />

          <label className="mt-4 block text-sm font-bold">Role</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Founder / CTO / Engineering Manager"
          />

          <button
            type="button"
            onClick={submitLead}
            className="mt-5 w-full rounded-xl bg-emerald-400 px-5 py-3 font-black text-slate-950"
          >
            Email my report
          </button>

          {leadStatus && (
            <p className="mt-4 text-sm text-emerald-200">{leadStatus}</p>
          )}
        </div>
      </section>
    </main>
  );
}