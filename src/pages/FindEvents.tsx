
/**
 * FindEvents Page (Home)
 * 
 * This component is the main event discovery page of the application.
 * It displays a list of events with infinite scrolling, search functionality,
 * and filtering options. Events are recommended based on the user's personality.
 * 
 * @author Huy Le (huyisme-005)
 * @organization Gathr
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import MoreEventsSection from "@/components/MoreEventsSection";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { customMoreEvents } from "@/data/customMoreEvents";

const FindEvents = () => {
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [moreEvents, setMoreEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNearbyExpanded, setIsNearbyExpanded] = useState(false);
  const [isTicketExpanded, setIsTicketExpanded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // Add price and time details to events
      const enhancedEvents = mockEvents.map(event => ({
        ...event,
        price: Math.floor(Math.random() * 100) + 10,
        startTime: `${event.time}`,
        endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`,
      }));
      
      // Get booked events (first 3 for demo)
      setBookedEvents(enhancedEvents.slice(0, 3));
      
      // Get nearby events
      setNearbyEvents(enhancedEvents.slice(3, 7));
      
      // Get more events with custom events
      setMoreEvents([...enhancedEvents.slice(7), ...customMoreEvents]);
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const displayedTicketEvents = isTicketExpanded ? bookedEvents : bookedEvents.slice(0, 2);
  const displayedNearbyEvents = isNearbyExpanded ? nearbyEvents : nearbyEvents.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header with greeting and notification */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Hi, {user?.name}</h1>
          <p className="text-sm text-muted-foreground">Find your favorite event</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Your Ticket Events */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Your Ticket Events</h2>
          <Button 
            variant="link" 
            className="text-xs text-green-500 p-0"
            onClick={() => setIsTicketExpanded(!isTicketExpanded)}
          >
            {isTicketExpanded ? 'Collapse' : 'View all'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2].map(i => (
              <div
                key={i}
                className="w-40 h-40 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : bookedEvents.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-4">
              {displayedTicketEvents.map(event => (
                <div 
                  key={event.id} 
                  className="w-40 shrink-0"
                  onClick={() => handleEventClick(event.id)}
                >
                  <EventCard 
                    event={event} 
                    view="grid"
                    isBooked={true}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 bg-secondary/30 rounded-xl">
            <p className="text-muted-foreground">No booked events yet</p>
          </div>
        )}
      </div>
      
      {/* Explore Nearby */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Explore Nearby</h2>
          <Button 
            variant="link" 
            className="text-xs text-green-500 p-0"
            onClick={() => setIsNearbyExpanded(!isNearbyExpanded)}
          >
            {isNearbyExpanded ? 'Collapse' : 'View all'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex overflow-x-auto gap-4 pb-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-40 h-40 rounded-2xl bg-gray-200 animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-4">
              {displayedNearbyEvents.map(event => (
                <div 
                  key={event.id} 
                  className="w-40 shrink-0"
                  onClick={() => handleEventClick(event.id)}
                >
                  <EventCard 
                    event={event} 
                    view="grid"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* More Events */}
      <MoreEventsSection 
        events={moreEvents}
        isLoading={isLoading}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default FindEvents;
