
import type { User } from "@/contexts/AuthContext";

// Export User type from the AuthContext
export type { User };

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  events: {
    total: number;
    upcoming: number;
    past: number;
  };
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  userGrowthData: {
    month: string;
    users: number;
  }[];
  eventTypeDistribution: {
    category: string;
    count: number;
  }[];
  conversionRates: {
    viewed: number;
    booked: number;
    attended: number;
  };
}

export interface SecurityThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  resolved: boolean;
  ipAddress: string;
  affectedUsers?: number;
}

export interface AdminMetricsProps {
  activeUsers: number;
  totalEvents: number;
  conversionRate: number;
  securityAlertCount: number;
  growthRate?: {
    users?: number;
    events?: number;
    conversion?: number;
    security?: number;
  };
}

export interface SecurityAlert {
  id: number;
  type: 'critical' | 'warning' | 'info';
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
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }[];
}

export interface NewUser {
  name: string;
  email: string;
  country: string;
  status: 'active' | 'premium' | 'suspended';
}
