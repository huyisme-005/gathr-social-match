
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminMetricsProps {
  activeUsers: number;
  totalEvents: number;
  conversionRate: number;
  securityAlertCount: number;
}

const AdminMetrics: React.FC<AdminMetricsProps> = ({ 
  activeUsers, 
  totalEvents, 
  conversionRate, 
  securityAlertCount 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+8.2% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Premium Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground">+2.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{securityAlertCount}</div>
          <p className="text-xs text-muted-foreground">-1 from last week</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
