
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Pencil, Save, X } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user's profile
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const formatTraitName = (trait: string) => {
    return trait.charAt(0).toUpperCase() + trait.slice(1).replace('-', ' ');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage alt={user?.name} />
            <AvatarFallback className="text-lg bg-gathr-coral text-white">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold mb-1"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user?.name}</h2>
            )}
            
            {isEditing ? (
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="text-muted-foreground"
              />
            ) : (
              <p className="text-muted-foreground">{user?.email}</p>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="bg-gathr-coral hover:bg-gathr-coral/90"
                onClick={handleSaveProfile}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personality Traits</h3>
            <div className="flex flex-wrap gap-2">
              {user?.personalityTags && user.personalityTags.length > 0 ? (
                user.personalityTags.map((trait, index) => (
                  <Badge key={index} className="bg-gathr-coral">
                    {formatTraitName(trait)}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No personality traits found</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Account Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-md text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Events Created</div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full"
          >
            Retake Personality Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
