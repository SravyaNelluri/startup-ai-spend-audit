export type VendorPlan = {
  vendor: string;
  plan: string;
  monthlyPrice: number;
  unit: "user" | "account" | "usage";
  source: string;
};

export const pricingData: VendorPlan[] = [
  { vendor: "Cursor", plan: "Hobby", monthlyPrice: 0, unit: "account", source: "https://cursor.com/pricing" },
  { vendor: "Cursor", plan: "Pro", monthlyPrice: 20, unit: "user", source: "https://cursor.com/pricing" },
  { vendor: "Cursor", plan: "Business", monthlyPrice: 40, unit: "user", source: "https://cursor.com/pricing" },

  { vendor: "GitHub Copilot", plan: "Individual", monthlyPrice: 10, unit: "user", source: "https://github.com/features/copilot/plans" },
  { vendor: "GitHub Copilot", plan: "Business", monthlyPrice: 19, unit: "user", source: "https://github.com/features/copilot/plans" },
  { vendor: "GitHub Copilot", plan: "Enterprise", monthlyPrice: 39, unit: "user", source: "https://github.com/features/copilot/plans" },

  { vendor: "Claude", plan: "Free", monthlyPrice: 0, unit: "account", source: "https://claude.com/pricing" },
  { vendor: "Claude", plan: "Pro", monthlyPrice: 20, unit: "user", source: "https://claude.com/pricing" },
  { vendor: "Claude", plan: "Team", monthlyPrice: 30, unit: "user", source: "https://claude.com/pricing" },
  { vendor: "Claude", plan: "API direct", monthlyPrice: 0, unit: "usage", source: "https://platform.claude.com/docs/en/about-claude/pricing" },

  { vendor: "ChatGPT", plan: "Plus", monthlyPrice: 20, unit: "user", source: "https://chatgpt.com/pricing" },
  { vendor: "ChatGPT", plan: "Business", monthlyPrice: 25, unit: "user", source: "https://openai.com/business/chatgpt-pricing/" },
  { vendor: "ChatGPT", plan: "API direct", monthlyPrice: 0, unit: "usage", source: "https://openai.com/api/pricing/" },

  { vendor: "OpenAI API", plan: "API direct", monthlyPrice: 0, unit: "usage", source: "https://openai.com/api/pricing/" },
  { vendor: "Anthropic API", plan: "API direct", monthlyPrice: 0, unit: "usage", source: "https://platform.claude.com/docs/en/about-claude/pricing" },

  { vendor: "Gemini", plan: "Pro", monthlyPrice: 20, unit: "user", source: "https://ai.google.dev/pricing" },
  { vendor: "Gemini", plan: "API", monthlyPrice: 0, unit: "usage", source: "https://ai.google.dev/pricing" },

  { vendor: "Windsurf", plan: "Pro", monthlyPrice: 15, unit: "user", source: "https://windsurf.com/pricing" }
];

export const vendors = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "OpenAI API",
  "Anthropic API",
  "Gemini",
  "Windsurf"
];

export function getPlansForVendor(vendor: string) {
  return pricingData.filter((item) => item.vendor === vendor);
}

export function findPlan(vendor: string, plan: string) {
  return pricingData.find(
    (item) =>
      item.vendor.toLowerCase() === vendor.toLowerCase() &&
      item.plan.toLowerCase() === plan.toLowerCase()
  );
}