
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Event } from "../types/event";
import { toast } from "@/components/ui/use-toast";

interface EventCardProps {
  event: Event;
  isBooked?: boolean;
  isCreator?: boolean;
}

const EventCard = ({ event, isBooked, isCreator }: EventCardProps) => {
  const [isAttending, setIsAttending] = useState(isBooked || false);
  
  const handleAttend = () => {
    setIsAttending(true);
    toast({
      title: "Event booked",
      description: `You are now attending ${event.title}`,
    });
  };
  
  const handleCancel = () => {
    setIsAttending(false);
    toast({
      title: "Booking canceled",
      description: `You've canceled your attendance to ${event.title}`,
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})` }}
      />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(event.date), "PPP")}
              <span className="mx-1">·</span>
              <Clock className="mr-1 h-3 w-3" />
              {event.time}
            </CardDescription>
          </div>
          
          {isCreator && (
            <Badge variant="outline" className="border-gathr-coral text-gathr-coral">
              Your Event
            </Badge>
          )}
          
          {isAttending && !isCreator && (
            <Badge className="bg-green-500 hover:bg-green-600">
              Attending
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm">{event.description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {event.location}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          {event.attendees} / {event.capacity} attendees
        </div>
        
        <div className="flex flex-wrap gap-2">
          {event.categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Match score: <span className="font-semibold text-gathr-coral">{event.matchScore}%</span>
        </div>
        
        {isCreator ? (
          <Button variant="outline">
            Manage Event
          </Button>
        ) : isAttending ? (
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-600"
            onClick={handleCancel}
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        ) : (
          <Button 
            className="bg-gathr-coral hover:bg-gathr-coral/90"
            onClick={handleAttend}
          >
            <Check className="mr-1 h-4 w-4" />
            Attend
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
