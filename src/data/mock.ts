/**
 * Mock data for the Prism Counterfactual Pricing Analytics Dashboard.
 *
 * Replace these exports with real API calls or data fetching logic
 * when backend data becomes available. All types are in ./types.ts.
 */

import type {
  PricingEvent,
  Market,
  ControlBundle,
  ModelType,
  ModelData,
  ElasticityDataPoint,
} from "./types";

export const MOCK_EVENTS: PricingEvent[] = [
  {
    id: "1",
    name: "US Black Friday 2025",
    dateRange: "Nov 28 – Dec 2, 2025",
    type: "promo",
    typeLabel: "Promo",
  },
  {
    id: "2",
    name: "LATAM Black Friday 2025",
    dateRange: "Nov 28 – Dec 2, 2025",
    type: "promo",
    typeLabel: "Promo",
  },
  {
    id: "3",
    name: "APAC Black Friday 2025",
    dateRange: "Nov 28 – Dec 2, 2025",
    type: "promo",
    typeLabel: "Promo",
  },
  {
    id: "4",
    name: "EMEA Black Friday 2025",
    dateRange: "Nov 28 – Dec 2, 2025",
    type: "promo",
    typeLabel: "Promo",
  },
];

export const MOCK_MARKETS: Market[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "argentina", label: "Argentina" },
  { value: "colombia", label: "Colombia" },
  { value: "chile", label: "Chile" },
  { value: "spain", label: "Spain" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "netherlands", label: "Netherlands" },
  { value: "poland", label: "Poland" },
  { value: "sweden", label: "Sweden" },
  { value: "norway", label: "Norway" },
  { value: "denmark", label: "Denmark" },
  { value: "finland", label: "Finland" },
  { value: "portugal", label: "Portugal" },
  { value: "italy", label: "Italy" },
  { value: "canada", label: "Canada" },
];

export const MOCK_CONTROL_BUNDLES: ControlBundle[] = [
  {
    id: "latin-america",
    name: "Latin America Cluster",
    markets: ["Brazil", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador"],
  },
  {
    id: "europe-high-gdp",
    name: "High GDP European Markets",
    markets: ["Germany", "France", "United Kingdom", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland"],
    recommended: true,
  },
  {
    id: "english-speaking",
    name: "English-Speaking Markets",
    markets: ["United States", "Canada", "United Kingdom", "Australia", "Ireland", "New Zealand"],
  },
  {
    id: "emerging-markets",
    name: "Emerging Markets",
    markets: ["Poland", "Romania", "Hungary", "Czech Republic", "Portugal", "Greece"],
  },
];

const SHARED_ELASTICITY_DATA: ElasticityDataPoint[] = [
  { price: 80, treatment: 120, control1: 110, control2: 115, control3: 105 },
  { price: 85, treatment: 115, control1: 108, control2: 112, control3: 103 },
  { price: 90, treatment: 110, control1: 105, control2: 108, control3: 100 },
  { price: 95, treatment: 105, control1: 100, control2: 103, control3: 95 },
  { price: 100, treatment: 100, control1: 95, control2: 98, control3: 90 },
  { price: 105, treatment: 95, control1: 88, control2: 92, control3: 83 },
  { price: 110, treatment: 90, control1: 80, control2: 85, control3: 75 },
  { price: 115, treatment: 85, control1: 72, control2: 78, control3: 68 },
  { price: 120, treatment: 80, control1: 65, control2: 70, control3: 60 },
];

export const MOCK_MODEL_DATA: Record<ModelType, ModelData> = {
  gross_adds: {
    chartData: [
      { week: "Week 1", actual: 4200, counterfactual: 4100, weekNum: 1 },
      { week: "Week 2", actual: 4300, counterfactual: 4150, weekNum: 2 },
      { week: "Week 3", actual: 4250, counterfactual: 4200, weekNum: 3 },
      { week: "Week 4", actual: 4400, counterfactual: 4250, weekNum: 4 },
      { week: "Week 5", actual: 5100, counterfactual: 4300, weekNum: 5 },
      { week: "Week 6", actual: 5300, counterfactual: 4350, weekNum: 6 },
      { week: "Week 7", actual: 5200, counterfactual: 4400, weekNum: 7 },
      { week: "Week 8", actual: 5400, counterfactual: 4450, weekNum: 8 },
      { week: "Week 9", actual: 5250, counterfactual: 4500, weekNum: 9 },
      { week: "Week 10", actual: 5350, counterfactual: 4550, weekNum: 10 },
      { week: "Week 11", actual: 5300, counterfactual: 4600, weekNum: 11 },
      { week: "Week 12", actual: 5400, counterfactual: 4650, weekNum: 12 },
    ],
    kpis: {
      primary: { label: "Subscriber Lift", value: "+18.2%", trend: "up", sublabel: "vs. counterfactual" },
      secondary: { label: "Acquisition Rate", value: "+2.1%", trend: "up", sublabel: "conversion impact" },
      tertiary: { label: "Confidence", value: "97%", trend: "up", sublabel: "statistical significance" },
    },
    marketComparison: [
      { name: "United States", actual: 5400, counterfactual: 4650, delta: 16.1, similarity: 88 },
      { name: "Canada", actual: 4850, counterfactual: 4500, delta: 7.8, similarity: 92 },
      { name: "United Kingdom", actual: 5100, counterfactual: 4600, delta: 10.9, similarity: 85 },
      { name: "Australia", actual: 4720, counterfactual: 4450, delta: 6.1, similarity: 90 },
    ],
    elasticityData: SHARED_ELASTICITY_DATA,
  },
  churn: {
    chartData: [
      { week: "Week 1", actual: 2100, counterfactual: 2200, weekNum: 1 },
      { week: "Week 2", actual: 2050, counterfactual: 2250, weekNum: 2 },
      { week: "Week 3", actual: 2150, counterfactual: 2300, weekNum: 3 },
      { week: "Week 4", actual: 2080, counterfactual: 2350, weekNum: 4 },
      { week: "Week 5", actual: 1900, counterfactual: 2400, weekNum: 5 },
      { week: "Week 6", actual: 1850, counterfactual: 2450, weekNum: 6 },
      { week: "Week 7", actual: 1920, counterfactual: 2500, weekNum: 7 },
      { week: "Week 8", actual: 1880, counterfactual: 2550, weekNum: 8 },
      { week: "Week 9", actual: 1950, counterfactual: 2600, weekNum: 9 },
      { week: "Week 10", actual: 1900, counterfactual: 2650, weekNum: 10 },
      { week: "Week 11", actual: 1920, counterfactual: 2700, weekNum: 11 },
      { week: "Week 12", actual: 1880, counterfactual: 2750, weekNum: 12 },
    ],
    kpis: {
      primary: { label: "Churn Reduction", value: "-31.6%", trend: "up", sublabel: "vs. counterfactual" },
      secondary: { label: "Retention Impact", value: "+4.2%", trend: "up", sublabel: "subscriber retention" },
      tertiary: { label: "Confidence", value: "94%", trend: "up", sublabel: "statistical significance" },
    },
    marketComparison: [
      { name: "United States", actual: 1880, counterfactual: 2750, delta: -31.6, similarity: 88 },
      { name: "Canada", actual: 2100, counterfactual: 2500, delta: -16.0, similarity: 92 },
      { name: "United Kingdom", actual: 1950, counterfactual: 2600, delta: -25.0, similarity: 85 },
      { name: "Australia", actual: 2020, counterfactual: 2450, delta: -17.6, similarity: 90 },
    ],
    elasticityData: SHARED_ELASTICITY_DATA,
  },
  auto_renewal: {
    chartData: [
      { week: "Week 1", actual: 1500, counterfactual: 1550, weekNum: 1 },
      { week: "Week 2", actual: 1480, counterfactual: 1600, weekNum: 2 },
      { week: "Week 3", actual: 1520, counterfactual: 1650, weekNum: 3 },
      { week: "Week 4", actual: 1490, counterfactual: 1700, weekNum: 4 },
      { week: "Week 5", actual: 1300, counterfactual: 1750, weekNum: 5 },
      { week: "Week 6", actual: 1250, counterfactual: 1800, weekNum: 6 },
      { week: "Week 7", actual: 1280, counterfactual: 1850, weekNum: 7 },
      { week: "Week 8", actual: 1240, counterfactual: 1900, weekNum: 8 },
      { week: "Week 9", actual: 1290, counterfactual: 1950, weekNum: 9 },
      { week: "Week 10", actual: 1260, counterfactual: 2000, weekNum: 10 },
      { week: "Week 11", actual: 1280, counterfactual: 2050, weekNum: 11 },
      { week: "Week 12", actual: 1250, counterfactual: 2100, weekNum: 12 },
    ],
    kpis: {
      primary: { label: "Auto-Renewal Off Reduction", value: "-40.5%", trend: "up", sublabel: "vs. counterfactual" },
      secondary: { label: "Retention Confidence", value: "+5.8%", trend: "up", sublabel: "renewal commitment" },
      tertiary: { label: "Confidence", value: "96%", trend: "up", sublabel: "statistical significance" },
    },
    marketComparison: [
      { name: "United States", actual: 1250, counterfactual: 2100, delta: -40.5, similarity: 88 },
      { name: "Canada", actual: 1420, counterfactual: 1900, delta: -25.3, similarity: 92 },
      { name: "United Kingdom", actual: 1350, counterfactual: 2000, delta: -32.5, similarity: 85 },
      { name: "Australia", actual: 1380, counterfactual: 1850, delta: -25.4, similarity: 90 },
    ],
    elasticityData: SHARED_ELASTICITY_DATA,
  },
};
