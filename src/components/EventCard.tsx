
/**
 * EventCard Component
 * 
 * This component displays a single event in a card format.
 * It shows event details and provides appropriate actions based on the user's
 * relationship to the event (attendee, creator, or potential attendee).
 */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, X, Check, DollarSign, Timer, Heart } from "lucide-react";
import { format } from "date-fns";
import { Event } from "../types/event";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventDetailDialog from "./EventDetailDialog";
import { useAuth } from "@/contexts/AuthContext";

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
  const [bookingTime, setBookingTime] = useState<Date | null>(null);
  const { getFavoriteEvents, toggleEventFavorite } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const favoriteEvents = getFavoriteEvents();
    setIsFavorite(favoriteEvents.includes(event.id));
  }, [getFavoriteEvents, event.id]);
  
  /**
   * Handles booking an event - in a real app, this would call an API
   */
  const handleAttend = () => {
    setIsAttending(true);
    setBookingTime(new Date());
    toast.success(`You are now attending ${event.title}`);
    setShowDetail(false);
  };
  
  /**
   * Handles canceling attendance - in a real app, this would call an API
   */
  const handleCancel = () => {
    setIsAttending(false);
    const currentTime = new Date();
    const bookTime = bookingTime || new Date();
    const hoursSinceBooked = (currentTime.getTime() - bookTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceBooked <= 24) {
      toast.success(`Booking canceled with full refund for ${event.title}`);
    } else {
      toast.info(`Booking canceled for ${event.title} - no refund available after 24 hours`);
    }
  };

  /**
   * Handle favorite toggle
   */
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEventFavorite(event.id);
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success(`Added ${event.title} to favorites`);
    } else {
      toast.info(`Removed ${event.title} from favorites`);
    }
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
          className="overflow-hidden cursor-pointer aspect-square w-full rounded-2xl hover:shadow-lg transition-all"
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
            
            {/* Price tag */}
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white">
                ${event.price}
              </Badge>
            </div>
            
            {/* Favorite button */}
            <button 
              className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-full"
              onClick={handleFavoriteToggle}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
            
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
                {format(new Date(event.date), "MMM d, yyyy")}
              </div>
              
              {/* Event time */}
              <div className="flex items-center text-xs text-white/70 mt-0.5">
                <Clock className="h-3 w-3 mr-1" />
                {event.startTime} - {event.endTime}
              </div>
              
              {/* Event location */}
              <div className="flex items-center text-xs text-white/70 mt-0.5">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <EventDetailDialog 
          event={event} 
          open={showDetail} 
          onOpenChange={setShowDetail} 
        />
      </>
    );
  }

  // List view is the original card design
  return (
    <Card className="overflow-hidden">
      {/* Event image */}
      <div 
        className="h-48 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})` }}
      >
        {/* Favorite button */}
        <button 
          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full"
          onClick={handleFavoriteToggle}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </button>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(event.date), "PPP")}
              <span className="mx-1">·</span>
              <Clock className="mr-1 h-3 w-3" />
              {event.startTime} - {event.endTime}
            </CardDescription>
          </div>
          
          {/* Price tag */}
          <Badge className="bg-green-500 text-white">
            ${event.price}
          </Badge>
          
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
        
        {/* Refund policy notice */}
        <div className="flex items-center text-xs text-muted-foreground">
          <Timer className="mr-1 h-3 w-3" />
          Full refund available if cancelled within 24 hours of booking
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
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleCancel}
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        ) : (
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
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
