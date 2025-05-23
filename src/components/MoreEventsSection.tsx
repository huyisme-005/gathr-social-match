
/**
 * MoreEventsSection Component
 * 
 * This component displays the "More Events" section on the home page.
 * It shows events in a list format with proper favorite functionality and navigation.
 */
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { toast } from "sonner";

interface MoreEventsSectionProps {
  events: Event[];
  isLoading: boolean;
  onEventClick: (eventId: string) => void;
}

const MoreEventsSection = ({ events, isLoading, onEventClick }: MoreEventsSectionProps) => {
  const { getFavoriteEvents, toggleEventFavorite } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteToggle = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEventFavorite(eventId);
    
    const favoriteEvents = getFavoriteEvents();
    const isFavorite = favoriteEvents.includes(eventId);
    const event = events.find(e => e.id === eventId);
    
    if (isFavorite) {
      toast.success(`Added ${event?.title} to favorites`);
    } else {
      toast.info(`Removed ${event?.title} from favorites`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">More Events</h2>
        <Button 
          variant="link" 
          className="text-xs text-green-500 p-0"
          onClick={() => navigate("/explore")}
        >
          View all
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => {
            const favoriteEvents = getFavoriteEvents();
            const isFavorite = favoriteEvents.includes(event.id);
            
            return (
              <div 
                key={event.id}
                className="bg-card rounded-2xl overflow-hidden shadow cursor-pointer relative w-full mb-2 flex h-28 md:h-32"
                onClick={() => onEventClick(event.id)}
              >
                {/* Event image */}
                <div 
                  className="w-1/3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                
                {/* Event details */}
                <div className="w-2/3 p-3 flex flex-col justify-between relative">
                  {/* Favorite button */}
                  <button 
                    className="absolute top-2 right-2 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                    onClick={(e) => handleFavoriteToggle(event.id, e)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </button>
                  
                  <div>
                    <h3 className="font-medium text-base line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.location}</p>
                    
                    {/* Time details */}
                    {event.startTime && event.endTime && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs font-medium">${event.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoreEventsSection;
