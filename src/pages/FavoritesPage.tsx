
/**
 * FavoritesPage Component
 * 
 * This page displays all events that the user has marked as favorites.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { useAuth } from "@/contexts/AuthContext";

const FavoritesPage = () => {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const { getFavoriteEvents, toggleEventFavorite } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get favorite event IDs from auth context
    const favoriteIds = getFavoriteEvents();
    
    // In a real app, we'd fetch the full details of each favorite event
    // For now, we'll filter our mock data
    const enhancedEvents = mockEvents
      .filter(event => favoriteIds.includes(event.id))
      .map(event => ({
        ...event,
        price: Math.floor(Math.random() * 100) + 10,
        startTime: `${event.time}`,
        endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`,
      }));
    
    setFavoriteEvents(enhancedEvents);
  }, [getFavoriteEvents]);
  
  const handleRemoveFavorite = (eventId: string) => {
    toggleEventFavorite(eventId);
    setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Favorite Events</h1>
      
      {favoriteEvents.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h2 className="text-lg font-medium mt-4">No favorites yet</h2>
          <p className="text-muted-foreground mt-1">
            Mark events as favorite by tapping the heart icon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteEvents.map(event => (
            <div key={event.id} className="relative">
              <EventCard 
                event={event}
                view="grid"
                onClick={() => navigate(`/event/${event.id}`)}
              />
              <button 
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(event.id);
                }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
