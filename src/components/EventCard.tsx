
/**
 * EventCard Component
 * 
 * This component displays a single event in a card format.
 * It shows event details and provides appropriate actions based on the user's
 * relationship to the event (attendee, creator, or potential attendee).
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, X, Check } from "lucide-react";
import { format } from "date-fns";
import { Event } from "../types/event";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;              // Event data to display
  isBooked?: boolean;        // Whether the user has booked this event
  isCreator?: boolean;       // Whether the user created this event
  onClick?: () => void;      // Click handler for the card
  view?: "grid" | "list";    // Display mode - grid (default) or list
}

const EventCard = ({ 
  event, 
  isBooked, 
  isCreator, 
  onClick,
  view = "grid" 
}: EventCardProps) => {
  // State to track whether the user is attending the event
  const [isAttending, setIsAttending] = useState(isBooked || false);
  const [showDetail, setShowDetail] = useState(false);
  
  /**
   * Handles booking an event - in a real app, this would call an API
   */
  const handleAttend = () => {
    setIsAttending(true);
    toast({
      title: "Event booked",
      description: `You are now attending ${event.title}`,
    });
    setShowDetail(false);
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

  /**
   * Format the event date for display
   */
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d");
  };

  // Show the event in grid view (square card)
  if (view === "grid") {
    return (
      <>
        <Card 
          className="overflow-hidden cursor-pointer h-44 rounded-2xl hover:shadow-lg transition-all"
          onClick={() => setShowDetail(true)}
        >
          <div className="h-full relative">
            {/* Event image */}
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              {/* Match score */}
              <Badge className="bg-gathr-coral mb-1">
                {event.matchScore}%
              </Badge>
              
              {/* Event title */}
              <h3 className="font-medium text-sm line-clamp-2">
                {event.title}
              </h3>
              
              {/* Event date */}
              <div className="flex items-center text-xs text-white/70 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {formatEventDate(event.date)}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Event detail dialog */}
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto p-0 gap-0 rounded-2xl">
            <div className="relative">
              {/* Header image */}
              <div
                className="h-64 w-full bg-center bg-cover"
                style={{ backgroundImage: `url(${event.imageUrl})` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                  </div>
                </div>
                
                {/* Event details */}
                <div className="space-y-4">
                  {/* About */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">About us</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                  
                  {/* Attendees */}
                  <div className="flex items-center gap-1">
                    {/* Avatar placeholders */}
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="h-5 w-5 rounded-full bg-muted-foreground/30 border border-background"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {event.attendees} participants
                    </span>
                  </div>
                  
                  {/* Book now button */}
                  <Button 
                    className="w-full bg-gathr-coral hover:bg-gathr-coral/90 rounded-full"
                    onClick={handleAttend}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // List view is the original card design
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
