import type { Recommendation } from "@costpilot/shared";

export type BenchmarkTier = "top-tier" | "above-average" | "mid-pack" | "watchlist";

export interface BenchmarkProfile {
  referenceLabel: string;
  spendPercentile: number;
  toolCountPercentile: number;
  overlapPercentile: number;
  seatEfficiencyPercentile: number;
  savingsOpportunityPercentile: number;
  tier: BenchmarkTier;
  summary: string;
  signals: {
    label: string;
    value: string;
    tone: string;
  }[];
  peerStats: {
    label: string;
    value: string;
    tone: string;
  }[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function percentileLabel(value: number) {
  if (value >= 85) return "top 15%";
  if (value >= 65) return "above median";
  if (value >= 40) return "around median";
  return "below median";
}

function stackShapeLabel(toolCount: number) {
  if (toolCount <= 1) return "single-tool stack";
  if (toolCount <= 3) return "lean multi-tool stack";
  if (toolCount <= 5) return "multi-stack team";
  return "heavily fragmented stack";
}

function medianToolCount(teamSize: number) {
  if (teamSize <= 5) return 2;
  if (teamSize <= 15) return 3;
  if (teamSize <= 40) return 4;
  return 5;
}

function referenceLabel(teamSize: number, useCase: string, toolCount: number) {
  const teamBand = teamSize <= 5 ? "1-5" : teamSize <= 15 ? "6-15" : teamSize <= 40 ? "16-40" : "40+";
  const focus = useCase === "coding" ? "product engineering" : useCase === "writing" ? "content" : useCase;
  return `${teamBand} person ${focus} teams with ${stackShapeLabel(toolCount)}`;
}

function recommendationPressure(recommendations: Recommendation[]) {
  return recommendations.filter((rec) => rec.monthlySavings > 0).length;
}

export function buildBenchmarkProfile(params: {
  teamSize: number;
  toolCount: number;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  overlapExposure: number;
  assistantSpend: number;
  recommendations: Recommendation[];
  useCase: string;
}): BenchmarkProfile {
  const {
    teamSize,
    toolCount,
    totalMonthlySpend,
    totalMonthlySavings,
    overlapExposure,
    assistantSpend,
    recommendations,
    useCase,
  } = params;

  const normalizedSpend = clamp(Math.round(totalMonthlySpend / Math.max(teamSize, 1)), 0, 2000);
  const normalizedTools = clamp(toolCount, 1, 8);
  const savingsPressure = recommendationPressure(recommendations);

  const spendPercentile = clamp(
    Math.round(24 + normalizedSpend / 12 + normalizedTools * 4 + Math.min(20, savingsPressure * 3)),
    12,
    96
  );
  const toolCountPercentile = clamp(Math.round(22 + normalizedTools * 9 + Math.max(0, teamSize - 3) * 1.2), 14, 96);
  const overlapPercentile = clamp(
    Math.round(18 + (overlapExposure / Math.max(totalMonthlySpend, 1)) * 120 + Math.min(18, assistantSpend / 10)),
    8,
    97
  );
  const seatEfficiencyPercentile = clamp(
    Math.round(92 - normalizedSpend / 18 - Math.max(0, normalizedTools - medianToolCount(teamSize)) * 8),
    10,
    96
  );
  const savingsOpportunityPercentile = clamp(
    Math.round(28 + (totalMonthlySavings / Math.max(totalMonthlySpend, 1)) * 140 + savingsPressure * 3),
    14,
    98
  );

  const avgPercentile = (spendPercentile + toolCountPercentile + overlapPercentile + savingsOpportunityPercentile) / 4;
  const tier: BenchmarkTier = avgPercentile >= 82 ? "top-tier" : avgPercentile >= 64 ? "above-average" : avgPercentile >= 45 ? "mid-pack" : "watchlist";

  const summary =
    tier === "top-tier"
      ? "Your stack looks unusually disciplined for a team this size."
      : tier === "above-average"
        ? "Your stack is healthy, but there is still visible optimization room."
        : tier === "mid-pack"
          ? "You are near the middle of the pack, with a few clear efficiency gaps."
          : "Your stack needs attention compared with similar teams.";

  return {
    referenceLabel: referenceLabel(teamSize, useCase, toolCount),
    spendPercentile,
    toolCountPercentile,
    overlapPercentile,
    seatEfficiencyPercentile,
    savingsOpportunityPercentile,
    tier,
    summary,
    signals: [
      {
        label: "Spend position",
        value: percentileLabel(spendPercentile),
        tone: spendPercentile >= 70 ? "text-amber-200" : "text-emerald-200",
      },
      {
        label: "Tool count",
        value: percentileLabel(toolCountPercentile),
        tone: toolCountPercentile >= 70 ? "text-amber-200" : "text-emerald-200",
      },
      {
        label: "Overlap",
        value: percentileLabel(overlapPercentile),
        tone: overlapPercentile >= 70 ? "text-amber-200" : "text-emerald-200",
      },
      {
        label: "Seat efficiency",
        value: percentileLabel(seatEfficiencyPercentile),
        tone: seatEfficiencyPercentile >= 70 ? "text-emerald-200" : "text-amber-200",
      },
    ],
    peerStats: [
      {
        label: "Reference group",
        value: referenceLabel(teamSize, useCase, toolCount),
        tone: "text-white/70",
      },
      {
        label: "Savings opportunity",
        value: percentileLabel(savingsOpportunityPercentile),
        tone: savingsOpportunityPercentile >= 70 ? "text-emerald-200" : "text-amber-200",
      },
      {
        label: "Median tools",
        value: `${medianToolCount(teamSize)} tools`,
        tone: "text-white/70",
      },
      {
        label: "Stack shape",
        value: stackShapeLabel(toolCount),
        tone: "text-white/70",
      },
    ],
  };
}
