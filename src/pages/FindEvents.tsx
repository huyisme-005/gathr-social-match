
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
import { Search, Filter, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../contexts/AuthContext";
import EventFilterDialog from "../components/EventFilterDialog";
import EventCard from "../components/EventCard";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";
import { ThemeToggle } from "../components/ThemeToggle";

const FindEvents = () => {
  // State for all events data
  const [events, setEvents] = useState<Event[]>([]);
  
  // State for filtered events (after search and filter applied)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // State for booked events
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  
  // State for more events (national)
  const [nationalEvents, setNationalEvents] = useState<Event[]>([]);
  
  // Loading state for initial data fetching
  const [isLoading, setIsLoading] = useState(true);
  
  // State for search input value
  const [searchTerm, setSearchTerm] = useState("");
  
  // Current page number for infinite scrolling
  const [page, setPage] = useState(1);
  
  // State to control filter dialog visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],  // Selected event categories
    date: null as Date | null,   // Selected date filter
    distance: 10,                // Selected distance radius in km
  });
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      
      // Get some random events for the booked section
      setBookedEvents(mockEvents.slice(0, 3));
      
      // Get some random events for the national section
      setNationalEvents(mockEvents.slice(6, 12));
      
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Explore Events</h1>
        <ThemeToggle />
      </div>
      
      {/* Search and filter controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8 bg-secondary border-0"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className={`bg-secondary border-0 ${activeFilters.categories.length ? "text-gathr-coral" : ""}`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="event-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Section: Your Ticket Events */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">Your Ticket Events</h2>
              <Button variant="link" className="text-xs text-gathr-coral p-0">View all</Button>
            </div>
            
            {bookedEvents.length > 0 ? (
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                {bookedEvents.map((event) => (
                  <div key={event.id} className="min-w-[160px] w-[160px]">
                    <EventCard 
                      event={event} 
                      view="grid"
                      isBooked={true}
                    />
                  </div>
                ))}
              </div>
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
              <Button variant="link" className="text-xs text-gathr-coral p-0">View all</Button>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="event-grid">
                {filteredEvents.slice(0, 4).map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    view="grid"
                  />
                ))}
              </div>
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
              <Button variant="link" className="text-xs text-gathr-coral p-0">View all</Button>
            </div>
            
            <div className="space-y-4">
              {nationalEvents.slice(0, 3).map((event) => (
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
                    
                    {/* Event details */}
                    <div className="w-2/3 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {event.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(event.date), "MMM d")}
                        </div>
                        
                        <Badge className="bg-gathr-coral text-xs">
                          {event.matchScore}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Intersection observer target for infinite loading */}
          <div ref={ref} className="h-10" />
        </>
      )}
      
      {/* Filter dialog */}
      <EventFilterDialog 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen}
        filters={activeFilters}
        onApplyFilters={applyFilters}
      />
    </div>
  );
};

export default FindEvents;
