
/**
 * FindEvents Page (Home)
 * 
 * This component is the main event discovery page of the application.
 * It displays a list of events with infinite scrolling, search functionality,
 * and filtering options. Events are recommended based on the user's personality.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

const FindEvents = () => {
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [moreEvents, setMoreEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getFavoriteEvents, toggleEventFavorite } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // Add price and time details to events
      const enhancedEvents = mockEvents.map(event => ({
        ...event,
        price: Math.floor(Math.random() * 100) + 10,
        startTime: `${event.time}`,
        endTime: `${parseInt(event.time.split(':')[0]) + 2}:${event.time.split(':')[1]}`,
      }));
      
      // Get booked events (first 3 for demo)
      setBookedEvents(enhancedEvents.slice(0, 3));
      
      // Get nearby events
      setNearbyEvents(enhancedEvents.slice(3, 7));
      
      // Get more events (show all remaining events + custom events)
      setMoreEvents([...enhancedEvents.slice(7), ...customMoreEvents]);
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  // Handle favorite toggle for More Events section
  const handleFavoriteToggle = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEventFavorite(eventId);
    
    const favoriteEvents = getFavoriteEvents();
    const isFavorite = favoriteEvents.includes(eventId);
    
    if (!isFavorite) {
      const event = moreEvents.find(e => e.id === eventId);
      toast.success(`Added ${event?.title} to favorites`);
    } else {
      const event = moreEvents.find(e => e.id === eventId);
      toast.info(`Removed ${event?.title} from favorites`);
    }
  };

  // Add custom events for More Events section with images
  const customMoreEvents: Event[] = [
    {
      id: "custom-1",
      title: "Startup Pitch Night",
      description: "Watch and vote for the best new startups in your city. Network with founders and investors.",
      date: "2025-07-10",
      time: "18:00",
      location: "City Innovation Hub",
      imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
      capacity: 120,
      attendees: 80,
      categories: ["Business", "Networking", "Tech"],
      creator: { id: "201", name: "Startup Org" },
      matchScore: 92,
      price: 25,
      startTime: "18:00",
      endTime: "21:00"
    },
    {
      id: "custom-2",
      title: "Outdoor Movie Marathon",
      description: "Enjoy a night of classic films under the stars. Bring your own blanket!",
      date: "2025-07-15",
      time: "20:00",
      location: "Central Park Lawn",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      capacity: 300,
      attendees: 210,
      categories: ["Entertainment", "Outdoors", "Social"],
      creator: { id: "202", name: "City Events" },
      matchScore: 88,
      price: 12,
      startTime: "20:00",
      endTime: "01:00"
    },
    {
      id: "custom-3",
      title: "Vegan Food Festival",
      description: "Taste the best vegan dishes from local chefs and food trucks. Live music and workshops included.",
      date: "2025-07-20",
      time: "11:00",
      location: "Riverfront Plaza",
      imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
      capacity: 500,
      attendees: 350,
      categories: ["Food & Drink", "Wellness", "Music"],
      creator: { id: "203", name: "Vegan Society" },
      matchScore: 85,
      price: 8,
      startTime: "11:00",
      endTime: "17:00"
    },
    {
      id: "custom-4",
      title: "Board Game Social",
      description: "Meet new friends and play your favorite board games. All skill levels welcome!",
      date: "2025-07-25",
      time: "19:00",
      location: "Community Center Room B",
      imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      capacity: 60,
      attendees: 40,
      categories: ["Gaming", "Social", "Entertainment"],
      creator: { id: "204", name: "Board Gamers Club" },
      matchScore: 80,
      price: 5,
      startTime: "19:00",
      endTime: "23:00"
    },
    {
      id: "custom-5",
      title: "Digital Art Workshop",
      description: "Learn digital art techniques with professional artists. Tablets and software provided.",
      date: "2025-08-01",
      time: "13:00",
      location: "Creative Space Studio",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
      capacity: 25,
      attendees: 18,
      categories: ["Arts", "Tech", "Creative"],
      creator: { id: "205", name: "Digital Artists Guild" },
      matchScore: 75,
      price: 60,
      startTime: "13:00",
      endTime: "17:00"
    },
    {
      id: "custom-6",
      title: "Hiking Adventure",
      description: "Explore scenic mountain trails with experienced guides. All fitness levels welcome.",
      date: "2025-08-05",
      time: "08:00",
      location: "Mountain Trail Head",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      capacity: 40,
      attendees: 32,
      categories: ["Outdoors", "Fitness", "Adventure"],
      creator: { id: "206", name: "Hiking Club" },
      matchScore: 70,
      price: 20,
      startTime: "08:00",
      endTime: "16:00"
    },
    {
      id: "custom-7",
      title: "Wine Tasting Evening",
      description: "Sample premium wines from local vineyards with expert sommelier guidance.",
      date: "2025-08-08",
      time: "19:00",
      location: "Wine Bar & Bistro",
      imageUrl: "https://images.unsplash.com/photo-1554490712-b2515a5d8f8d",
      capacity: 30,
      attendees: 25,
      categories: ["Food & Drink", "Social", "Cultural"],
      creator: { id: "207", name: "Wine Society" },
      matchScore: 82,
      price: 45,
      startTime: "19:00",
      endTime: "22:00"
    },
    {
      id: "custom-8",
      title: "Coding Bootcamp",
      description: "Intensive coding workshop covering modern web development technologies.",
      date: "2025-08-12",
      time: "10:00",
      location: "Tech Academy",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      capacity: 50,
      attendees: 38,
      categories: ["Tech", "Educational", "Professional"],
      creator: { id: "208", name: "Code Academy" },
      matchScore: 90,
      price: 120,
      startTime: "10:00",
      endTime: "18:00"
    },
    {
      id: "custom-9",
      title: "Jazz Night",
      description: "Enjoy live jazz performances from local musicians in an intimate setting.",
      date: "2025-08-15",
      time: "20:30",
      location: "Jazz Lounge",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      capacity: 80,
      attendees: 65,
      categories: ["Music", "Entertainment", "Cultural"],
      creator: { id: "209", name: "Jazz Society" },
      matchScore: 73,
      price: 30,
      startTime: "20:30",
      endTime: "23:30"
    },
    {
      id: "custom-10",
      title: "Mindfulness Meditation",
      description: "Learn meditation techniques for stress relief and mental clarity.",
      date: "2025-08-18",
      time: "09:00",
      location: "Wellness Center",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      capacity: 35,
      attendees: 28,
      categories: ["Wellness", "Spiritual", "Self-Care"],
      creator: { id: "210", name: "Mindfulness Center" },
      matchScore: 68,
      price: 25,
      startTime: "09:00",
      endTime: "11:00"
    },
    {
      id: "custom-11",
      title: "Photography Walk",
      description: "Capture the beauty of urban landscapes with professional photographers.",
      date: "2025-08-22",
      time: "14:00",
      location: "Downtown District",
      imageUrl: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848",
      capacity: 20,
      attendees: 15,
      categories: ["Photography", "Outdoors", "Creative"],
      creator: { id: "211", name: "Photo Club" },
      matchScore: 77,
      price: 15,
      startTime: "14:00",
      endTime: "17:00"
    },
    {
      id: "custom-12",
      title: "Cooking Masterclass",
      description: "Learn to prepare gourmet dishes with professional chefs.",
      date: "2025-08-25",
      time: "17:00",
      location: "Culinary Institute",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      capacity: 16,
      attendees: 12,
      categories: ["Food & Drink", "Educational", "Creative"],
      creator: { id: "212", name: "Culinary School" },
      matchScore: 86,
      price: 75,
      startTime: "17:00",
      endTime: "20:00"
    },
    {
      id: "custom-13",
      title: "Book Club Meeting",
      description: "Discuss this month's featured novel with fellow book lovers.",
      date: "2025-08-28",
      time: "18:30",
      location: "City Library",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      capacity: 25,
      attendees: 18,
      categories: ["Literary", "Social", "Educational"],
      creator: { id: "213", name: "Book Lovers Society" },
      matchScore: 71,
      price: 0,
      startTime: "18:30",
      endTime: "20:30"
    },
    {
      id: "custom-14",
      title: "Dance Workshop",
      description: "Learn contemporary dance moves in a supportive environment.",
      date: "2025-09-01",
      time: "16:00",
      location: "Dance Studio Central",
      imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
      capacity: 30,
      attendees: 22,
      categories: ["Dance", "Fitness", "Creative"],
      creator: { id: "214", name: "Dance Academy" },
      matchScore: 84,
      price: 35,
      startTime: "16:00",
      endTime: "18:00"
    },
    {
      id: "custom-15",
      title: "Volunteer Beach Cleanup",
      description: "Help preserve our coastline while meeting environmentally conscious people.",
      date: "2025-09-05",
      time: "09:00",
      location: "Sunrise Beach",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      capacity: 50,
      attendees: 35,
      categories: ["Environmental", "Volunteer", "Outdoors"],
      creator: { id: "215", name: "Green Earth Initiative" },
      matchScore: 79,
      price: 0,
      startTime: "09:00",
      endTime: "12:00"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with greeting and notification */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Hi, {user?.name}</h1>
          <p className="text-sm text-muted-foreground">Find your favorite event</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Your Ticket Events */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Your Ticket Events</h2>
          <Button 
            variant="link" 
            className="text-xs text-green-500 p-0"
            onClick={() => navigate("/tickets")}
          >
            View all
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2].map(i => (
              <div
                key={i}
                className="w-40 h-40 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : bookedEvents.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-4">
              {bookedEvents.map(event => (
                <div 
                  key={event.id} 
                  className="w-40 shrink-0"
                  onClick={() => handleEventClick(event.id)}
                >
                  <EventCard 
                    event={event} 
                    view="grid"
                    isBooked={true}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 bg-secondary/30 rounded-xl">
            <p className="text-muted-foreground">No booked events yet</p>
          </div>
        )}
      </div>
      
      {/* Explore Nearby */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Explore Nearby</h2>
          <Button 
            variant="link" 
            className="text-xs text-green-500 p-0"
            onClick={() => navigate("/explore")}
          >
            View all
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex overflow-x-auto gap-4 pb-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-40 h-40 rounded-2xl bg-gray-200 animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-4">
              {nearbyEvents.map(event => (
                <div 
                  key={event.id} 
                  className="w-40 shrink-0"
                  onClick={() => handleEventClick(event.id)}
                >
                  <EventCard 
                    event={event} 
                    view="grid"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* More Events */}
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
            {moreEvents.map(event => {
              const favoriteEvents = getFavoriteEvents();
              const isFavorite = favoriteEvents.includes(event.id);
              
              return (
                <div 
                  key={event.id}
                  className="bg-card rounded-2xl overflow-hidden shadow cursor-pointer relative w-full mb-2 flex h-28 md:h-32"
                  onClick={() => handleEventClick(event.id)}
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
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
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
    </div>
  );
};

export default FindEvents;
