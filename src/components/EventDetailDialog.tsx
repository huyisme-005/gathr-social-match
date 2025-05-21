
/**
 * EventDetailDialog Component
 * 
 * This component displays detailed information about an event in a dialog.
 * It shows full event description, location details, attendee information,
 * and provides options to book the event or message attendees.
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, BookOpen, MapPin, Calendar, Clock, DollarSign, CreditCard, AlertCircle, Timer } from "lucide-react";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow, format } from "date-fns";

interface EventDetailDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock attendees for demonstration
const mockAttendees = [
  { id: "1", name: "Alex Johnson", avatar: "", personalityMatch: 85 },
  { id: "2", name: "Jamie Smith", avatar: "", personalityMatch: 72 },
  { id: "3", name: "Taylor Brown", avatar: "", personalityMatch: 65 },
  { id: "4", name: "Casey Wilson", avatar: "", personalityMatch: 91 },
  { id: "5", name: "Jordan Lee", avatar: "", personalityMatch: 78 },
];

const EventDetailDialog = ({ event, open, onOpenChange }: EventDetailDialogProps) => {
  const { user } = useAuth();
  const [showAttendees, setShowAttendees] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingTime, setBookingTime] = useState<Date | null>(null);
  
  // Check if the event is within 24 hours to allow seeing attendees
  const eventDate = new Date(event.date);
  const now = new Date();
  const isWithin24Hours = eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
  
  // Format the date for display
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  // Format the time for display
  const startTime = event.startTime || event.time;
  const endTime = event.endTime || '';
  const displayTime = endTime ? `${startTime} - ${endTime}` : startTime;

  // Handle booking an event
  const handleBookEvent = () => {
    setShowPayment(true);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setShowPayment(false);
    setIsBooked(true);
    setBookingTime(new Date());
    toast.success("Event booked successfully!");
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setShowPayment(false);
    toast.error("Payment canceled");
  };

  // Handle canceling a booking
  const handleCancelBooking = () => {
    const currentTime = new Date();
    const bookTime = bookingTime || new Date();
    const hoursSinceBooked = (currentTime.getTime() - bookTime.getTime()) / (1000 * 60 * 60);
    
    setIsBooked(false);
    
    if (hoursSinceBooked <= 24) {
      toast.success("Booking canceled with full refund!");
    } else {
      toast.info("Booking canceled successfully! No refund available after 24 hours.");
    }
  };

  // Handle messaging attendees
  const handleMessageAttendees = () => {
    toast.success("Message sent to selected attendees");
  };

  // Handle adding to Gathr circle
  const handleAddToCircle = (attendeeId: string) => {
    toast.success("Added to your Gathr circle");
  };

  // Show attendees only if we're within 24 hours of the event
  useEffect(() => {
    if (isWithin24Hours && isBooked) {
      setShowAttendees(true);
    } else {
      setShowAttendees(false);
    }
  }, [isWithin24Hours, isBooked]);

  // Render payment overlay
  const renderPaymentOverlay = () => {
    return (
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{event.title}</span>
              <span className="text-xl font-bold">${event.price}</span>
            </div>
            
            <div className="border-t border-b py-2">
              <div className="flex justify-between text-sm py-1">
                <span>Event Price</span>
                <span>${event.price}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span>Service Fee</span>
                <span>${Math.round(event.price * 0.1)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>${event.price + Math.round(event.price * 0.1)}</span>
              </div>
            </div>
            
            <div className="bg-secondary/20 p-3 rounded-lg text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gathr-coral shrink-0 mt-0.5" />
                <p>Full refund available if cancelled within 24 hours of booking.</p>
              </div>
              <div className="flex items-start gap-2">
                <Timer className="h-4 w-4 text-gathr-coral shrink-0 mt-0.5" />
                <p>No refunds after the 24-hour grace period.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handlePaymentComplete}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handlePaymentCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
          </DialogHeader>
          
          {/* Event image */}
          <div className="relative rounded-lg overflow-hidden h-48 mb-4">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white">
                ${event.price}
              </Badge>
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-black/50 rounded-tl-lg">
              <Badge className="bg-gathr-coral">
                {event.matchScore}% Match
              </Badge>
            </div>
          </div>
          
          {/* Event details */}
          <div className="space-y-4">
            {/* Date and time */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gathr-coral" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gathr-coral" />
                <span>{displayTime}</span>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gathr-coral shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-gathr-coral shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">About this event</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-gathr-coral shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">Price</h4>
                <p className="text-sm text-muted-foreground">${event.price} USD</p>
                <p className="text-xs text-muted-foreground mt-1">Full refund available if cancelled within 24 hours of booking</p>
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {event.categories.map((category, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            
            {/* Attendees section - only shown if within 24h and booked */}
            {showAttendees && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-gathr-coral" />
                    Attendees ({event.attendees})
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {mockAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>{attendee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground">{attendee.personalityMatch}% match</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAddToCircle(attendee.id)}
                      >
                        Add to circle
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Message attendees button */}
                <Button 
                  className="w-full mt-4 bg-gathr-coral hover:bg-gathr-coral/90"
                  onClick={handleMessageAttendees}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Attendees
                </Button>
              </div>
            )}
            
            {/* Book event button */}
            {!isBooked ? (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={handleBookEvent}
              >
                Book Now
              </Button>
            ) : (
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      {renderPaymentOverlay()}
    </>
  );
};

export default EventDetailDialog;
