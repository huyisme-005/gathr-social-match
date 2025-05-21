// User types
export interface User {
  id: number | string;
  name: string;
  email: string;
  country: string;
  status: "active" | "premium" | "suspended";
  tier?: string;
  isCorporate?: boolean;
  personalityTags?: string[];
  hasCompletedPersonalityTest?: boolean;
}

export interface NewUser {
  name: string;
  email: string;
  country: string;
  status: "active" | "premium" | "suspended";
}

// Security types
export interface SecurityAlert {
  id: number;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
}

export interface SecurityReport {
  generatedAt: string;
  summary: {
    totalAlerts: number;
    criticalAlerts: number;
    highAlerts: number;
    mediumAlerts: number;
    resolvedAlerts: number;
  };
  loginActivity: {
    successfulLogins: number;
    failedLogins: number;
    suspiciousLogins: number;
  };
  vulnerabilities: {
    severity: "high" | "medium" | "low";
    description: string;
    recommendation: string;
  }[];
}

// Analytics types
export interface AnalyticsData {
  userGrowthData: { month: string; users: number }[];
  eventData: { name: string; value: number }[];
  demographicData: { age: string; users: number }[];
  usersByCountry: { country: string; users: number }[];
}

// Admin metrics types
export interface AdminMetricsProps {
  activeUsers: number;
  totalEvents: number;
  conversionRate: number;
  securityAlertCount: number;
  growthRate?: {
    users: number;
    events: number;
    conversion: number;
    security: number;
  };
}
