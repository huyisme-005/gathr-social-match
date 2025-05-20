
/**
 * Profile Page
 * 
 * This component displays the user's profile information, including personal details,
 * personality traits, and account statistics. It allows editing the profile and 
 * provides an option to retake the personality test.
 */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Pencil, Save, X } from "lucide-react";

const Profile = () => {
  // Get user data from auth context
  const { user, completePersonalityTest } = useAuth();
  const navigate = useNavigate();
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for form fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  /**
   * Save profile changes
   * In a real app, this would call an API to update the user's profile
   */
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user's profile
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  /**
   * Navigate to personality test page to retake the test
   */
  const handleRetakePersonalityTest = () => {
    // Reset personality test state in auth context
    completePersonalityTest([]);
    
    // Navigate to personality test page
    navigate("/personality-test");
    
    toast({
      title: "Retaking personality test",
      description: "Your previous personality traits will be replaced with new results",
    });
  };
  
  /**
   * Get user initials for avatar fallback
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  /**
   * Format personality trait name for display
   * Converts "trait-name" to "Trait Name"
   */
  const formatTraitName = (trait: string) => {
    return trait.charAt(0).toUpperCase() + trait.slice(1).replace('-', ' ');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {/* User avatar */}
          <Avatar className="h-20 w-20">
            <AvatarImage alt={user?.name} />
            <AvatarFallback className="text-lg bg-gathr-coral text-white">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            {/* User name - editable in edit mode */}
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold mb-1"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user?.name}</h2>
            )}
            
            {/* User email - editable in edit mode */}
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
          
          {/* Edit/Save buttons */}
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
          {/* Personality traits section */}
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
          
          {/* Account stats section */}
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
          {/* Button to retake the personality test */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleRetakePersonalityTest}
          >
            Retake Personality Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
