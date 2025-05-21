
/**
 * EventCard Component
 * 
 * This component displays a single event in a card format.
 * It shows event details and provides appropriate actions based on the user's
 * relationship to the event (attendee, creator, or potential attendee).
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Event } from "../types/event";
import { toast } from "@/components/ui/use-toast";

interface EventCardProps {
  event: Event;              // Event data to display
  isBooked?: boolean;        // Whether the user has booked this event
  isCreator?: boolean;       // Whether the user created this event
}

const EventCard = ({ event, isBooked, isCreator }: EventCardProps) => {
  // State to track whether the user is attending the event
  const [isAttending, setIsAttending] = useState(isBooked || false);
  
  /**
   * Handles booking an event - in a real app, this would call an API
   */
  const handleAttend = () => {
    setIsAttending(true);
    toast({
      title: "Event booked",
      description: `You are now attending ${event.title}`,
    });
  };
  
  /**
   * Handles canceling attendance - in a real app, this would call an API
   */
  const handleCancel = () => {
    setIsAttending(false);
    toast({
      title: "Booking canceled",
      description: `You've canceled your attendance to ${event.title}`,
    });
  };
  
  return (
    <Card className="overflow-hidden">
      {/* Event image */}
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
          
          {/* Badge for events created by the user */}
          {isCreator && (
            <Badge variant="outline" className="border-gathr-coral text-gathr-coral">
              Your Event
            </Badge>
          )}
          
          {/* Badge for events the user is attending */}
          {isAttending && !isCreator && (
            <Badge className="bg-green-500 hover:bg-green-600">
              Attending
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Event description */}
        <p className="text-sm">{event.description}</p>
        
        {/* Event location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {event.location}
        </div>
        
        {/* Attendee count */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          {event.attendees} / {event.capacity} attendees
        </div>
        
        {/* Event categories */}
        <div className="flex flex-wrap gap-2">
          {event.categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {/* Event match score */}
        <div className="text-sm text-muted-foreground">
          Match score: <span className="font-semibold text-gathr-coral">{event.matchScore}%</span>
        </div>
        
        {/* Action buttons based on user relationship to event */}
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
