
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "../components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";

const UpcomingEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  
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
      
      <Tabs defaultValue="booked" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="created">Created</TabsTrigger>
        </TabsList>
        
        <TabsContent value="booked" className="space-y-4 mt-4">
          {isLoading ? (
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
            <div className="space-y-4">
              {bookedEvents.map((event) => (
                <EventCard key={event.id} event={event} isBooked />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">You haven't booked any events yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="created" className="space-y-4 mt-4">
          {isLoading ? (
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
            <div className="space-y-4">
              {createdEvents.map((event) => (
                <EventCard key={event.id} event={event} isCreator />
              ))}
            </div>
          ) : (
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
