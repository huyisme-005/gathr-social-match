
/**
 * Subscription Page
 * 
 * This component allows users to view and select different subscription tiers.
 * It displays the free tier alongside paid premium and enterprise options with their features.
 * 
 * @author Huy Le (huyisme-005)
 * @organization Gathr
 */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Subscription tier details
const tiers = [
  {
    id: "free",
    name: "Free",
    description: "Basic event and connection matching",
    price: "$0",
    period: "forever",
    features: [
      { name: "Personality matching", included: true },
      { name: "Event discovery", included: true },
      { name: "Basic Gathr Circle", included: true },
      { name: "Event messaging (up to 10%)", included: true },
      { name: "Enhanced visibility", included: false },
      { name: "Exclusive events", included: false },
      { name: "Advanced matching algorithm", included: false },
      { name: "Priority messaging", included: false },
      { name: "Premium profile badge", included: false },
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Enhanced visibility and exclusive events",
    price: "$7.99",
    period: "per month",
    features: [
      { name: "Personality matching", included: true },
      { name: "Event discovery", included: true },
      { name: "Basic Gathr Circle", included: true },
      { name: "Event messaging (up to 15%)", included: true },
      { name: "Enhanced visibility", included: true },
      { name: "Exclusive events", included: true },
      { name: "Advanced matching algorithm", included: true },
      { name: "Priority messaging", included: false },
      { name: "Premium profile badge", included: true },
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Corporate accounts for large teams",
    price: "$19.99",
    period: "per month per employee",
    features: [
      { name: "Personality matching", included: true },
      { name: "Event discovery", included: true },
      { name: "Basic Gathr Circle", included: true },
      { name: "Event messaging (unlimited)", included: true },
      { name: "Enhanced visibility", included: true },
      { name: "Exclusive events", included: true },
      { name: "Advanced matching algorithm", included: true },
      { name: "Priority messaging", included: true },
      { name: "Premium profile badge", included: true },
      { name: "Team analytics", included: true },
      { name: "Custom events", included: true },
    ],
    corporateOnly: true
  }
];

const Subscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, upgradeTier } = useAuth();
  const navigate = useNavigate();
  
  // Get current subscription tier
  const currentTier = user?.tier || "free";
  
  // Handle subscription upgrade
  const handleSubscribe = async (tierId: "premium" | "enterprise") => {
    try {
      setIsProcessing(true);
      
      // In a real app, this would redirect to a payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user's subscription tier
      await upgradeTier(tierId);
      
      // Show success toast
      toast({
        title: "Subscription updated",
        description: `You've successfully subscribed to the ${tierId} tier!`,
      });
      
      // Redirect to profile
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was a problem processing your subscription",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upgrade to access premium features and enhance your Gathr experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`${
              currentTier === tier.id ? 'border-gathr-coral ring-2 ring-gathr-coral/20' : ''
            }`}
          >
            <CardHeader>
              {currentTier === tier.id && (
                <div className="py-1 px-3 bg-gathr-coral text-white text-xs font-medium rounded-full w-fit mx-auto mb-2">
                  Current Plan
                </div>
              )}
              <CardTitle className="text-xl text-center">{tier.name}</CardTitle>
              <CardDescription className="text-center">
                {tier.description}
              </CardDescription>
              <div className="text-center mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground ml-1">{tier.period}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              {currentTier !== tier.id ? (
                <Button 
                  className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
                  disabled={isProcessing || tier.id === "free" || (tier.corporateOnly && !user?.isCorporate)}
                  onClick={() => handleSubscribe(tier.id as "premium" | "enterprise")}
                >
                  {isProcessing ? "Processing..." : 
                   tier.corporateOnly && !user?.isCorporate ? "Corporate Only" : 
                   tier.id === "free" ? "Current Tier" : "Subscribe"}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Corporate Accounts</h2>
        <p className="mb-4">
          Gathr offers special plans for companies looking to foster better connections between employees.
          Our enterprise tier helps large offices pay for their employees and targets inter-departmental connections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="sm:flex-1">
            Learn More
          </Button>
          <Button className="sm:flex-1 bg-gathr-coral hover:bg-gathr-coral/90">
            Contact Sales
          </Button>
        </div>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Event Sponsorship Opportunities</h2>
        <p className="mb-4">
          Partner with Gathr to sponsor events based on the number of expected participants.
          Create branded event pages, offer exclusive perks, and connect with our user base.
        </p>
        <Button className="bg-gathr-coral hover:bg-gathr-coral/90">
          Become a Sponsor
        </Button>
      </div>
    </div>
  );
};

export default Subscription;
