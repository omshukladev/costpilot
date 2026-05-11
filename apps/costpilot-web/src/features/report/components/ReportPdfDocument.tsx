import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PublicReport, Recommendation } from "@costpilot/shared";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#050505",
    color: "#f5f5f5",
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brand: {
    color: "#34d399",
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 8,
    textAlign: "right",
    lineHeight: 1.4,
  },
  hero: {
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.18)",
    backgroundColor: "#0b0b0b",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subcopy: {
    color: "#a1a1aa",
    fontSize: 10,
    lineHeight: 1.5,
    maxWidth: "78%",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  metric: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0a0a0a",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricLabel: {
    color: "#8b8b96",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#f8fafc",
  },
  metricValueGreen: {
    fontSize: 18,
    fontWeight: 700,
    color: "#86efac",
  },
  sectionTitle: {
    color: "#6ee7b7",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 14,
  },
  primaryCard: {
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.24)",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 16,
    padding: 14,
  },
  cardTitle: {
    fontSize: 12,
    color: "#f8fafc",
    fontWeight: 700,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#a1a1aa",
  },
  bullet: {
    fontSize: 9,
    color: "#d1d5db",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  twoCol: {
    flexDirection: "row",
    gap: 10,
  },
  col: {
    flex: 1,
  },
  spacer: {
    height: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  tableLeft: {
    flex: 1,
  },
  tableRight: {
    width: 72,
    textAlign: "right",
    color: "#86efac",
    fontSize: 9,
    fontWeight: 700,
  },
  tableLabel: {
    fontSize: 9,
    color: "#f8fafc",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#71717a",
    fontSize: 8,
  },
});

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function recommendationLabel(rec: Recommendation) {
  return rec.toolId.replace("-", " ");
}

export function ReportPdfDocument({ report }: { report: PublicReport }) {
  const currentSpend = report.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const optimizedSpend = Math.max(0, currentSpend - report.totalMonthlySavings);
  const sortedRecommendations = [...report.recommendations].sort((a, b) => b.monthlySavings - a.monthlySavings);
  const primaryRecommendation = sortedRecommendations.find((rec) => rec.monthlySavings > 0);
  const secondaryRecommendations = sortedRecommendations.filter((rec) => rec.monthlySavings > 0).slice(1, 4);
  const hasSavings = report.totalMonthlySavings > 0;

  return (
    <Document
      title={`CostPilot Report — ${report.publicId.slice(0, 8)}`}
      author="CostPilot"
      subject="AI spend audit report"
      creator="CostPilot"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>CostPilot • Public report</Text>
          <Text style={styles.meta}>
            Report ID: {report.publicId.slice(0, 8)}
            {"\n"}
            Generated: {new Date(report.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>AI Spend Intelligence Report</Text>
          <Text style={styles.subcopy}>
            Executive summary of tooling efficiency, spend exposure, and the highest-value optimization path for this team.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Monthly savings</Text>
              <Text style={styles.metricValueGreen}>{formatMoney(report.totalMonthlySavings)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Annualized impact</Text>
              <Text style={styles.metricValue}>{formatMoney(report.totalYearlySavings)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Current spend</Text>
              <Text style={styles.metricValue}>{formatMoney(currentSpend)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Optimized spend</Text>
              <Text style={styles.metricValue}>{formatMoney(optimizedSpend)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Executive summary</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{hasSavings ? "Optimization opportunity detected" : "Well-optimized stack"}</Text>
              <Text style={styles.cardText}>{report.summary}</Text>
            </View>

            <View style={styles.spacer} />

            <Text style={styles.sectionTitle}>Primary recommendation</Text>
            <View style={styles.primaryCard}>
              <Text style={styles.cardTitle}>{primaryRecommendation ? recommendationLabel(primaryRecommendation) : "No major action required"}</Text>
              <Text style={styles.cardText}>
                {primaryRecommendation ? primaryRecommendation.recommendedAction : "No material waste detected."}
              </Text>
              {primaryRecommendation && (
                <>
                  <View style={styles.spacer} />
                  <Text style={styles.bullet}>• {primaryRecommendation.reasoning}</Text>
                  <Text style={styles.bullet}>• {formatMoney(primaryRecommendation.monthlySavings)} monthly impact</Text>
                  <Text style={styles.bullet}>• {formatMoney(primaryRecommendation.yearlySavings)} annualized impact</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Report snapshot</Text>
            <View style={styles.card}>
              <Text style={styles.bullet}>• Tools analyzed: {report.tools.length}</Text>
              <Text style={styles.bullet}>• Savings signal: {hasSavings ? "Actionable" : "Low"}</Text>
              <Text style={styles.bullet}>• Public-safe sharing: Enabled</Text>
              <Text style={styles.bullet}>• Confidence: High</Text>
            </View>

            <View style={styles.spacer} />

            <Text style={styles.sectionTitle}>Spend allocation</Text>
            <View style={styles.card}>
              {report.tools
                .slice()
                .sort((a, b) => b.monthlySpend - a.monthlySpend)
                .slice(0, 5)
                .map((tool) => (
                  <View key={`${tool.toolId}-${tool.plan}`} style={styles.tableRow}>
                    <View style={styles.tableLeft}>
                      <Text style={styles.tableLabel}>{tool.toolId.replace("-", " ")}</Text>
                      <Text style={styles.cardText}>{tool.plan} • {tool.seats} seat(s)</Text>
                    </View>
                    <Text style={styles.tableRight}>{formatMoney(tool.monthlySpend)}</Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>CostPilot • Public report</Text>
          <Text style={styles.meta}>
            Continued
            {"\n"}
            {report.publicId.slice(0, 8)}
          </Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Secondary opportunities</Text>
            <View style={styles.card}>
              {secondaryRecommendations.length > 0 ? (
                secondaryRecommendations.map((rec) => (
                  <View key={`${rec.toolId}-${rec.type}`} style={{ marginBottom: 8 }}>
                    <Text style={styles.cardTitle}>{recommendationLabel(rec)}</Text>
                    <Text style={styles.cardText}>{rec.recommendedAction}</Text>
                    <Text style={styles.bullet}>• {rec.reasoning}</Text>
                    <Text style={styles.bullet}>• {formatMoney(rec.monthlySavings)} monthly impact</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.cardText}>No additional savings opportunities detected beyond the primary action.</Text>
              )}
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.sectionTitle}>AI briefing</Text>
            <View style={styles.card}>
              <Text style={styles.bullet}>• Key finding: {primaryRecommendation?.recommendedAction || "No high-impact changes detected"}</Text>
              <Text style={styles.bullet}>• Waste detected: {formatMoney(report.totalMonthlySavings)} monthly recoverable spend</Text>
              <Text style={styles.bullet}>• Optimization path: Consolidate overlap, downgrade oversized plans, then re-audit</Text>
              <Text style={styles.bullet}>• Model summary: {report.summary}</Text>
            </View>

            <View style={styles.spacer} />

            <Text style={styles.sectionTitle}>Share note</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                This report is public-safe and excludes sensitive company details. It is suitable for stakeholder sharing and internal review.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>CostPilot</Text>
          <Text>Executive AI spend intelligence</Text>
        </View>
      </Page>
    </Document>
  );
}
