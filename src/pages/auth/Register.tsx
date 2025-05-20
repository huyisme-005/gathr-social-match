
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Twitter, Phone } from "lucide-react";

// List of countries for the dropdown
const countries = [
  "United States", "Canada", "United Kingdom", "Australia", 
  "Germany", "France", "Japan", "China", "India", "Brazil",
  "South Africa", "Nigeria", "Mexico", "Spain", "Italy",
  "Netherlands", "Sweden", "Singapore", "New Zealand", "South Korea"
];

const Register = () => {
  // State for email registration
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  
  // State for phone registration
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  
  const { register, socialLogin, phoneLogin } = useAuth();
  const navigate = useNavigate();
  
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register(name, email, password, country);
      navigate("/personality-test");
    } catch (error) {
      // Error is handled in the context with toast notification
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialRegister = async (provider: "google" | "facebook" | "twitter") => {
    try {
      setIsLoading(true);
      await socialLogin(provider);
      navigate("/personality-test");
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendVerificationCode = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSendingCode(true);
      // In a real app, this would call an API to send the code
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCodeSent(true);
      toast({
        title: "Verification code sent",
        description: "A verification code has been sent to your phone"
      });
    } catch (error) {
      toast({
        title: "Failed to send code",
        description: "Please check your phone number and try again",
        variant: "destructive"
      });
    } finally {
      setIsSendingCode(false);
    }
  };
  
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !verificationCode) {
      toast({
        title: "Missing information",
        description: "Please enter your phone number and verification code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsVerifying(true);
      await phoneLogin(phoneNumber, verificationCode);
      navigate("/personality-test");
    } catch (error) {
      // Error is handled in the context
      console.error("Phone verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gathr-coral">Join Gathr</CardTitle>
        <CardDescription className="text-center">Create an account to discover events and connect with people</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleEmailRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
              >
                {isLoading ? "Creating Account..." : "Sign Up with Email"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="social">
          <CardContent className="space-y-4 pt-4">
            <Button 
              onClick={() => handleSocialRegister("google")}
              disabled={isLoading} 
              className="w-full bg-white text-black border hover:bg-gray-100"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              onClick={() => handleSocialRegister("facebook")}
              disabled={isLoading} 
              className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Continue with Facebook
            </Button>
            
            <Button 
              onClick={() => handleSocialRegister("twitter")}
              disabled={isLoading} 
              className="w-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Continue with Twitter
            </Button>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="phone">
          <form onSubmit={handlePhoneRegister}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="whitespace-nowrap"
                  >
                    {isSendingCode ? "Sending..." : "Send Code"}
                  </Button>
                </div>
              </div>
              
              {codeSent && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    For testing purposes, use code: 123456
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                disabled={isVerifying || !codeSent}
                className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
              >
                <Phone className="mr-2 h-4 w-4" />
                {isVerifying ? "Verifying..." : "Sign Up with Phone"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
      
      <div className="px-8 pb-8">
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-gathr-coral font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default Register;
