/// <reference types="vitest/globals" />
import { generateSummary } from "../controllers/summary";
import type { AuditInput, Recommendation } from "@costpilot/shared";

function makeInput(overrides?: Partial<AuditInput>): AuditInput {
  return {
    tools: [{ toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
    ...overrides,
  };
}

describe("summary fallback", () => {
  it("returns fallback when apiKey is undefined", async () => {
    const result = await generateSummary(undefined, makeInput(), [], 0, 0);
    expect(result).toContain("well-optimized");
    expect(result).toContain("1 tool");
  });

  it("returns fallback when apiKey is empty", async () => {
    const result = await generateSummary("", makeInput(), [], 0, 0);
    expect(result).toContain("well-optimized");
  });

  it("fallback mentions savings when there are savings", async () => {
    const recs: Recommendation[] = [
      {
        type: "downgrade",
        toolId: "cursor",
        currentPlan: "business",
        currentSpend: 80,
        recommendedAction: "Switch to Pro",
        reasoning: "Too many seats for Business",
        monthlySavings: 40,
        yearlySavings: 480,
      },
    ];

    const result = await generateSummary(undefined, makeInput(), recs, 40, 480);
    expect(result).toContain("$40");
    expect(result).toContain("$480");
    expect(result).toContain("Credex");
  });

  it("fallback says optimized when no savings", async () => {
    const result = await generateSummary(
      undefined,
      makeInput(),
      [
        {
          type: "already-optimal",
          toolId: "cursor",
          currentPlan: "pro",
          currentSpend: 20,
          recommendedAction: "You're good",
          reasoning: "Pro is right for you",
          monthlySavings: 0,
          yearlySavings: 0,
        },
      ],
      0,
      0
    );

    expect(result).toContain("well-optimized");
    expect(result).not.toContain("Credex");
  });

  it("fallback includes tool count", async () => {
    const input = makeInput({
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
        { toolId: "copilot", plan: "individual", monthlySpend: 10, seats: 1 },
      ],
    });

    const result = await generateSummary(undefined, input, [], 0, 0);
    expect(result).toContain("2 tool");
  });
});
