import { findPlan } from "@/data/pricing";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type SpendTool = {
  id: string;
  vendor: string;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  companyName: string;
  teamSize: number;
  primaryUseCase: UseCase;
  tools: SpendTool[];
};

export type ToolRecommendation = {
  id: string;
  vendor: string;
  plan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
};

export type AuditResult = {
  id: string;
  companyName: string;
  publicCompanyName: string;
  teamSize: number;
  primaryUseCase: UseCase;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsLevel: "high" | "medium" | "low" | "optimized";
  summary: string;
  recommendations: ToolRecommendation[];
  createdAt: string;
};

function sanitizeCompanyName(companyName: string) {
  if (!companyName.trim()) {
    return "Anonymous startup";
  }

  return "Startup team";
}

function getRecommendedPlan(vendor: string, teamSize: number) {
  if (vendor === "Cursor") {
    return teamSize <= 2 ? "Pro" : "Business";
  }

  if (vendor === "GitHub Copilot") {
    if (teamSize <= 2) return "Individual";
    if (teamSize <= 50) return "Business";
    return "Enterprise";
  }

  if (vendor === "Claude") {
    if (teamSize <= 1) return "Pro";
    return "Team";
  }

  if (vendor === "ChatGPT") {
    if (teamSize <= 1) return "Plus";
    return "Business";
  }

  if (vendor === "Windsurf") {
    return "Pro";
  }

  if (vendor.includes("API")) {
    return "API direct";
  }

  if (vendor === "Gemini") {
    return "Pro";
  }

  return "Pro";
}

function calculateRecommendedSpend(tool: SpendTool, teamSize: number) {
  const usefulSeats = Math.min(tool.seats, Math.max(1, teamSize));
  const recommendedPlanName = getRecommendedPlan(tool.vendor, teamSize);
  const plan = findPlan(tool.vendor, recommendedPlanName);

  if (tool.vendor.includes("API")) {
    if (tool.monthlySpend > 1000) return Math.round(tool.monthlySpend * 0.65);
    if (tool.monthlySpend > 300) return Math.round(tool.monthlySpend * 0.75);
    if (tool.monthlySpend > 100) return Math.round(tool.monthlySpend * 0.85);
    return tool.monthlySpend;
  }

  if (!plan) {
    return tool.monthlySpend;
  }

  if (plan.unit === "account") {
    return plan.monthlyPrice;
  }

  return plan.monthlyPrice * usefulSeats;
}

function getReason(tool: SpendTool, recommendedSpend: number, teamSize: number) {
  if (tool.seats > teamSize) {
    return "There are more paid seats than team members, so unused seats may be creating avoidable spend.";
  }

  if (tool.vendor.includes("API") && tool.monthlySpend > recommendedSpend) {
    return "API spend can often be reduced with usage limits, caching, cheaper model routing, and credit-based purchasing.";
  }

  if (tool.monthlySpend > recommendedSpend) {
    return "The selected plan appears more expensive than the recommended fit for this team size.";
  }

  return "The current plan looks reasonable for the entered team size and use case.";
}

export function runAudit(id: string, input: AuditInput): AuditResult {
  const recommendations = input.tools.map((tool) => {
    const recommendedSpend = calculateRecommendedSpend(tool, input.teamSize);
    const monthlySavings = Math.max(0, tool.monthlySpend - recommendedSpend);

    return {
      id: tool.id,
      vendor: tool.vendor,
      plan: tool.plan,
      currentSpend: tool.monthlySpend,
      recommendedAction:
        monthlySavings > 0
          ? `Review ${tool.vendor} ${tool.plan} and target about $${recommendedSpend}/month.`
          : `Keep ${tool.vendor} ${tool.plan} for now.`,
      recommendedSpend,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: getReason(tool, recommendedSpend, input.teamSize)
    };
  });

  const totalMonthlySpend = input.tools.reduce(
    (sum, tool) => sum + tool.monthlySpend,
    0
  );

  const totalMonthlySavings = recommendations.reduce(
    (sum, item) => sum + item.monthlySavings,
    0
  );

  let savingsLevel: AuditResult["savingsLevel"] = "optimized";

  if (totalMonthlySavings > 500) {
    savingsLevel = "high";
  } else if (totalMonthlySavings >= 100) {
    savingsLevel = "medium";
  } else if (totalMonthlySavings > 0) {
    savingsLevel = "low";
  }

  const summary =
    totalMonthlySavings > 500
      ? `Your team may be leaving $${totalMonthlySavings}/month on the table. The biggest opportunity is to reduce unused seats, downgrade overpowered plans, and explore discounted AI credits through Credex.`
      : totalMonthlySavings < 100
        ? "Your AI spend looks mostly healthy. There may be small optimizations, but the current stack does not show major waste."
        : `Your team has a practical savings opportunity of about $${totalMonthlySavings}/month by reviewing plans, seats, and API usage.`;

  return {
    id,
    companyName: input.companyName,
    publicCompanyName: sanitizeCompanyName(input.companyName),
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsLevel,
    summary,
    recommendations,
    createdAt: new Date().toISOString()
  };
}