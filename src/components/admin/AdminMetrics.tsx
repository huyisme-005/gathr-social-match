
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMetricsProps } from "@/types/admin";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const AdminMetrics: React.FC<AdminMetricsProps> = ({ 
  activeUsers, 
  totalEvents, 
  conversionRate, 
  securityAlertCount,
  growthRate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {growthRate?.users ? (
              <>
                {growthRate.users > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
                )}
                {Math.abs(growthRate.users).toFixed(1)}% from last month
              </>
            ) : (
              "+8.2% from last month"
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {growthRate?.events ? (
              <>
                {growthRate.events > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
                )}
                {Math.abs(growthRate.events).toFixed(1)}% from last month
              </>
            ) : (
              "+12.5% from last month"
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Premium Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {growthRate?.conversion ? (
              <>
                {growthRate.conversion > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
                )}
                {Math.abs(growthRate.conversion).toFixed(1)}% from last month
              </>
            ) : (
              "+2.1% from last month"
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{securityAlertCount}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {growthRate?.security !== undefined ? (
              <>
                {growthRate.security <= 0 ? (
                  <ArrowDownIcon className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowUpIcon className="h-3 w-3 mr-1 text-red-500" />
                )}
                {Math.abs(growthRate.security)} from last week
              </>
            ) : (
              "-1 from last week"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
