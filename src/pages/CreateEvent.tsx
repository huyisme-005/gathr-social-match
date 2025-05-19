
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock3, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { eventCategories } from "../data/eventCategories";
import { toast } from "@/components/ui/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      if (selectedCategories.length < 5) {
        setSelectedCategories([...selectedCategories, category]);
      } else {
        toast({
          title: "Maximum categories reached",
          description: "You can select up to 5 categories",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !date || !time || !location || !capacity || selectedCategories.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      });
      setIsSubmitting(false);
      navigate("/upcoming-events");
    }, 1500);
  };
  
  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold">Create Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            placeholder="Enter a catchy title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What's your event about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock3 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                className="pl-8"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Event location"
              className="pl-8"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <div className="relative">
            <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="capacity"
              type="number"
              placeholder="Maximum number of attendees"
              className="pl-8"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Categories (select up to 5)</Label>
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={selectedCategories.includes(category) 
                  ? "bg-gathr-coral hover:bg-gathr-coral/80 cursor-pointer"
                  : "cursor-pointer hover:bg-muted"}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Event Image URL</Label>
          <Input
            id="image"
            placeholder="Add an image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEvent;
