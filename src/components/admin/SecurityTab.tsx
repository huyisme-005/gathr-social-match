
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { SecurityAlert } from "@/types/admin"; // We'll create this type later

interface SecurityTabProps {
  securityAlerts: SecurityAlert[];
  onInvestigate: (alert: SecurityAlert) => void;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ 
  securityAlerts, 
  onInvestigate, 
  onGenerateReport,
  isGeneratingReport 
}) => {
  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Center</CardTitle>
          <CardDescription>Monitor and manage platform security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Active Alerts</h3>
              <div className="border rounded-md divide-y">
                {securityAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`p-4 ${
                      alert.type === 'critical' ? 'bg-red-50' : 
                      alert.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mr-2 mt-0.5 ${
                        alert.type === 'critical' ? 'text-red-500' : 
                        alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                      }`}>⚠️</div>
                      <div>
                        <h4 className={`font-medium ${
                          alert.type === 'critical' ? 'text-red-700' : 
                          alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                        }`}>{alert.title}</h4>
                        <p className={`text-sm ${
                          alert.type === 'critical' ? 'text-red-600' : 
                          alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                        }`}>{alert.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-xs ${
                            alert.type === 'critical' ? 'text-red-600' : 
                            alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                          }`}>{alert.timestamp}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7"
                            onClick={() => onInvestigate(alert)}
                          >
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Security Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Login Activity</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Successful logins (24h)</span>
                      <span className="font-medium">428</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Failed logins (24h)</span>
                      <span className="font-medium">32</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Password resets (24h)</span>
                      <span className="font-medium">12</span>
                    </li>
                  </ul>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Account Security</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>2FA enabled users</span>
                      <span className="font-medium">42%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Social login usage</span>
                      <span className="font-medium">68%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Email verification rate</span>
                      <span className="font-medium">94%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gathr-coral hover:bg-gathr-coral/90 flex items-center gap-2"
            onClick={onGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? "Generating..." : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate Full Security Report</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecurityTab;
