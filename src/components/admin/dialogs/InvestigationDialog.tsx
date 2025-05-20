
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SecurityAlert } from "@/types/admin";

interface InvestigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: SecurityAlert | null;
}

const InvestigationDialog: React.FC<InvestigationDialogProps> = ({ 
  open, 
  onOpenChange, 
  alert 
}) => {
  if (!alert) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Investigation: {alert?.title}</DialogTitle>
          <DialogDescription>
            {alert?.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Alert Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Alert ID:</span>
                <span className="font-medium">{alert?.id}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{alert?.type}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">{alert?.timestamp}</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Action</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Dismiss</Button>
              <Button variant="destructive" className="flex-1">Block User</Button>
              <Button className="flex-1 bg-gathr-coral hover:bg-gathr-coral/90">Reset Password</Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestigationDialog;
