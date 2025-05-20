
/**
 * CallDialog Component
 * 
 * This component provides a dialog for initiating voice or video calls with event attendees.
 * It provides simulated calling functionality with call controls and status updates.
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: {
    id: string;
    name: string;
    image?: string;
  };
  callType: "audio" | "video";
}

const CallDialog = ({ open, onOpenChange, attendee, callType }: CallDialogProps) => {
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "connected" | "ended">("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Handle call status changes
  useEffect(() => {
    if (open) {
      // Simulate call connection flow
      setCallStatus("connecting");
      const connectionTimer = setTimeout(() => {
        setCallStatus("ringing");
        
        // Simulate call being answered after a random period
        const answerTimer = setTimeout(() => {
          setCallStatus("connected");
          toast({
            title: "Call connected",
            description: `You are now connected with ${attendee.name}`,
          });
        }, 2000 + Math.random() * 3000);
        
        return () => clearTimeout(answerTimer);
      }, 1000);
      
      return () => clearTimeout(connectionTimer);
    } else {
      // Reset call status when dialog closes
      setCallStatus("ended");
      setCallDuration(0);
    }
  }, [open, attendee.name]);
  
  // Handle call duration timer
  useEffect(() => {
    let durationTimer: ReturnType<typeof setInterval>;
    
    if (callStatus === "connected") {
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [callStatus]);
  
  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // End the call
  const handleEndCall = () => {
    setCallStatus("ended");
    toast({
      title: "Call ended",
      description: `Call with ${attendee.name} has ended`,
    });
    onOpenChange(false);
  };
  
  // Toggle mute status
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone enabled" : "Microphone muted",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you",
    });
  };
  
  // Toggle video status
  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      title: isVideoOff ? "Camera enabled" : "Camera disabled",
      description: isVideoOff ? "Others can now see you" : "Others cannot see you",
    });
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === "connecting" && "Connecting..."}
            {callStatus === "ringing" && "Calling..."}
            {callStatus === "connected" && "On Call"}
            {callStatus === "ended" && "Call Ended"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {callStatus === "connected" ? `Duration: ${formatDuration(callDuration)}` : attendee.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-6">
          <div className="relative">
            {/* Main call view - could be a video stream in a real implementation */}
            <div className={`h-40 w-40 rounded-full flex items-center justify-center ${
              callType === "video" && callStatus === "connected" && !isVideoOff 
                ? "bg-black" 
                : "bg-muted"
            }`}>
              {(callType === "audio" || isVideoOff || callStatus !== "connected") && (
                <Avatar className="h-40 w-40">
                  <AvatarImage src={attendee.image} />
                  <AvatarFallback className="text-4xl bg-gathr-coral text-white">
                    {getInitials(attendee.name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-background border">
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "ringing" && "Ringing..."}
              {callStatus === "connected" && "Connected"}
              {callStatus === "ended" && "Call Ended"}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center sm:justify-center gap-4">
          {callStatus === "connected" && (
            <>
              {/* Mute toggle button */}
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-100' : ''}`}
                onClick={handleToggleMute}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </Button>
              
              {/* Video toggle button (only for video calls) */}
              {callType === "video" && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isVideoOff ? 'bg-red-100' : ''}`}
                  onClick={handleToggleVideo}
                >
                  {isVideoOff ? <VideoOff /> : <Video />}
                </Button>
              )}
            </>
          )}
          
          {/* End call button */}
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
