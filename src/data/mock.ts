/**
 * Mock data for the Stakeholder Analytics Dashboard.
 *
 * Replace these exports with real API calls or data fetching logic
 * when backend data becomes available. The types are defined in ./types.ts
 * and all components consume data through these contracts.
 */

import type {
  PricingEvent,
  Market,
  ControlBundle,
  AnalysisResult,
} from "./types";

export const MOCK_EVENTS: PricingEvent[] = [
  {
    id: "1",
    name: "Q3 2022 Peak Season Surcharge",
    dateRange: "Jul 15 – Sep 30, 2022",
    type: "surge",
    typeLabel: "Surge",
  },
  {
    id: "2",
    name: "Holiday Promotional Campaign",
    dateRange: "Nov 20 – Dec 25, 2022",
    type: "promo",
    typeLabel: "Promo",
  },
  {
    id: "3",
    name: "Base Rate Restructuring",
    dateRange: "Jan 1 – Mar 31, 2023",
    type: "structural",
    typeLabel: "Structural",
  },
  {
    id: "4",
    name: "Summer Travel Flash Sale",
    dateRange: "May 1 – Jun 15, 2023",
    type: "promo",
    typeLabel: "Promo",
  },
];

export const MOCK_MARKETS: Market[] = [
  { value: "chicago", label: "Chicago Metro" },
  { value: "dallas", label: "Dallas-Fort Worth" },
  { value: "atlanta", label: "Atlanta Metro" },
  { value: "phoenix", label: "Phoenix Area" },
  { value: "denver", label: "Denver Region" },
  { value: "miami", label: "Miami Metro" },
  { value: "seattle", label: "Seattle Area" },
  { value: "boston", label: "Boston Metro" },
];

export const MOCK_CONTROL_BUNDLES: ControlBundle[] = [
  {
    id: "midwest",
    name: "Midwest Cluster",
    markets: [
      "Detroit",
      "Minneapolis",
      "Cleveland",
      "Indianapolis",
      "Milwaukee",
      "Kansas City",
      "Columbus",
      "Cincinnati",
      "St. Louis",
      "Omaha",
      "Madison",
      "Des Moines",
    ],
  },
  {
    id: "similar-size",
    name: "Similar Size Markets",
    markets: [
      "Philadelphia",
      "Phoenix",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "Jacksonville",
    ],
  },
  {
    id: "custom",
    name: "Custom Selection",
    markets: ["Boston", "Denver", "Portland", "Nashville", "Charlotte"],
  },
];

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  kpis: [
    {
      label: "Estimated Price Lift",
      value: "+8.5%",
      trend: "up",
      sublabel: "vs. counterfactual",
    },
    {
      label: "Elasticity Coefficient",
      value: "-1.42",
      trend: "neutral",
      sublabel: "demand sensitivity",
    },
    {
      label: "Confidence Interval",
      value: "95%",
      trend: "up",
      sublabel: "statistical significance",
    },
  ],
  eventStartWeek: 5,
  chartData: [
    { week: "Week 1", weekNum: 1, actual: 89.5, counterfactual: 88.2 },
    { week: "Week 2", weekNum: 2, actual: 90.1, counterfactual: 89.0 },
    { week: "Week 3", weekNum: 3, actual: 91.2, counterfactual: 90.5 },
    { week: "Week 4", weekNum: 4, actual: 92.8, counterfactual: 91.8 },
    { week: "Week 5", weekNum: 5, actual: 95.5, counterfactual: 92.5 },
    { week: "Week 6", weekNum: 6, actual: 98.2, counterfactual: 93.2 },
    { week: "Week 7", weekNum: 7, actual: 102.5, counterfactual: 94.0 },
    { week: "Week 8", weekNum: 8, actual: 105.8, counterfactual: 94.8 },
    { week: "Week 9", weekNum: 9, actual: 103.2, counterfactual: 95.5 },
    { week: "Week 10", weekNum: 10, actual: 100.5, counterfactual: 96.0 },
    { week: "Week 11", weekNum: 11, actual: 98.8, counterfactual: 96.5 },
    { week: "Week 12", weekNum: 12, actual: 97.2, counterfactual: 97.0 },
  ],
  marketComparison: [
    { name: "Detroit", actual: 102.5, counterfactual: 94.0, delta: 9.0, similarity: 94 },
    { name: "Minneapolis", actual: 98.8, counterfactual: 93.2, delta: 6.0, similarity: 91 },
    { name: "Cleveland", actual: 95.2, counterfactual: 92.5, delta: 2.9, similarity: 88 },
    { name: "Indianapolis", actual: 99.5, counterfactual: 93.8, delta: 6.1, similarity: 87 },
    { name: "Milwaukee", actual: 97.8, counterfactual: 91.5, delta: 6.9, similarity: 85 },
    { name: "Kansas City", actual: 96.2, counterfactual: 92.0, delta: 4.6, similarity: 83 },
  ],
  elasticityData: [
    { price: 80, treatment: 120, control1: 110, control2: 115, control3: 105 },
    { price: 85, treatment: 115, control1: 108, control2: 112, control3: 103 },
    { price: 90, treatment: 110, control1: 105, control2: 108, control3: 100 },
    { price: 95, treatment: 105, control1: 100, control2: 103, control3: 95 },
    { price: 100, treatment: 100, control1: 95, control2: 98, control3: 90 },
    { price: 105, treatment: 95, control1: 88, control2: 92, control3: 83 },
    { price: 110, treatment: 90, control1: 80, control2: 85, control3: 75 },
    { price: 115, treatment: 85, control1: 72, control2: 78, control3: 68 },
    { price: 120, treatment: 80, control1: 65, control2: 70, control3: 60 },
  ],
};
