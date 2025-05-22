import { User } from "@/contexts/AuthContext";

// Export User type from the AuthContext

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

// More admin-specific types can be added here
