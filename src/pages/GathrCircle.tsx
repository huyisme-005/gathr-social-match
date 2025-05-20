
/**
 * GathrCircle Page
 * 
 * This component displays the user's connections and allows them to interact
 * with their Gathr Circle - the users they've connected with at events.
 * It provides options to message, call, and manage connections.
 */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Video, MessageCircle, X, UserX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CallDialog from "../components/CallDialog";

// Mock connections data
const mockConnections = [
  {
    id: "c1",
    name: "Jessica Lee",
    personalityMatch: 87,
    personalityTags: ["extrovert", "cultural", "growth-minded"],
    eventsAttended: 3,
    lastActive: "2 hours ago"
  },
  {
    id: "c2",
    name: "Michael Wright",
    personalityMatch: 76,
    personalityTags: ["introvert", "analytical", "prepared"],
    eventsAttended: 1,
    lastActive: "yesterday"
  },
  {
    id: "c3",
    name: "Sarah Johnson",
    personalityMatch: 92,
    personalityTags: ["adventurous", "social", "experiential"],
    eventsAttended: 5,
    lastActive: "just now"
  },
  {
    id: "c4",
    name: "David Chen",
    personalityMatch: 65,
    personalityTags: ["thoughtful", "intimate", "relational"],
    eventsAttended: 2,
    lastActive: "3 days ago"
  }
];

const GathrCircle = () => {
  // State for the connections
  const [connections, setConnections] = useState(mockConnections);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  // State for call dialog
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  // State for selected attendee to call
  const [selectedAttendee, setSelectedAttendee] = useState<{id: string, name: string} | null>(null);
  // State for call type (audio/video)
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  
  // Get user data from auth context
  const { user } = useAuth();
  
  /**
   * Filter connections based on search term
   */
  const filteredConnections = connections.filter(
    connection => connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  /**
   * Handle removing a connection
   */
  const handleRemoveConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
    
    toast({
      title: "Connection removed",
      description: "This person has been removed from your Gathr Circle",
    });
  };
  
  /**
   * Handle initiating a message with a connection
   */
  const handleMessage = (connection: any) => {
    // In a real app, this would open a messaging interface
    toast({
      title: "Message started",
      description: `You can now chat with ${connection.name}`,
    });
  };
  
  /**
   * Handle initiating an audio call with a connection
   */
  const handleAudioCall = (connection: any) => {
    setSelectedAttendee({ id: connection.id, name: connection.name });
    setCallType("audio");
    setCallDialogOpen(true);
  };
  
  /**
   * Handle initiating a video call with a connection
   */
  const handleVideoCall = (connection: any) => {
    setSelectedAttendee({ id: connection.id, name: connection.name });
    setCallType("video");
    setCallDialogOpen(true);
  };
  
  /**
   * Format personality trait for display
   */
  const formatTraitName = (trait: string) => {
    return trait.charAt(0).toUpperCase() + trait.slice(1).replace('-', ' ');
  };
  
  /**
   * Get initials for avatar fallback
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Gathr Circle</h1>
        <Badge className="bg-gathr-coral">{connections.length} Connections</Badge>
      </div>
      
      {/* Search input */}
      <div className="relative">
        <Input 
          placeholder="Search your connections..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
      </div>
      
      {/* Connections list */}
      <div className="space-y-4">
        {filteredConnections.length > 0 ? (
          filteredConnections.map(connection => (
            <Card key={connection.id} className="overflow-hidden">
              <div className="flex">
                {/* Colored bar indicating match percentage */}
                <div 
                  className="w-2" 
                  style={{ 
                    backgroundColor: `hsl(${connection.personalityMatch}, 80%, 60%)`,
                    opacity: connection.personalityMatch / 100
                  }} 
                />
                
                <div className="flex-1">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage alt={connection.name} />
                      <AvatarFallback className="bg-gathr-coral text-white">
                        {getInitials(connection.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{connection.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleRemoveConnection(connection.id)}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                        {connection.lastActive}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Match: </span>
                        <span className="font-medium">{connection.personalityMatch}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Events together: </span>
                        <span className="font-medium">{connection.eventsAttended}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {connection.personalityTags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {formatTraitName(tag)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleMessage(connection)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => handleAudioCall(connection)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => handleVideoCall(connection)}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👋</div>
            <h3 className="text-lg font-medium">No connections found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term" : "Attend events to connect with others"}
            </p>
          </div>
        )}
      </div>
      
      {/* Call dialog */}
      {selectedAttendee && (
        <CallDialog
          open={callDialogOpen}
          onOpenChange={setCallDialogOpen}
          attendee={selectedAttendee}
          callType={callType}
        />
      )}
    </div>
  );
};

export default GathrCircle;
