
/**
 * TicketsPage Component
 * 
 * This page displays all events that the user has booked tickets for.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";

// In a real app, we'd get this from an API
// For demo purposes, use the first 3 events as booked
const bookedEventIds = ["1", "3", "5"];

const TicketsPage = () => {
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, we'd fetch the user's booked events from an API
    // For now, we'll filter our mock data based on hardcoded IDs
    const enhancedEvents = mockEvents
      .filter(event => bookedEventIds.includes(event.id))
      .map(event => ({
        ...event,
        price: Math.floor(Math.random() * 100) + 10,
        startTime: `${event.time}`,
        endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`,
      }));
    
    setBookedEvents(enhancedEvents);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Your Tickets</h1>
      
      {bookedEvents.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h2 className="text-lg font-medium mt-4">No tickets yet</h2>
          <p className="text-muted-foreground mt-1">
            Book events to see your tickets here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookedEvents.map(event => (
            <div key={event.id} className="relative" onClick={() => navigate(`/event/${event.id}`)}>
              <EventCard 
                event={event}
                view="list"
                isBooked={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
