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

export interface AnalysisResult {
  kpis: KPIData[];
  chartData: ChartDataPoint[];
  eventStartWeek: number;
  marketComparison: MarketComparison[];
  elasticityData: ElasticityDataPoint[];
}
