"use client";

import { useEffect, useState } from "react";
import type { AuditResult } from "@/lib/audit";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ResultPage({ params }: Props) {
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      const saved = localStorage.getItem(`credex-audit-${resolved.id}`);

      if (saved) {
        setResult(JSON.parse(saved));
      }
    });
  }, [params]);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8">
          <h1 className="text-3xl font-black">Audit not found</h1>
          <p className="mt-4 text-slate-300">
            Please go back and generate a new audit.
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950"
          >
            Run new audit
          </a>
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
          <a href="/" className="text-2xl font-bold">
            StackLeak Audit
          </a>

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
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
              <div className="mt-2 text-3xl font-black">
                {result.teamSize}
              </div>
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
      </section>
    </main>
  );
}