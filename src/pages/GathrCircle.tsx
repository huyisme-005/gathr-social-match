
/**
 * GathrCircle Page
 * 
 * This component displays the user's Gathr circle - people they've connected with
 * through events. It shows personality match scores with each connection and allows
 * the user to message their connections and view their profiles.
 */
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";

// Mock data for Gathr circle connections
const mockConnections = [
  { 
    id: "1", 
    name: "Alex Johnson", 
    avatar: "", 
    personalityMatch: 85, 
    traits: ["extrovert", "creative", "adventurous"],
    eventsAttended: 3
  },
  { 
    id: "2", 
    name: "Jamie Smith", 
    avatar: "", 
    personalityMatch: 72, 
    traits: ["thoughtful", "curious", "relational"],
    eventsAttended: 1
  },
  { 
    id: "3", 
    name: "Taylor Brown", 
    avatar: "", 
    personalityMatch: 65, 
    traits: ["analytical", "prepared", "cultural"],
    eventsAttended: 2
  },
  { 
    id: "4", 
    name: "Casey Wilson", 
    avatar: "", 
    personalityMatch: 91, 
    traits: ["experiential", "networker", "active"],
    eventsAttended: 5
  },
  { 
    id: "5", 
    name: "Jordan Lee", 
    avatar: "", 
    personalityMatch: 78, 
    traits: ["empathetic", "intimate", "growth-minded"],
    eventsAttended: 2
  },
];

const GathrCircle = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState(mockConnections);
  
  // Filter connections based on search term
  const filteredConnections = connections.filter((connection) => 
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.traits.some(trait => 
      trait.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Handle messaging a connection
  const handleMessage = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    toast.success(`Messaged ${connection?.name}`);
  };
  
  // Handle removing a connection from circle
  const handleRemove = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    setConnections(connections.filter(c => c.id !== connectionId));
    toast.success(`${connection?.name} removed from your Gathr circle`);
  };
  
  // Format personality trait name for display
  const formatTraitName = (trait: string) => {
    return trait.charAt(0).toUpperCase() + trait.slice(1).replace('-', ' ');
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Gathr Circle</h1>
      
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search connections..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Connections list */}
      {filteredConnections.length > 0 ? (
        <div className="space-y-3">
          {filteredConnections.map((connection) => (
            <Card key={connection.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback className="bg-gathr-coral text-white">
                        {connection.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Connection details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{connection.name}</h3>
                        <Badge className="bg-gathr-coral">
                          {connection.personalityMatch}% Match
                        </Badge>
                      </div>
                      
                      {/* Personality traits */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {connection.traits.map((trait, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {formatTraitName(trait)}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Events attended */}
                      <p className="text-xs text-muted-foreground mt-1">
                        {connection.eventsAttended} events together
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleMessage(connection.id)}
                      className="h-8 w-8"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRemove(connection.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No connections found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Attend events and add people to your circle to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default GathrCircle;
