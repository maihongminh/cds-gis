// src/types/ai.ts

export type AiMessageRole = "user" | "assistant" | "system";

export type AiInsightType =
  | "summary"
  | "risk"
  | "opportunity"
  | "anomaly"
  | "forecast"
  | "recommendation";

export type AiInsightSeverity = "info" | "low" | "medium" | "high";

export type AiPromptCategory =
  | "budget"
  | "administration"
  | "agriculture"
  | "emergency"
  | "tasks"
  | "dataQuality"
  | "socioEconomic";

export type AiIntent =
  | "budgetSummary"
  | "economicOverview"
  | "administrativePerformance"
  | "cropProduction"
  | "emergencyAlerts"
  | "overdueTasks"
  | "dataCompletion"
  | "socioEconomicProgress"
  | "generalSummary"
  | "restrictedData";

export interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
  isDemo: true;
}

export interface AiSuggestedPrompt {
  id: string;
  category: AiPromptCategory;
  label: string;
  prompt: string;
}

export interface AiMetricReference {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  trendValue?: number;
  trendDirection?: "up" | "down" | "stable";
  sourceRoute?: string;
}

export interface AiInsight {
  id: string;
  type: AiInsightType;
  severity: AiInsightSeverity;
  title: string;
  summary: string;
  detail?: string;
  relatedDomains: string[];
  relatedIndicatorIds: string[];
  metrics: AiMetricReference[];
  suggestedActions: string[];
  confidenceLabel: "Mô phỏng" | "Thấp" | "Trung bình";
  createdAt: string;
  isDemo: true;
}

export interface AiForecastItem {
  id: string;
  topic: string;
  metricLabel: string;
  currentValue: number;
  projectedValue: number;
  unit: string;
  horizonLabel: string;
  basis: string;
  confidenceLabel: "Mô phỏng" | "Thấp" | "Trung bình";
  isDemo: true;
}

export interface AiResponseSection {
  id: string;
  type:
    | "summary"
    | "metrics"
    | "analysis"
    | "risk"
    | "recommendation"
    | "sources"
    | "followUp";
  title: string;
  content?: string;
  metrics?: AiMetricReference[];
  items?: string[];
}

export interface AiMockResponse {
  id: string;
  intent: AiIntent;
  title: string;
  sections: AiResponseSection[];
  relatedRoutes: string[];
  createdAt: string;
  isDemo: true;
}
