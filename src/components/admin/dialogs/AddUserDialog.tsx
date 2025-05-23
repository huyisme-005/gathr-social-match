/**
 * AddUserDialog Component
 * This component displays a dialog for adding a new user.
 * @author Huy Le (huyisme-005)
 * @organization Gathr
 */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { NewUser } from "@/types/admin";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: NewUser) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onAddUser }) => {
  const [newUser, setNewUser] = useState<NewUser>({ 
    name: "", 
    email: "", 
    country: "", 
    status: "active" 
  });

  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.country) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    onAddUser(newUser);
    
    // Reset form and close dialog
    setNewUser({ name: "", email: "", country: "", status: "active" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account on the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country"
              value={newUser.country}
              onChange={(e) => setNewUser({...newUser, country: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status"
              className="w-full border rounded-md px-3 py-2"
              value={newUser.status}
              onChange={(e) => setNewUser({...newUser, status: e.target.value as "active" | "premium" | "suspended"})}
            >
              <option value="active">Active</option>
              <option value="premium">Premium</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser}
            className="bg-gathr-coral hover:bg-gathr-coral/90"
          >
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
