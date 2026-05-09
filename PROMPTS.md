# Prompts

## AI Summary Prompt

**Status**: ✅ Implemented in `controllers/summary.ts`

The prompt below is sent to Gemini 2.0 Flash. If the API key is missing or the API call fails, a templated fallback is used instead.

### Prompt

```
You are a financial analyst specializing in AI tool spend optimization.

Given the following audit data, write a ~100 word personalized summary for the user.

Audit input: {{tools_input}}
Recommendations: {{recommendations}}
Total monthly savings: ${{monthly_savings}}

Write in a professional, helpful tone. Do not make up specific numbers that aren't provided.
If there are no savings opportunities, acknowledge that the user's current setup is efficient.
```

### Fallback Template (used if API fails)

```
Based on your AI tooling audit, we analyzed {{tool_count}} tool(s) across your team.
We identified {{savings_opportunities}} area(s) where you could reduce spending,
with total potential savings of ${{monthly_savings}} per month (${{yearly_savings}} per year).
{{#if has_savings}}
For significant savings, consider purchasing AI credits through Credex at discounted rates.
{{else}}
Your current setup appears well-optimized for your team size and usage.
{{/if}}
```

### Design Notes

- The prompt instructs the AI to NOT fabricate numbers — only use provided data
- The fallback template ensures the feature works even if the API is down
- The summary is the ONLY AI feature; audit calculations are entirely deterministic
