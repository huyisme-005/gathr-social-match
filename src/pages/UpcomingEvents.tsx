
/**
 * UpcomingEvents Page
 * 
 * This component displays a tabbed interface showing events the user has booked
 * and events the user has created. It allows the user to manage their events.
 */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";
import EventDetailDialog from "../components/EventDetailDialog";
import FeedbackDialog from "../components/FeedbackDialog";

const UpcomingEvents = () => {
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  
  // State for events the user has booked
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  
  // State for events the user has created
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  
  // State for past events (for feedback)
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  
  // State for event detail dialog
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // State for feedback dialog
  const [feedbackEvent, setFeedbackEvent] = useState<Event | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  /**
   * Fetch user's booked and created events
   * In a real app, this would call an API with the user's auth token
   */
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just use some sample events
      // In a real app, you would fetch the user's booked and created events from an API
      
      // Get current date for comparison
      const now = new Date();
      
      // Split events into upcoming and past
      const upcoming = mockEvents.filter(event => new Date(event.date) >= now);
      const past = mockEvents.filter(event => new Date(event.date) < now);
      
      setBookedEvents(upcoming.slice(0, 2));
      setCreatedEvents(upcoming.slice(2, 4));
      setPastEvents(past);
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  /**
   * Open the event detail dialog
   */
  const openEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  
  /**
   * Open the feedback dialog
   */
  const openFeedbackDialog = (event: Event) => {
    setFeedbackEvent(event);
    setIsFeedbackOpen(true);
  };
  
  /**
   * Format the event date for display
   */
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  /**
   * Format the event time for display
   */
  const formatEventTime = (timeString: string) => {
    return timeString.replace(/:00$/, '');
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Events</h1>
      
      {/* Past events needing feedback */}
      {pastEvents.length > 0 && (
        <div className="mb-4">
          <h2 className="font-medium mb-2">Events Needing Feedback</h2>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <Card key={`past-${event.id}`} className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatEventDate(event.date)} • {formatEventTime(event.time)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-gathr-coral text-white hover:bg-gathr-coral/90"
                      onClick={() => openFeedbackDialog(event)}
                    >
                      Give Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
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
                  <Skeleton className="h-[120px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : bookedEvents.length > 0 ? (
            // List of booked events
            <div className="space-y-3">
              {bookedEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openEventDetail(event)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Event image */}
                      <div className="w-1/3 h-[120px]">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Event details */}
                      <div className="w-2/3 p-3 space-y-2">
                        {/* Title and match score */}
                        <div className="flex justify-between">
                          <h3 className="font-medium line-clamp-1">{event.title}</h3>
                          <Badge>
                            Booked
                          </Badge>
                        </div>
                        
                        {/* Date, time, location */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatEventDate(event.date)} • {formatEventTime(event.time)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                  <Skeleton className="h-[120px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : createdEvents.length > 0 ? (
            // List of created events
            <div className="space-y-3">
              {createdEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openEventDetail(event)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Event image */}
                      <div className="w-1/3 h-[120px]">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Event details */}
                      <div className="w-2/3 p-3 space-y-2">
                        {/* Title and match score */}
                        <div className="flex justify-between">
                          <h3 className="font-medium line-clamp-1">{event.title}</h3>
                          <Badge className="bg-gathr-coral">
                            Created
                          </Badge>
                        </div>
                        
                        {/* Date, time, location */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatEventDate(event.date)} • {formatEventTime(event.time)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                        
                        {/* Attendee count */}
                        <p className="text-xs text-muted-foreground">
                          {event.attendees} attendees
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
      
      {/* Event detail dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
      
      {/* Feedback dialog */}
      {feedbackEvent && (
        <FeedbackDialog
          event={feedbackEvent}
          open={isFeedbackOpen}
          onOpenChange={setIsFeedbackOpen}
        />
      )}
    </div>
  );
};

export default UpcomingEvents;
