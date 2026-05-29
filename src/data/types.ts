export interface PricingEvent {
  id: string;
  name: string;
  dateRange: string;
  type: "surge" | "promo" | "structural";
  typeLabel: string;
}

export interface Market {
  value: string;
  label: string;
}

export interface ControlBundle {
  id: string;
  name: string;
  markets: string[];
  recommended?: boolean;
}

export interface ChartDataPoint {
  week: string;
  weekNum: number;
  actual: number;
  counterfactual: number;
}

export interface MarketComparison {
  name: string;
  actual: number;
  counterfactual: number;
  delta: number;
  similarity: number;
}

export interface ElasticityDataPoint {
  price: number;
  treatment: number;
  control1: number;
  control2: number;
  control3: number;
}

export interface KPIData {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  sublabel?: string;
}

export type ModelType = "gross_adds" | "churn" | "auto_renewal";

export interface ModelData {
  chartData: ChartDataPoint[];
  kpis: {
    primary: KPIData;
    secondary: KPIData;
    tertiary: KPIData;
  };
  marketComparison: MarketComparison[];
  elasticityData: ElasticityDataPoint[];
}

// ─── Demand-Price Elasticity Dashboard ────────────────────────────────────────

export type Tier = "ad_lite" | "ad_free" | "ultimate";

export interface TierMeta {
  id: Tier;
  label: string;
  shortLabel: string;
}

/**
 * Per (tier, market) demand model. The demand curve is locally linear:
 *   D(p) = baselineSubs * (1 + (basePrice - p) * sensitivity / basePrice)
 * `sensitivity` is the unit-elastic slope coefficient; higher = more price-sensitive.
 * Confidence/sample come from the underlying training data.
 */
export interface ElasticityModel {
  tier: Tier;
  market: string;
  basePrice: number;
  baselineSubs: number;
  sensitivity: number;
  confidence: number;
  sampleSize: number;
}

export interface ElasticityCurvePoint {
  price: number;
  demand: number;
  demandLow: number;
  demandHigh: number;
  revenue: number;
}

export interface ScenarioInput {
  tier: Tier;
  market: string;
  priceDelta: number;
  horizonMonths: number;
}

export interface ScenarioImpact {
  basePrice: number;
  newPrice: number;
  baselineSubs: number;
  projectedSubs: number;
  baselineRevenue: number;
  projectedRevenue: number;
  baselineChurnRate: number;
  projectedChurnRate: number;
  subsDeltaPct: number;
  revenueDeltaPct: number;
  churnDeltaPct: number;
  confidence: number;
}

export interface MarketScenarioResult {
  market: string;
  marketLabel: string;
  basePrice: number;
  newPrice: number;
  subsDeltaPct: number;
  revenueDeltaPct: number;
  similarity: number;
}

export interface SensitivityFactor {
  label: string;
  description: string;
  lowImpactPct: number;
  highImpactPct: number;
}
