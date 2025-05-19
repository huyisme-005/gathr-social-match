
/**
 * FindEvents Page
 * 
 * This component is the main event discovery page of the application.
 * It displays a list of events with infinite scrolling, search functionality,
 * and filtering options. Events are recommended based on the user's personality.
 */
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import EventCard from "../components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../contexts/AuthContext";
import EventFilterDialog from "../components/EventFilterDialog";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/event";

const FindEvents = () => {
  // State for all events data
  const [events, setEvents] = useState<Event[]>([]);
  
  // State for filtered events (after search and filter applied)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
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
      <h1 className="text-2xl font-bold">Find Events</h1>
      
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
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Event list or empty state */}
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
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
          )}
          
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
    </div>
  );
};

export default FindEvents;
