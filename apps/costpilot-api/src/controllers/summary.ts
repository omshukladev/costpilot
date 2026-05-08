import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuditInput, Recommendation } from "@costpilot/shared";

export async function generateSummary(
  apiKey: string | undefined,
  input: AuditInput,
  recommendations: Recommendation[],
  totalMonthlySavings: number,
  totalYearlySavings: number
): Promise<string> {
  if (!apiKey) {
    return buildFallback(input, recommendations, totalMonthlySavings, totalYearlySavings);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const toolsText = input.tools
      .map((t) => `- ${t.toolId} (${t.plan}): $${t.monthlySpend}/month, ${t.seats} seat(s)`)
      .join("\n");

    const recsText = recommendations
      .map((r) => `- ${r.toolId}: ${r.recommendedAction} (save $${r.monthlySavings}/month)`)
      .join("\n");

    const prompt = `You are a financial analyst specializing in AI tool spend optimization.
Write a ~100 word personalized summary for the user based on their audit results.

Tools and spend:
${toolsText}

Recommendations:
${recsText}

Total monthly savings: $${totalMonthlySavings}
Total yearly savings: $${totalYearlySavings}

Write in a professional, helpful tone. Do not make up specific numbers. If there are no savings, acknowledge their setup is efficient.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text || text.length < 20) {
      return buildFallback(input, recommendations, totalMonthlySavings, totalYearlySavings);
    }

    return text;
  } catch (err) {
    console.error("Gemini API error:", err);
    return buildFallback(input, recommendations, totalMonthlySavings, totalYearlySavings);
  }
}

function buildFallback(
  input: AuditInput,
  recommendations: Recommendation[],
  totalMonthlySavings: number,
  totalYearlySavings: number
): string {
  const toolCount = input.tools.length;
  const savingsCount = recommendations.filter((r) => r.monthlySavings > 0).length;

  if (totalMonthlySavings > 0) {
    return `Based on your AI tooling audit, we analyzed ${toolCount} tool(s) across your team. We identified ${savingsCount} area(s) where you could reduce spending, with total potential savings of $${totalMonthlySavings} per month ($${totalYearlySavings} per year). For significant savings, consider purchasing AI credits through Credex at discounted rates.`;
  }

  return `Based on your AI tooling audit, we analyzed ${toolCount} tool(s) across your team. Your current setup appears well-optimized for your team size and usage. No significant savings opportunities were identified at this time.`;
}
