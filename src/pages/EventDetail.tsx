
/**
 * EventDetail Page
 * 
 * This page displays detailed information about an event.
 * It shows the event image, title, details, and allows booking.
 * 
 * @author Lovable AI
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { customMoreEvents } from "@/data/customMoreEvents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const { toggleEventFavorite, getFavoriteEvents } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) return;
    
    // In a real app, fetch from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Search in both mock events and custom events
      const allEvents = [...mockEvents, ...customMoreEvents];
      let foundEvent = allEvents.find(event => event.id === id);
      
      if (foundEvent) {
        // Add additional properties to the event if needed
        const enhancedEvent = {
          ...foundEvent,
          price: foundEvent.price || Math.floor(Math.random() * 100) + 10,
          startTime: foundEvent.startTime || `${foundEvent.time}`,
          endTime: foundEvent.endTime || `${parseInt(foundEvent.time.split(':')[0]) + 2}:${foundEvent.time.split(':')[1]}`,
        };
        
        setEvent(enhancedEvent);
        
        // Check if this event is favorited
        const favorites = getFavoriteEvents();
        setIsFavorite(favorites.includes(id));
        
        // In a real app, check if user has booked this event
        setIsBooked(["1", "3", "5"].includes(id));
      }
      
      setIsLoading(false);
    }, 500);
  }, [id, getFavoriteEvents]);
  
  const handleFavoriteToggle = () => {
    if (!event) return;
    
    toggleEventFavorite(event.id);
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success("Added to favorites");
    } else {
      toast.success("Removed from favorites");
    }
  };
  
  const handleShare = () => {
    // In a real app, implement sharing functionality
    toast.success("Share link copied to clipboard!");
  };
  
  const handleBookEvent = () => {
    setIsBooked(true);
    toast.success("Event booked successfully!");
  };
  
  const handleCancelBooking = () => {
    setIsBooked(false);
    toast.success("Booking canceled successfully");
  };
  
  if (isLoading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-black/30 text-white rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-black/30 text-white rounded-full"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-black/30 text-white rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Event image */}
      <div 
        className="w-full h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />
      
      {/* Event details */}
      <div className="flex-1 p-4 space-y-6">
        {/* Title and badges */}
        <div>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {event.categories.map((category, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* About section */}
        <div>
          <h2 className="text-lg font-medium mb-2">About us</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        
        {/* Location */}
        <div>
          <h2 className="text-lg font-medium mb-2">Location</h2>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
        
        {/* Date and time */}
        <div className="flex gap-6">
          <div>
            <h3 className="font-medium mb-1">Date</h3>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Time</h3>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
          </div>
        </div>
        
        {/* Attendees */}
        <div className="flex gap-6">
          <div>
            <h3 className="font-medium mb-1">Attendees</h3>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{event.attendees} going</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Price</h3>
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${event.price}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Book button */}
      <div className="sticky bottom-0 w-full p-4 bg-background border-t">
        {!isBooked ? (
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            size="lg"
            onClick={handleBookEvent}
          >
            Book Now
          </Button>
        ) : (
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="lg"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
