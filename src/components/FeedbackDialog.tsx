
/**
 * FeedbackDialog Component
 * 
 * This component displays a dialog for submitting feedback after attending an event.
 * It allows users to rate the event, write comments, and provide structured feedback
 * that helps improve future event recommendations.
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Event } from "@/types/event";

interface FeedbackDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog = ({ event, open, onOpenChange }: FeedbackDialogProps) => {
  // State for form values
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState("");
  const [enjoyedMost, setEnjoyedMost] = useState<string[]>([]);
  
  // Options for what users enjoyed most
  const enjoymentOptions = [
    { id: "people", label: "Meeting new people" },
    { id: "content", label: "Event content/activities" },
    { id: "venue", label: "Venue and atmosphere" },
    { id: "organization", label: "Organization and flow" },
  ];
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log({ eventId: event.id, rating, comment, enjoyedMost });
    
    toast.success("Thank you for your feedback!");
    onOpenChange(false);
  };
  
  // Toggle selection of enjoyed aspects
  const toggleEnjoyment = (id: string) => {
    if (enjoyedMost.includes(id)) {
      setEnjoyedMost(enjoyedMost.filter(item => item !== id));
    } else {
      setEnjoyedMost([...enjoyedMost, id]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Event Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              Your feedback helps us improve recommendations for you and others
            </p>
          </div>
          
          {/* Rating */}
          <div className="space-y-2">
            <Label>How would you rate this event?</Label>
            <RadioGroup value={rating} onValueChange={setRating}>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                    <Label 
                      htmlFor={`rating-${value}`} 
                      className="mt-1 text-sm"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-1 text-xs text-muted-foreground mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </RadioGroup>
          </div>
          
          {/* What did you enjoy most */}
          <div className="space-y-2">
            <Label>What did you enjoy most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {enjoymentOptions.map(option => (
                <Button
                  key={option.id}
                  type="button"
                  variant={enjoyedMost.includes(option.id) ? "default" : "outline"}
                  className={enjoyedMost.includes(option.id) ? "bg-gathr-coral hover:bg-gathr-coral/90" : ""}
                  onClick={() => toggleEnjoyment(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment">Additional comments</Label>
            <Textarea 
              id="comment" 
              placeholder="Share your thoughts about the event..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
            onClick={handleSubmit}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
