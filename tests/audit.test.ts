import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit";

describe("runAudit", () => {
  it("calculates total monthly spend correctly", () => {
    const result = runAudit("test-1", {
      companyName: "Test Startup",
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [
        {
          id: "1",
          vendor: "Cursor",
          plan: "Business",
          monthlySpend: 80,
          seats: 2
        },
        {
          id: "2",
          vendor: "ChatGPT",
          plan: "Plus",
          monthlySpend: 40,
          seats: 2
        }
      ]
    });

    expect(result.totalMonthlySpend).toBe(120);
  });

  it("calculates annual savings as monthly savings multiplied by 12", () => {
    const result = runAudit("test-2", {
      companyName: "Annual Test",
      teamSize: 1,
      primaryUseCase: "coding",
      tools: [
        {
          id: "1",
          vendor: "Cursor",
          plan: "Business",
          monthlySpend: 120,
          seats: 3
        }
      ]
    });

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("detects unused seats when paid seats are greater than team size", () => {
    const result = runAudit("test-3", {
      companyName: "Seat Test",
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [
        {
          id: "1",
          vendor: "GitHub Copilot",
          plan: "Business",
          monthlySpend: 190,
          seats: 10
        }
      ]
    });

    expect(result.recommendations[0].reason).toContain("more paid seats");
  });

  it("marks savings level as high when monthly savings are above 500", () => {
    const result = runAudit("test-4", {
      companyName: "Big API Team",
      teamSize: 5,
      primaryUseCase: "mixed",
      tools: [
        {
          id: "1",
          vendor: "OpenAI API",
          plan: "API direct",
          monthlySpend: 2000,
          seats: 1
        }
      ]
    });

    expect(result.savingsLevel).toBe("high");
  });

  it("returns optimized message when savings are below 100", () => {
    const result = runAudit("test-5", {
      companyName: "Small Team",
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [
        {
          id: "1",
          vendor: "ChatGPT",
          plan: "Plus",
          monthlySpend: 20,
          seats: 1
        }
      ]
    });

    expect(result.savingsLevel).toBe("optimized");
    expect(result.summary).toContain("healthy");
  });
});