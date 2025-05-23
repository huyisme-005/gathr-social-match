/**
 * SecurityReportDialog Component
 * This component displays a dialog for viewing a security report.
 * @author Huy Le (huyisme-005)
 * @organization Gathr
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SecurityReport } from "@/types/admin";

interface SecurityReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: SecurityReport | null;
}

const SecurityReportDialog: React.FC<SecurityReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  reportData 
}) => {
  if (!reportData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Security Report</DialogTitle>
          <DialogDescription>
            Generated on {reportData?.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{reportData.summary.criticalAlerts}</div>
                <div className="text-sm">Critical Alerts</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-amber-600">{reportData.summary.highAlerts}</div>
                <div className="text-sm">High Alerts</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.summary.mediumAlerts}</div>
                <div className="text-sm">Medium Alerts</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Login Activity</h3>
            <div className="border rounded-md p-4">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Successful logins (24h)</span>
                  <span className="font-medium">{reportData.loginActivity.successfulLogins}</span>
                </li>
                <li className="flex justify-between">
                  <span>Failed logins (24h)</span>
                  <span className="font-medium text-amber-600">{reportData.loginActivity.failedLogins}</span>
                </li>
                <li className="flex justify-between">
                  <span>Suspicious logins (24h)</span>
                  <span className="font-medium text-red-600">{reportData.loginActivity.suspiciousLogins}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Vulnerabilities</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-3 px-4 text-left">Severity</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.vulnerabilities.map((vuln, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vuln.severity === 'high' ? 'bg-red-100 text-red-700' : 
                          vuln.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{vuln.description}</td>
                      <td className="py-3 px-4">{vuln.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline">Download PDF</Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityReportDialog;
