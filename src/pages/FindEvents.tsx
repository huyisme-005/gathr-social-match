
/**
 * FindEvents Page
 * 
 * This component is the main event discovery page of the application.
 * It displays a list of events with infinite scrolling, search functionality,
 * and filtering options. Events are recommended based on the user's personality.
 */
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import EventFilterDialog from "../components/EventFilterDialog";
<<<<<<< HEAD
import EventDetailDialog from "../components/EventDetailDialog";
=======
import EventCard from "../components/EventCard";
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";

const FindEvents = () => {
  // State for all events data
  const [events, setEvents] = useState<Event[]>([]);
  
  // State for filtered events (after search and filter applied)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
<<<<<<< HEAD
=======
  // State for booked events
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  
  // State for more events (national)
  const [nationalEvents, setNationalEvents] = useState<Event[]>([]);
  
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
  // Loading state for initial data fetching
  const [isLoading, setIsLoading] = useState(true);
  
  // State for search input value
  const [searchTerm, setSearchTerm] = useState("");
  
  // Current page number for infinite scrolling
  const [page, setPage] = useState(1);
  
  // State to control filter dialog visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State to control event detail dialog
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],  // Selected event categories
    date: null as Date | null,   // Selected date filter
    distance: 10,                // Selected distance radius in km
  });
  
  // Get current user data from auth context
  const { user } = useAuth();
  
  // Setup intersection observer for infinite scrolling
  const { ref, inView } = useInView();
  
  /**
   * Initial data loading
   * In a real app, this would fetch events from an API
   */
  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
<<<<<<< HEAD
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
=======
      // Add price and time details to events
      const enhancedEvents = mockEvents.map(event => ({
        ...event,
        price: Math.floor(Math.random() * 100) + 10, // Random price between $10-$110
        startTime: `${event.time}`,
        endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`, // 2 hours after start
        imageUrl: event.id === "1" ? "https://images.unsplash.com/photo-1581092160607-ee23481e1f5b" : event.imageUrl
      }));
      
      setEvents(enhancedEvents);
      setFilteredEvents(enhancedEvents);
      
      // Get some random events for the booked section
      setBookedEvents(enhancedEvents.slice(0, 3));
      
      // Get some random events for the national section
      // Adding more events to the national section
      const moreNationalEvents = [
        ...enhancedEvents.slice(3, 9),
        ...enhancedEvents.map(evt => ({ 
          ...evt, 
          id: `${evt.id}-copy`, 
          title: `${evt.title} ${Math.floor(Math.random() * 100)}`,
          price: Math.floor(Math.random() * 100) + 10
        })).slice(0, 6)
      ];
      
      setNationalEvents(moreNationalEvents);
      
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
      setIsLoading(false);
    }, 1000);
  }, []);
  
  /**
   * Handle infinite scrolling when user reaches bottom of the list
   */
  useEffect(() => {
    if (inView && !isLoading) {
      // In a real app, this would fetch the next page of events from the API
      setPage((prevPage) => prevPage + 1);
      
      // For demo, we're just adding the same events again
      setEvents((prevEvents) => [...prevEvents, ...mockEvents]);
      
      // Apply current filters to the new events
      handleSearch(searchTerm);
    }
  }, [inView]);
  
  /**
   * Filter events based on search term and active filters
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // If no filters active, show all events
    if (!term && !activeFilters.categories.length && !activeFilters.date) {
      setFilteredEvents(events);
      return;
    }
    
    // Apply filters to events
    const filtered = events.filter((event) => {
      // Check if event matches search term in title or description
      const matchesSearch = term
        ? event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase())
        : true;
        
      // Check if event belongs to any of the selected categories
      const matchesCategory = activeFilters.categories.length
        ? activeFilters.categories.some((cat) => event.categories.includes(cat))
        : true;
        
      // Add more filter logic here as needed
        
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
  };
  
  /**
   * Apply filters from the filter dialog
   */
  const applyFilters = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    
    // Apply both search term and new filters
    const filtered = events.filter((event) => {
      const matchesSearch = searchTerm
        ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
        
      const matchesCategory = filters.categories.length
        ? filters.categories.some((cat) => event.categories.includes(cat))
        : true;
        
      // Add more filter logic here as needed
        
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
  };

  /**
   * Open the event detail dialog
   */
  const openEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  
  /**
   * Sort events based on user's personality traits
   * This increases match scores for events with categories matching user's traits
   */
  useEffect(() => {
    if (user?.personalityTags?.length) {
      const personalityTags = user.personalityTags;
      
      // Sort events by relevance to user's personality
      const sortedEvents = [...filteredEvents].sort((a, b) => {
        // Count how many categories match the user's personality tags
        const aMatches = a.categories.filter((cat) => personalityTags.includes(cat)).length;
        const bMatches = b.categories.filter((cat) => personalityTags.includes(cat)).length;
        return bMatches - aMatches; // Higher matches come first
      });
      
      setFilteredEvents(sortedEvents);
    }
  }, [user?.personalityTags, events]);
  
  /**
<<<<<<< HEAD
   * Format the event date for display
   */
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  /**
   * Format the event time for display
=======
   * Toggle the expanded state of a section
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
   */
  const formatEventTime = (timeString: string) => {
    return timeString.replace(/:00$/, '');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Find Events</h1>
      </div>
      
      {/* Search and filter controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className={activeFilters.categories.length ? "bg-gathr-coral text-white hover:bg-gathr-coral/90" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Event list or empty state */}
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openEventDetail(event)}
              >
<<<<<<< HEAD
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
=======
                {expandedSections.yourTickets ? 'Collapse' : 'View all'}
              </Button>
            </div>
            
            {bookedEvents.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {bookedEvents.map((event) => (
                    <CarouselItem 
                      key={event.id} 
                      className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      style={{ minWidth: expandedSections.yourTickets ? "auto" : "160px", width: expandedSections.yourTickets ? "100%" : "160px" }}
                    >
                      <EventCard 
                        event={event} 
                        view="grid"
                        isBooked={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-gray-100" />
                <CarouselNext className="right-0 bg-gray-100" />
              </Carousel>
            ) : (
              <div className="text-center py-4 bg-secondary/30 rounded-xl">
                <p className="text-muted-foreground">No booked events yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Book events to see them appear here
                </p>
              </div>
            )}
          </div>
          
          {/* Section: Explore Nearby */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">Explore Nearby</h2>
              <Button 
                variant="link" 
                className="text-xs text-green-500 p-0"
                onClick={() => toggleSectionExpanded('exploreNearby')}
              >
                {expandedSections.exploreNearby ? 'Collapse' : 'View all'}
              </Button>
            </div>
            
            {filteredEvents.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {filteredEvents.slice(0, expandedSections.exploreNearby ? filteredEvents.length : 4).map((event) => (
                    <CarouselItem 
                      key={event.id} 
                      className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      style={{ minWidth: expandedSections.exploreNearby ? "auto" : "180px", width: expandedSections.exploreNearby ? "100%" : "180px" }}
                    >
                      <EventCard 
                        key={event.id} 
                        event={event}
                        view="grid"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-gray-100" />
                <CarouselNext className="right-0 bg-gray-100" />
              </Carousel>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events found matching your criteria</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilters({ categories: [], date: null, distance: 10 });
                    setFilteredEvents(events);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Section: More Events */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">More Events</h2>
              <Button 
                variant="link" 
                className="text-xs text-green-500 p-0"
                onClick={() => toggleSectionExpanded('moreEvents')}
              >
                {expandedSections.moreEvents ? 'Collapse' : 'View all'}
              </Button>
            </div>
            
            <div className="space-y-4">
              {nationalEvents.slice(0, expandedSections.moreEvents ? nationalEvents.length : 3).map((event) => (
                <Card 
                  key={event.id}
                  className="overflow-hidden rounded-2xl cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    // Handle click for rectangle event cards
                  }}
                >
                  <div className="flex h-24">
                    {/* Event image */}
                    <div 
                      className="w-1/3 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})` }}
                    />
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
                    
                    {/* Event details */}
                    <div className="w-2/3 p-3 space-y-2">
                      {/* Title and match score */}
                      <div className="flex justify-between">
                        <h3 className="font-medium line-clamp-1">{event.title}</h3>
                        <Badge className="bg-gathr-coral shrink-0">
                          {event.matchScore}%
                        </Badge>
                      </div>
                      
<<<<<<< HEAD
                      {/* Date, time, location */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatEventDate(event.date)} • {formatEventTime(event.time)}</span>
=======
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(event.date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.startTime} - {event.endTime}
                          </div>
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      
                      {/* Description truncated */}
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found matching your criteria</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilters({ categories: [], date: null, distance: 10 });
                  setFilteredEvents(events);
                }}
              >
                Clear filters
              </Button>
            </div>
<<<<<<< HEAD
          )}
=======
          </div>
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
          
          {/* Intersection observer target for infinite loading */}
          <div ref={ref} className="h-10" />
        </div>
      )}
      
      {/* Filter dialog */}
      <EventFilterDialog 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen}
        filters={activeFilters}
        onApplyFilters={applyFilters}
      />
      
      {/* Event detail dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </div>
  );
};

export default FindEvents;
