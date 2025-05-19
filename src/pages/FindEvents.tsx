
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
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    date: null as Date | null,
    distance: 10,
  });
  
  const { user } = useAuth();
  const { ref, inView } = useInView();
  
  // Initial load
  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Load more events when scrolling to bottom
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
  
  // Filter events when search term changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term && !activeFilters.categories.length && !activeFilters.date) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter((event) => {
      const matchesSearch = term
        ? event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase())
        : true;
        
      const matchesCategory = activeFilters.categories.length
        ? activeFilters.categories.some((cat) => event.categories.includes(cat))
        : true;
        
      // Add more filter logic here as needed
        
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
  };
  
  // Apply filters
  const applyFilters = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
    
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
  
  // Suggest events based on user's personality
  useEffect(() => {
    if (user?.personalityTags?.length) {
      const personalityTags = user.personalityTags;
      
      // Sort events by relevance to user's personality
      const sortedEvents = [...filteredEvents].sort((a, b) => {
        const aMatches = a.categories.filter((cat) => personalityTags.includes(cat)).length;
        const bMatches = b.categories.filter((cat) => personalityTags.includes(cat)).length;
        return bMatches - aMatches;
      });
      
      setFilteredEvents(sortedEvents);
    }
  }, [user?.personalityTags, events]);
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Find Events</h1>
      
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
