"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { vendors, getPlansForVendor } from "@/data/pricing";
import { runAudit, type AuditInput, type SpendTool, type UseCase } from "@/lib/audit";

const defaultForm: AuditInput = {
  companyName: "",
  teamSize: 3,
  primaryUseCase: "coding",
  tools: [
    {
      id: nanoid(),
      vendor: "Cursor",
      plan: "Pro",
      monthlySpend: 40,
      seats: 2
    },
    {
      id: nanoid(),
      vendor: "ChatGPT",
      plan: "Plus",
      monthlySpend: 40,
      seats: 2
    }
  ]
};

export default function Home() {
  const [form, setForm] = useState<AuditInput>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("credex-audit-form");

    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        localStorage.removeItem("credex-audit-form");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("credex-audit-form", JSON.stringify(form));
  }, [form]);

  function updateTool(id: string, field: keyof SpendTool, value: string) {
    setError("");

    setForm((current) => ({
      ...current,
      tools: current.tools.map((tool) => {
        if (tool.id !== id) return tool;

        if (field === "vendor") {
          const firstPlan = getPlansForVendor(value)[0]?.plan || "Pro";

          return {
            ...tool,
            vendor: value,
            plan: firstPlan
          };
        }

        if (field === "monthlySpend") {
          return {
            ...tool,
            monthlySpend: Number(value) || 0
          };
        }

        if (field === "seats") {
          return {
            ...tool,
            seats: Number(value) || 1
          };
        }

        return {
          ...tool,
          [field]: value
        };
      })
    }));
  }

  function addTool() {
    setError("");

    setForm((current) => ({
      ...current,
      tools: [
        ...current.tools,
        {
          id: nanoid(),
          vendor: "GitHub Copilot",
          plan: "Business",
          monthlySpend: 57,
          seats: 3
        }
      ]
    }));
  }

  function removeTool(id: string) {
    setError("");

    setForm((current) => {
      if (current.tools.length <= 1) {
        return current;
      }

      return {
        ...current,
        tools: current.tools.filter((tool) => tool.id !== id)
      };
    });
  }

  function submitAudit() {
    setError("");
    setLoading(true);

    try {
      const cleanForm: AuditInput = {
        ...form,
        teamSize: Number(form.teamSize) || 1,
        tools: form.tools.map((tool) => ({
          ...tool,
          monthlySpend: Number(tool.monthlySpend) || 0,
          seats: Number(tool.seats) || 1
        }))
      };

      if (cleanForm.teamSize < 1) {
        setError("Team size must be at least 1.");
        setLoading(false);
        return;
      }

      if (cleanForm.tools.length === 0) {
        setError("Please add at least one AI tool.");
        setLoading(false);
        return;
      }

      const result = runAudit(nanoid(10), cleanForm);

      localStorage.setItem(
        `credex-audit-${result.id}`,
        JSON.stringify(result)
      );

      window.location.href = `/result/${result.id}`;
    } catch (error) {
      console.error("Audit generation error:", error);
      setError("Something went wrong while generating the audit.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-5 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold">StackLeak Audit</div>

          <div className="rounded-full border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200">
            Free AI Spend Audit
          </div>
        </nav>

        <div className="grid gap-8 py-14 lg:grid-cols-[1fr_460px]">
          <div>
            <div className="mb-4 inline-block rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              For startup founders and engineering managers
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-6xl">
              Find wasted AI tool spend in 2 minutes.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Enter Cursor, ChatGPT, Claude, Copilot, Gemini, API, and Windsurf
              spend. Get instant monthly savings, annual savings, and a clear
              action plan.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold">No login</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Value is shown before email capture.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold">Clear logic</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Plan-fit reasoning with savings estimates.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold">Shareable</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Each audit gets a result URL.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold">Run your audit</h2>

            {error && (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <label className="mt-5 block text-sm font-semibold">
              Company name
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
              placeholder="Example: Acme AI"
              value={form.companyName}
              onChange={(event) =>
                setForm({
                  ...form,
                  companyName: event.target.value
                })
              }
            />

            <label className="mt-5 block text-sm font-semibold">
              Team size
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(event) =>
                setForm({
                  ...form,
                  teamSize: Number(event.target.value) || 1
                })
              }
            />

            <label className="mt-5 block text-sm font-semibold">
              Primary use case
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"
              value={form.primaryUseCase}
              onChange={(event) =>
                setForm({
                  ...form,
                  primaryUseCase: event.target.value as UseCase
                })
              }
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed</option>
            </select>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="font-bold">AI tools</h3>

              <button
                type="button"
                onClick={addTool}
                className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold"
              >
                Add tool
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {form.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <select
                      className="rounded-xl border border-white/10 bg-slate-950 p-3"
                      value={tool.vendor}
                      onChange={(event) =>
                        updateTool(tool.id, "vendor", event.target.value)
                      }
                    >
                      {vendors.map((vendor) => (
                        <option key={vendor} value={vendor}>
                          {vendor}
                        </option>
                      ))}
                    </select>

                    <select
                      className="rounded-xl border border-white/10 bg-slate-950 p-3"
                      value={tool.plan}
                      onChange={(event) =>
                        updateTool(tool.id, "plan", event.target.value)
                      }
                    >
                      {getPlansForVendor(tool.vendor).map((plan) => (
                        <option key={plan.plan} value={plan.plan}>
                          {plan.plan}
                        </option>
                      ))}
                    </select>

                    <input
                      className="rounded-xl border border-white/10 bg-slate-950 p-3"
                      type="number"
                      min={0}
                      placeholder="Monthly spend"
                      value={tool.monthlySpend}
                      onChange={(event) =>
                        updateTool(tool.id, "monthlySpend", event.target.value)
                      }
                    />

                    <input
                      className="rounded-xl border border-white/10 bg-slate-950 p-3"
                      type="number"
                      min={1}
                      placeholder="Seats"
                      value={tool.seats}
                      onChange={(event) =>
                        updateTool(tool.id, "seats", event.target.value)
                      }
                    />
                  </div>

                  {form.tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTool(tool.id)}
                      className="mt-3 text-sm text-red-300"
                    >
                      Remove tool
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={submitAudit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-4 font-black text-slate-950 disabled:opacity-60"
            >
              {loading ? "Generating audit..." : "Generate audit"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}