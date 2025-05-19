
/**
 * UpcomingEvents Page
 * 
 * This component displays a tabbed interface showing events the user has booked
 * and events the user has created. It allows the user to manage their events.
 */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "../components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";

const UpcomingEvents = () => {
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  
  // State for events the user has booked
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  
  // State for events the user has created
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  
  /**
   * Fetch user's booked and created events
   * In a real app, this would call an API with the user's auth token
   */
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just use some sample events
      // In a real app, you would fetch the user's booked and created events from an API
      setBookedEvents(mockEvents.slice(0, 2));
      setCreatedEvents(mockEvents.slice(2, 4));
      setIsLoading(false);
    }, 1000);
  }, []);
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Events</h1>
      
      {/* Tabs for switching between booked and created events */}
      <Tabs defaultValue="booked" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="created">Created</TabsTrigger>
        </TabsList>
        
        {/* Content for Booked Events tab */}
        <TabsContent value="booked" className="space-y-4 mt-4">
          {isLoading ? (
            // Loading skeleton UI
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : bookedEvents.length > 0 ? (
            // List of booked events
            <div className="space-y-4">
              {bookedEvents.map((event) => (
                <EventCard key={event.id} event={event} isBooked />
              ))}
            </div>
          ) : (
            // Empty state when no booked events
            <div className="py-12 text-center">
              <p className="text-muted-foreground">You haven't booked any events yet</p>
            </div>
          )}
        </TabsContent>
        
        {/* Content for Created Events tab */}
        <TabsContent value="created" className="space-y-4 mt-4">
          {isLoading ? (
            // Loading skeleton UI
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : createdEvents.length > 0 ? (
            // List of created events
            <div className="space-y-4">
              {createdEvents.map((event) => (
                <EventCard key={event.id} event={event} isCreator />
              ))}
            </div>
          ) : (
            // Empty state when no created events
            <div className="py-12 text-center">
              <p className="text-muted-foreground">You haven't created any events yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpcomingEvents;
