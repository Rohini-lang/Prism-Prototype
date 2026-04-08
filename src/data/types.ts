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
