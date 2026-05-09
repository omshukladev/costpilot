import type {
  AuditInput,
  AnyPlan,
  Recommendation,
  ToolEntry,
} from "@costpilot/shared";

export interface AuditResultData {
  id: string;
  publicId: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  createdAt: string;
}

export function runAudit(input: AuditInput): AuditResultData {
  const recommendations: Recommendation[] = [];

  for (const tool of input.tools) {
    const recs = analyzeTool(tool, input);
    recommendations.push(...recs);
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalYearlySavings = recommendations.reduce(
    (sum, r) => sum + r.yearlySavings,
    0
  );

  return {
    id: "",
    publicId: "",
    input,
    recommendations,
    totalMonthlySavings,
    totalYearlySavings,
    createdAt: new Date().toISOString(),
  };
}

function analyzeTool(tool: ToolEntry, input: AuditInput): Recommendation[] {
  switch (tool.toolId) {
    case "cursor":
      return analyzeCursor(tool, input);
    case "copilot":
      return analyzeCopilot(tool, input);
    case "claude":
      return analyzeClaude(tool, input);
    case "chatgpt":
      return analyzeChatGPT(tool, input);
    case "anthropic-api":
      return analyzeAnthropicApi(tool, input);
    case "openai-api":
      return analyzeOpenAIApi(tool, input);
    case "gemini":
      return analyzeGemini(tool, input);
    case "windsurf":
      return analyzeWindsurf(tool, input);
  }
}

function optimal(tool: ToolEntry, reason: string): Recommendation {
  return {
    type: "already-optimal",
    toolId: tool.toolId,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: "Current plan looks appropriate",
    reasoning: reason,
    monthlySavings: 0,
    yearlySavings: 0,
  };
}

function downgrade(
  tool: ToolEntry,
  action: string,
  reason: string,
  savingsPerSeat: number
): Recommendation {
  return {
    type: "downgrade",
    toolId: tool.toolId,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedAction: action,
    reasoning: reason,
    monthlySavings: savingsPerSeat * tool.seats,
    yearlySavings: savingsPerSeat * tool.seats * 12,
  };
}

function creditOptimization(
  tool: ToolEntry,
  action: string,
  reason: string,
  savings: number
): Recommendation {
  return {
    type: "credit-optimization",
    toolId: tool.toolId,
    currentPlan: tool.plan as AnyPlan,
    currentSpend: tool.monthlySpend,
    recommendedAction: action,
    reasoning: reason,
    monthlySavings: savings,
    yearlySavings: savings * 12,
  };
}

function alternativeTool(
  tool: ToolEntry,
  action: string,
  reason: string,
  savings: number
): Recommendation {
  return {
    type: "alternative-tool",
    toolId: tool.toolId,
    currentPlan: tool.plan as AnyPlan,
    currentSpend: tool.monthlySpend,
    recommendedAction: action,
    reasoning: reason,
    monthlySavings: savings,
    yearlySavings: savings * 12,
  };
}

const ALT_MIN_MONTHLY_SAVINGS = 25;
const ALT_MIN_SAVINGS_PERCENT = 0.2;
const ALT_MIN_CURRENT_SPEND = 40;
const ALT_BEAT_EXISTING_MARGIN = 15;
const GEMINI_PRO_MONTHLY_USD = 19.99;

// Map use cases to better-suited tools
const useCaseAlternatives: Record<string, { tool: string; reason: string }[]> = {
  coding: [
    { tool: "Cursor or Copilot", reason: "purpose-built for code with autocomplete and inline editing" },
  ],
  writing: [
    { tool: "Claude or ChatGPT", reason: "optimized for long-form content, editing, and prose" },
  ],
  data: [
    { tool: "ChatGPT or Gemini", reason: "strong data analysis and spreadsheet integration" },
  ],
  research: [
    { tool: "Claude or Gemini", reason: "large context windows and structured summarization" },
  ],
  mixed: [
    { tool: "ChatGPT or Claude", reason: "best all-around performance across different task types" },
  ],
};

function maybeBuildAlternativeRecommendation(
  tool: ToolEntry,
  existingRecommendations: Recommendation[],
  action: string,
  reason: string,
  modeledMonthlySpend: number
): Recommendation | null {
  if (tool.monthlySpend < ALT_MIN_CURRENT_SPEND) {
    return null;
  }

  const monthlySavings = Math.round(tool.monthlySpend - modeledMonthlySpend);
  if (monthlySavings <= 0) {
    return null;
  }

  const savingsPercent = monthlySavings / tool.monthlySpend;
  if (
    monthlySavings < ALT_MIN_MONTHLY_SAVINGS ||
    savingsPercent < ALT_MIN_SAVINGS_PERCENT
  ) {
    return null;
  }

  const bestExistingSavings = existingRecommendations.reduce(
    (max, rec) => Math.max(max, rec.monthlySavings),
    0
  );
  if (
    bestExistingSavings > 0 &&
    monthlySavings < bestExistingSavings + ALT_BEAT_EXISTING_MARGIN
  ) {
    return null;
  }

  return alternativeTool(
    tool,
    action,
    `${reason} Modeled alternative spend: $${modeledMonthlySpend}/month for ${tool.seats} seat(s), saving about $${monthlySavings}/month.`,
    monthlySavings
  );
}

// --- Tool analyzers ---

function analyzeCursor(tool: ToolEntry, input: AuditInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const seatCost = tool.monthlySpend / Math.max(tool.seats, 1);

  if (tool.plan === "enterprise" && seatCost > 60 && tool.seats < 50) {
    recs.push(
      downgrade(
        tool,
        "Switch to Business plan at $40/user/month",
        "Enterprise includes concierge onboarding and SSO. For teams under 50, Business covers the same core AI features.",
        seatCost - 40
      )
    );
  } else if (tool.plan === "business" && tool.seats <= 3) {
    recs.push(
      downgrade(
        tool,
        "Switch to Pro plan at $20/user/month",
        "Business adds centralized billing for larger teams. With 3 or fewer users, Pro gives the same AI features at half the cost.",
        20
      )
    );
  } else {
    recs.push(optimal(tool, "Cursor Pro at $20/user/month is right for your team size."));
  }

  // If use case isn't coding, suggest a more suitable tool
  if (input.useCase !== "coding") {
    const alt = useCaseAlternatives[input.useCase]?.[0];
    if (alt) {
      const altRec = maybeBuildAlternativeRecommendation(
        tool,
        recs,
        `Consider ${alt.tool} instead of Cursor for ${input.useCase} tasks`,
        `Cursor is optimized for coding. For ${input.useCase}, ${alt.reason}.`,
        tool.seats * 20
      );
      if (altRec) {
        recs.push(altRec);
      }
    }
  }

  return recs;
}

function analyzeCopilot(tool: ToolEntry, input: AuditInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const seatCost = tool.monthlySpend / Math.max(tool.seats, 1);

  if (tool.plan === "enterprise" && seatCost > 39 && tool.seats < 50) {
    recs.push(
      downgrade(
        tool,
        "Switch to Business plan at $39/user/month",
        "Enterprise adds custom IP indemnification and SAML SSO that many small teams never configure.",
        seatCost - 39
      )
    );
  } else if (tool.plan === "business" && tool.seats <= 3) {
    recs.push(
      downgrade(
        tool,
        "Switch to Individual plan at $10/user/month",
        "Individual gives the same autocomplete features. Business adds org-wide policy management — overkill for 3 or fewer users.",
        29
      )
    );
  } else {
    recs.push(optimal(tool, "GitHub Copilot is reasonably priced for your setup."));
  }

  if (input.useCase !== "coding") {
    const alt = useCaseAlternatives[input.useCase]?.[0];
    if (alt) {
      const altRec = maybeBuildAlternativeRecommendation(
        tool,
        recs,
        `Consider ${alt.tool} instead of Copilot for ${input.useCase} tasks`,
        `Copilot is designed for code autocompletion. For ${input.useCase}, ${alt.reason}.`,
        tool.seats * 20
      );
      if (altRec) {
        recs.push(altRec);
      }
    }
  }

  return recs;
}

function analyzeClaude(tool: ToolEntry, input: AuditInput): Recommendation[] {
  const recs: Recommendation[] = [];

  if (tool.plan === "team" && tool.seats <= 2) {
    recs.push(
      downgrade(tool, "Switch to Pro at $20/month per user", "Team ($30/user/month) adds centralized billing. For 2 or fewer users, Pro covers the same model access and conversation length.", 10)
    );
  } else if (tool.plan === "api-direct" && tool.monthlySpend > 200) {
    recs.push(
      creditOptimization(tool, "Purchase Anthropic API credits through Credex for ~15-30% discount", "At $200+/month API spend, volume discounts or prepaid credits reduce costs significantly vs pay-as-you-go.", Math.round(tool.monthlySpend * 0.15))
    );
  } else if (tool.plan === "pro" && tool.monthlySpend > 100) {
    recs.push({
      type: "plan-mismatch",
      toolId: "claude",
      currentPlan: "pro",
      currentSpend: tool.monthlySpend,
      recommendedAction: "Consider Max plan at $100/month for heavy usage",
      reasoning: "If you're spending over $100/month on Pro, you may hit usage limits. Max gives 5x more usage for $100/month flat.",
      monthlySavings: 0,
      yearlySavings: 0,
    });
  } else {
    recs.push(optimal(tool, "Your Claude plan matches your usage profile."));
  }

  // If use case is coding, suggest a dedicated coding tool
  if (input.useCase === "coding") {
    const altRec = maybeBuildAlternativeRecommendation(
      tool,
      recs,
      "Consider Cursor Pro at $20/user/month for coding tasks",
      "Claude is general-purpose AI. For dedicated coding workflows, Cursor offers stronger IDE-native autocomplete and editing.",
      tool.seats * 20
    );
    if (altRec) {
      recs.push(altRec);
    }
  }

  return recs;
}

function analyzeChatGPT(tool: ToolEntry, input: AuditInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const seatCost = tool.monthlySpend / Math.max(tool.seats, 1);

  if (tool.plan === "enterprise" && tool.seats <= 10) {
    recs.push(downgrade(tool, "Switch to Team plan at $30/user/month", "Enterprise (~$60/user/month) adds SAML SSO. For under 10 users, Team covers most needs at half the cost.", seatCost - 30));
  } else if (tool.plan === "api-direct" && tool.monthlySpend > 200) {
    recs.push(creditOptimization(tool, "Purchase OpenAI API credits through Credex for discounted rates", "At $200+/month API spend, prepaid credits can reduce costs by 15-30%.", Math.round(tool.monthlySpend * 0.15)));
  } else {
    recs.push(optimal(tool, "ChatGPT pricing is competitive for your needs."));
  }

  if (input.useCase === "coding") {
    const altRec = maybeBuildAlternativeRecommendation(
      tool,
      recs,
      "Consider Cursor Pro at $20/user/month for coding tasks",
      "ChatGPT is a broad assistant, while Cursor is purpose-built for coding with inline edits and IDE workflow support.",
      tool.seats * 20
    );
    if (altRec) {
      recs.push(altRec);
    }
  }

  return recs;
}

function analyzeAnthropicApi(tool: ToolEntry, _input: AuditInput): Recommendation[] {
  if (tool.monthlySpend > 200) {
    return [
      creditOptimization(
        tool,
        "Purchase Anthropic credits through Credex for ~15-30% discount",
        "At $200+/month, you qualify for volume pricing. Credex offers discounted credits sourced from over-forecasted commitments.",
        Math.round(tool.monthlySpend * 0.15)
      ),
    ];
  }

  return [optimal(tool, "Under $200/month, pay-as-you-go API pricing is fine.")];
}

function analyzeOpenAIApi(tool: ToolEntry, _input: AuditInput): Recommendation[] {
  if (tool.monthlySpend > 200) {
    return [
      creditOptimization(
        tool,
        "Purchase OpenAI credits through Credex for ~15-30% discount",
        "At $200+/month, prepaid credits reduce your effective rate vs standard API pricing.",
        Math.round(tool.monthlySpend * 0.15)
      ),
    ];
  }

  return [optimal(tool, "Under $200/month, standard API pricing is reasonable.")];
}

function analyzeGemini(tool: ToolEntry, _input: AuditInput): Recommendation[] {
  const seatCost = tool.monthlySpend / Math.max(tool.seats, 1);

  if (tool.plan === "ultra" && seatCost > 30) {
    return [
      downgrade(
        tool,
        "Consider Gemini Pro at $19.99/user/month",
        "Ultra adds advanced reasoning capabilities your use case may not need. Pro offers strong performance at lower cost.",
        seatCost - GEMINI_PRO_MONTHLY_USD
      ),
    ];
  }

  return [optimal(tool, "Gemini offers competitive pricing with strong free tier options.")];
}

function analyzeWindsurf(tool: ToolEntry, input: AuditInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const seatCost = tool.monthlySpend / Math.max(tool.seats, 1);

  if (tool.plan === "enterprise" && tool.seats <= 5) {
    recs.push(downgrade(tool, "Switch to Teams plan instead of Enterprise", "Enterprise adds dedicated support. For under 5 users, Teams covers all core features.", seatCost - 35));
  } else if (tool.plan === "pro" && tool.seats === 1 && tool.monthlySpend > 15) {
    recs.push({
      type: "plan-mismatch",
      toolId: "windsurf",
      currentPlan: "pro",
      currentSpend: tool.monthlySpend,
      recommendedAction: "Confirm you're on the correct Pro plan at $15/user/month",
      reasoning: "Windsurf Pro is $15/user/month. Paying more may mean you're on a legacy plan.",
      monthlySavings: tool.monthlySpend - 15,
      yearlySavings: (tool.monthlySpend - 15) * 12,
    });
  } else {
    recs.push(optimal(tool, "Windsurf pricing is competitive for your setup."));
  }

  if (input.useCase !== "coding") {
    const altRec = maybeBuildAlternativeRecommendation(
      tool,
      recs,
      `Consider ChatGPT Plus or Claude Pro for ${input.useCase} tasks`,
      "Windsurf is designed for coding. For non-coding workflows, general assistants are often a better fit at lower cost.",
      tool.seats * 20
    );
    if (altRec) {
      recs.push(altRec);
    }
  }

  return recs;
}
