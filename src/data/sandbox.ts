/**
 * Mock data for the dark-themed Counterfactual sandbox page.
 * Independent from the production mock data so the sandbox can evolve freely.
 */

export interface SandboxEvent {
  id: string;
  name: string;
  typeLabel: string; // "promo", "structural", etc.
  dateRange: string;
  isPriceChange?: boolean;
}

export interface SandboxKPI {
  label: string;
  value: string;
  helper: string;
  trend: "up" | "down" | "neutral";
  passes?: boolean;
}

export interface SandboxChartPoint {
  date: string;
  actual: number;
  counterfactual: number;
}

export type EnsembleVerdict = "credible" | "provisional" | "rejected";
export type EnsembleRole = "in_pool" | "borderline" | "excluded";

export interface EnsembleRow {
  candidate: string;
  region: string;
  identifier: string;
  verdict: EnsembleVerdict;
  role: EnsembleRole;
  liftPct: number;
  beta: number;
  standardError: number;
  observations: number;
}

export interface SandboxScenario {
  id: string;
  name: string;
  dateRange: string;
  treatmentMarket: string;
  controlGroupLabel: string;
  eventStartDate: string;
  kpis: SandboxKPI[];
  qualitySummary: string;
  qualityPassed: boolean;
  chart: SandboxChartPoint[];
  ensemble: EnsembleRow[];
}

// ── Event list ───────────────────────────────────────────────────────────────

export const SANDBOX_EVENTS: SandboxEvent[] = [
  { id: "argentina-price-2025",  name: "Argentina Price Increase 2025", typeLabel: "promo", dateRange: "Mar 18, 2025 – Apr 18, 2025", isPriceChange: true },
  { id: "australia-bf-2025",     name: "Australia Black Friday 2025",   typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "denmark-bf-2025",       name: "Denmark Black Friday 2025",     typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "finland-bf-2025",       name: "Finland Black Friday 2025",     typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "netherlands-bf-2025",   name: "Netherlands Black Friday 2025", typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 1, 2025" },
  { id: "norway-bf-2025",        name: "Norway Black Friday 2025",      typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "poland-bf-2025",        name: "Poland Black Friday 2025",      typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 1, 2025" },
  { id: "portugal-bf-2025",      name: "Portugal Black Friday 2025",    typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "spain-bf-2025",         name: "Spain Black Friday 2025",       typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "sweden-bf-2025",        name: "Sweden Black Friday 2025",      typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 24, 2025" },
  { id: "us-bf-2025",            name: "US Black Friday 2025",          typeLabel: "promo", dateRange: "Nov 24, 2025 – Dec 1, 2025" },
];

// ── Daily series generator ───────────────────────────────────────────────────

const ARG_DATES: string[] = (() => {
  // Feb 18 – Apr 18, 2025 (daily). Event start = Mar 18.
  const out: string[] = [];
  const start = new Date(Date.UTC(2025, 1, 18));
  for (let i = 0; i < 60; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const day = d.getUTCDate();
    out.push(`${month} ${day}`);
  }
  return out;
})();

function seeded(idx: number, salt: number): number {
  const x = Math.sin(idx * 0.731 + salt * 1.913) * 10000;
  return x - Math.floor(x);
}

const ARG_CHART: SandboxChartPoint[] = ARG_DATES.map((date, i) => {
  const eventDayIdx = 28; // Mar 18 = index 28
  const isPostEvent = i >= eventDayIdx;

  // Baseline ~2.4k with mild weekly seasonality.
  const seasonal = Math.sin(i / 7 * Math.PI * 2) * 280;
  const noise = (seeded(i, 1) - 0.5) * 380;
  const counterfactual = 2400 + seasonal + noise;

  // Actual: closely tracks counterfactual pre-event, then a clear drop with
  // occasional spikes (paydays / one-off promos that didn't fire here).
  let actual = counterfactual + (seeded(i, 7) - 0.5) * 220;
  if (isPostEvent) {
    const decay = Math.min(1, (i - eventDayIdx) / 18);
    actual = counterfactual * (1 - 0.18 * decay) + (seeded(i, 13) - 0.5) * 280;
    // Insert a couple of organic spikes around late-March / mid-April.
    if (i === 38 || i === 53 || i === 54) actual = counterfactual * 1.55 + seeded(i, 19) * 600;
  }

  return {
    date,
    actual: Math.round(actual),
    counterfactual: Math.round(counterfactual),
  };
});

// ── Pooled ensemble ──────────────────────────────────────────────────────────

const ARG_ENSEMBLE: EnsembleRow[] = [
  { candidate: "BO", region: "LATAM", identifier: "country_bo · country", verdict: "provisional", role: "in_pool", liftPct:  -2.4, beta: -0.0508, standardError: 0.0391, observations: 59 },
  { candidate: "CL", region: "LATAM", identifier: "country_cl · country", verdict: "provisional", role: "in_pool", liftPct:  -9.2, beta: -0.1187, standardError: 0.0415, observations: 59 },
  { candidate: "PT", region: "EMEA",  identifier: "country_pt · country", verdict: "provisional", role: "in_pool", liftPct: -11.0, beta: -0.1309, standardError: 0.0488, observations: 59 },
  { candidate: "UY", region: "LATAM", identifier: "country_uy · country", verdict: "provisional", role: "in_pool", liftPct:  -6.3, beta: -0.1002, standardError: 0.0377, observations: 59 },
  { candidate: "PY", region: "LATAM", identifier: "country_py · country", verdict: "credible",    role: "in_pool", liftPct:  -8.1, beta: -0.1148, standardError: 0.0342, observations: 59 },
  { candidate: "PE", region: "LATAM", identifier: "country_pe · country", verdict: "credible",    role: "in_pool", liftPct:  -5.7, beta: -0.0871, standardError: 0.0298, observations: 59 },
  { candidate: "EC", region: "LATAM", identifier: "country_ec · country", verdict: "provisional", role: "borderline", liftPct: -3.0, beta: -0.0612, standardError: 0.0512, observations: 59 },
  { candidate: "MX", region: "LATAM", identifier: "country_mx · country", verdict: "rejected",    role: "excluded", liftPct: -1.1, beta: -0.0240, standardError: 0.0721, observations: 59 },
];

// ── Argentina scenario (primary sandbox view) ────────────────────────────────

export const ARGENTINA_SCENARIO: SandboxScenario = {
  id:                 "argentina-price-2025",
  name:               "Argentina Price Increase 2025",
  dateRange:          "Mar 18, 2025 – Apr 18, 2025",
  treatmentMarket:    "Argentina",
  controlGroupLabel:  "ror",
  eventStartDate:     "Mar 18",
  qualityPassed:      true,
  qualitySummary:     "Counterfactual accuracy and the spurious-effect check both meet thresholds for this event and control group. The impact figures below can be trusted for reporting.",
  kpis: [
    { label: "Gross Adds Lift",          value: "−11.6%",  helper: "2.1K actual vs 2.3K CF (daily avg)", trend: "down" },
    { label: "Total Incremental",        value: "−8,138",  helper: "Post Period",                       trend: "down" },
    { label: "Counterfactual Accuracy",  value: "89.6%",   helper: "Meets threshold",                   trend: "neutral", passes: true },
    { label: "Spurious Effect Check",    value: "−3.7%",   helper: "Meets threshold",                   trend: "neutral", passes: true },
  ],
  chart: ARG_CHART,
  ensemble: ARG_ENSEMBLE,
};
