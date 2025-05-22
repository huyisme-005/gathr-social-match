
/**
 * ExplorePage Component
 * 
 * This page helps users discover events by categories, location, and popularity.
 * It provides a more guided discovery experience than the general search.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import EventFilterDialog from "@/components/EventFilterDialog";

const ExplorePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories] = useState([
    "Music", "Sports", "Food", "Tech", "Art", "Outdoors", 
    "Gaming", "Business", "Health", "Education"
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fetch events on component mount
  useEffect(() => {
    // In a real app, we'd fetch from an API
    // For now, we'll use our mock data
    const enhancedEvents = mockEvents.map(event => ({
      ...event,
      price: Math.floor(Math.random() * 100) + 10,
      startTime: `${event.time}`,
      endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`,
    }));
    
    setEvents(enhancedEvents);
    setFilteredEvents(enhancedEvents);
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term && !selectedCategory) {
      setFilteredEvents(events);
      return;
    }
    
    const filtered = events.filter(event => {
      const matchesSearch = term
        ? event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase())
        : true;
        
      const matchesCategory = selectedCategory
        ? event.categories.includes(selectedCategory)
        : true;
        
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredEvents(
        searchTerm 
          ? events.filter(event => 
              event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : events
      );
    } else {
      setSelectedCategory(category);
      
      const filtered = events.filter(event => {
        const matchesSearch = searchTerm
          ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
          
        return matchesSearch && event.categories.includes(category);
      });
      
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Explore Events</h1>
      
      {/* Search and filter controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8 bg-secondary border-0"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className="bg-secondary border-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Categories */}
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedCategory === category 
                  ? "bg-gathr-coral hover:bg-gathr-coral/90" 
                  : "hover:bg-secondary"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </ScrollArea>
      
      {/* Events grid */}
      <div className="space-y-4 pt-2">
        <h2 className="font-medium">
          {selectedCategory 
            ? `${selectedCategory} Events` 
            : "All Events"}
        </h2>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setFilteredEvents(events);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                view="grid"
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      
      <EventFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={{ categories: selectedCategory ? [selectedCategory] : [], date: null, distance: 10 }}
        onApplyFilters={() => {}} // To be implemented
      />
    </div>
  );
};

export default ExplorePage;
