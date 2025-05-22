
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Facebook, Github, Mail, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  // State for different login methods
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth context and navigation
  const { login, socialLogin, phoneLogin } = useAuth();
  const navigate = useNavigate();
  
  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const success = login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/find-events");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle phone login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      // Send verification code (simulated in this demo)
      // In a real app, this would call a backend API to send SMS
      setIsCodeSent(true);
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${phoneNumber}. Use code 123456 for demo.`,
      });
    } else {
      try {
        setIsLoading(true);
        await phoneLogin(phoneNumber, verificationCode);
        navigate("/find-events");
      } catch (error) {
        // Error is handled in the context with toast notification
        console.error("Phone login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle social media login
  const handleSocialLogin = async (provider: "google" | "facebook" | "twitter") => {
    try {
      setIsLoading(true);
      await socialLogin(provider);
      navigate("/find-events");
    } catch (error) {
      // Error is handled in the context with toast notification
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gathr-coral">Login to Gathr</CardTitle>
        <CardDescription className="text-center">Connect with events and people that match your personality</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleEmailLogin}>
            <CardContent className="space-y-4">
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
              
              <div className="text-sm text-center">
                <span>For demo, use: </span>
                <span className="font-medium">you@example.com / password123</span>
                <br />
                <span>For admin demo: </span>
                <span className="font-medium">admin@example.com / admin123</span>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
              >
                {isLoading ? "Logging in..." : "Login with Email"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSocialLogin("google")}
                >
                  <svg 
                    className="h-4 w-4 mr-2" 
                    aria-hidden="true" 
                    focusable="false" 
                    data-prefix="fab" 
                    data-icon="google"
                    role="img" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 488 512"
                  >
                    <path 
                      fill="currentColor" 
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </form>
        </TabsContent>
        
        <TabsContent value="phone">
          <form onSubmit={handlePhoneLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isCodeSent}
                />
              </div>
              
              {isCodeSent && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    For demo purposes, use code: <span className="font-medium">123456</span>
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gathr-coral hover:bg-gathr-coral/90"
              >
                {isLoading ? "Verifying..." : 
                 !isCodeSent ? "Send Verification Code" : "Verify & Login"}
              </Button>
            </CardContent>
          </form>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-gathr-coral font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
