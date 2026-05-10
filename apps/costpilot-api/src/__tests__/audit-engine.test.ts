/// <reference types="vitest/globals" />
import { runAudit } from "../controllers/audit-engine";
import type { AuditInput } from "@costpilot/shared";

describe("audit-engine", () => {
  it("detects Cursor Business with 2 seats and recommends downgrade to Pro", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
      ],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    expect(rec.type).toBe("downgrade");
    expect(rec.toolId).toBe("cursor");
    expect(rec.monthlySavings).toBe(40);
    expect(rec.recommendedAction).toContain("Pro");
  });

  it("detects ChatGPT Enterprise with 5 seats and recommends Team plan", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "chatgpt", plan: "enterprise", monthlySpend: 300, seats: 5 },
      ],
      teamSize: 5,
      useCase: "writing",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    expect(rec.type).toBe("downgrade");
    expect(rec.toolId).toBe("chatgpt");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.recommendedAction).toContain("Team");
  });

  it("detects Claude API >$200 spend and suggests Credex credits", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "claude",
          plan: "api-direct",
          monthlySpend: 500,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    expect(rec.type).toBe("credit-optimization");
    expect(rec.toolId).toBe("claude");
    expect(rec.monthlySavings).toBe(75);
    expect(rec.recommendedAction).toContain("Credex");
  });

  it("returns already-optimal for a single Copilot Individual user", () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "copilot",
          plan: "individual",
          monthlySpend: 10,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);
    const rec = result.recommendations[0];

    expect(rec.type).toBe("already-optimal");
    expect(rec.monthlySavings).toBe(0);
  });

  it("calculates total savings correctly for multiple tools", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
        { toolId: "copilot", plan: "individual", monthlySpend: 10, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);

    // Cursor: downgrade saves $40/mo, Copilot: optimal saves $0
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.totalYearlySavings).toBe(480);
    expect(result.recommendations.length).toBe(2);
  });

  it("handles all 8 tools without crashing", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
        { toolId: "copilot", plan: "individual", monthlySpend: 10, seats: 1 },
        { toolId: "claude", plan: "pro", monthlySpend: 20, seats: 1 },
        { toolId: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 },
        {
          toolId: "anthropic-api",
          plan: "api-direct",
          monthlySpend: 100,
          seats: 1,
        },
        {
          toolId: "openai-api",
          plan: "api-direct",
          monthlySpend: 100,
          seats: 1,
        },
        { toolId: "gemini", plan: "pro", monthlySpend: 20, seats: 1 },
        { toolId: "windsurf", plan: "pro", monthlySpend: 15, seats: 1 },
      ],
      teamSize: 1,
      useCase: "mixed",
    };

    const result = runAudit(input);

    expect(result.recommendations.length).toBeGreaterThanOrEqual(8);
    expect(result.recommendations.every((r) => r.monthlySavings >= 0)).toBe(
      true
    );
  });

  it("returns zero savings for already-optimal setups", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalYearlySavings).toBe(0);
    expect(result.recommendations[0].type).toBe("already-optimal");
  });

  it("suggests alternative tools based on useCase", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "enterprise", monthlySpend: 200, seats: 2 },
      ],
      teamSize: 2,
      useCase: "writing",
    };

    const result = runAudit(input);
    const altRecs = result.recommendations.filter((r) => r.type === "alternative-tool");

    expect(altRecs.length).toBeGreaterThanOrEqual(1);
    expect(altRecs[0].recommendedAction).toContain("ChatGPT");
  });

  it("does not suggest alternative tools for low spend setups", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "writing",
    };

    const result = runAudit(input);
    const altRecs = result.recommendations.filter((r) => r.type === "alternative-tool");

    expect(altRecs.length).toBe(0);
  });

  it("does not suggest alternative tool that user already has in stack", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "claude", plan: "api-direct", monthlySpend: 200, seats: 1 },
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);
    const altRecs = result.recommendations.filter(
      (r) => r.type === "alternative-tool" && r.toolId === "claude"
    );

    expect(altRecs.length).toBe(0);
  });

  it("suppresses weaker alternative suggestion when downgrade already saves more", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
      ],
      teamSize: 2,
      useCase: "writing",
    };

    const result = runAudit(input);
    const altRecs = result.recommendations.filter((r) => r.type === "alternative-tool");
    const downgradeRecs = result.recommendations.filter((r) => r.type === "downgrade");

    expect(downgradeRecs.length).toBe(1);
    expect(altRecs.length).toBe(0);
  });

  it("generates ISO timestamp in createdAt", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    expect(() => new Date(result.createdAt)).not.toThrow();
    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);
  });
});
