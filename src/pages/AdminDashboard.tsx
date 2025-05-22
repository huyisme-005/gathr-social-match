/**
 * AdminDashboard Component
 * 
 * Platform owner dashboard that provides analytics, user management,
 * security monitoring, and other admin features.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Import admin components
import AdminMetrics from "@/components/admin/AdminMetrics";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import SecurityTab from "@/components/admin/SecurityTab";
import SettingsTab from "@/components/admin/SettingsTab";

// Import dialog components
import SecurityReportDialog from "@/components/admin/dialogs/SecurityReportDialog";
import InvestigationDialog from "@/components/admin/dialogs/InvestigationDialog";
import AddUserDialog from "@/components/admin/dialogs/AddUserDialog";

// Import types
import type { User, SecurityAlert, SecurityReport, NewUser } from "@/types/admin";

// Simulate real-world data with randomized variations
const generateRealData = () => {
  // Base data
  const baseUserGrowth = [1240, 1830, 2300, 3400, 4200, 5100, 6800];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  
  // Add random variations (+/- 10%)
  const userGrowthData = baseUserGrowth.map((users, index) => {
    const variation = users * (0.9 + Math.random() * 0.2); // +/- 10%
    return {
      month: months[index],
      users: Math.round(variation)
    };
  });
  
  return {
    userGrowthData,
    eventData: [
      { name: "Created", value: Math.round(850 * (0.9 + Math.random() * 0.2)) },
      { name: "Attended", value: Math.round(3200 * (0.9 + Math.random() * 0.2)) },
      { name: "Cancelled", value: Math.round(120 * (0.9 + Math.random() * 0.2)) },
    ],
    demographicData: [
      { age: "18-24", users: Math.round(2500 * (0.9 + Math.random() * 0.2)) },
      { age: "25-34", users: Math.round(4800 * (0.9 + Math.random() * 0.2)) },
      { age: "35-44", users: Math.round(3100 * (0.9 + Math.random() * 0.2)) },
      { age: "45-54", users: Math.round(1400 * (0.9 + Math.random() * 0.2)) },
      { age: "55+", users: Math.round(800 * (0.9 + Math.random() * 0.2)) },
    ],
    usersByCountry: [
      { country: "United States", users: Math.round(4200 * (0.9 + Math.random() * 0.2)) },
      { country: "United Kingdom", users: Math.round(1800 * (0.9 + Math.random() * 0.2)) },
      { country: "Germany", users: Math.round(1400 * (0.9 + Math.random() * 0.2)) },
      { country: "Canada", users: Math.round(1100 * (0.9 + Math.random() * 0.2)) },
      { country: "Australia", users: Math.round(950 * (0.9 + Math.random() * 0.2)) },
      { country: "Others", users: Math.round(2550 * (0.9 + Math.random() * 0.2)) },
    ]
  };
};

// Mock user data for admin panel - Using the imported User type
const mockUsers: User[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", country: "United States", status: "active", hasCompletedPersonalityTest: true },
  { id: "2", name: "Michael Chen", email: "michael@example.com", country: "Canada", status: "active", hasCompletedPersonalityTest: true },
  { id: "3", name: "Emma Wilson", email: "emma@example.com", country: "United Kingdom", status: "premium", hasCompletedPersonalityTest: true },
  { id: "4", name: "Carlos Mendez", email: "carlos@example.com", country: "Spain", status: "suspended", hasCompletedPersonalityTest: false },
  { id: "5", name: "Priya Sharma", email: "priya@example.com", country: "India", status: "active", hasCompletedPersonalityTest: true },
  { id: "6", name: "David Kim", email: "david@example.com", country: "South Korea", status: "premium", hasCompletedPersonalityTest: true },
  { id: "7", name: "Fatima Al-Farsi", email: "fatima@example.com", country: "UAE", status: "active", hasCompletedPersonalityTest: false },
  { id: "8", name: "John Smith", email: "john@example.com", country: "Australia", status: "suspended", hasCompletedPersonalityTest: true },
  { id: "9", name: "Sophia Rodriguez", email: "sophia@example.com", country: "Mexico", status: "premium", hasCompletedPersonalityTest: true },
  { id: "10", name: "Mohammed Al-Karim", email: "mohammed@example.com", country: "Saudi Arabia", status: "active", hasCompletedPersonalityTest: false },
  { id: "11", name: "Anna Petrov", email: "anna@example.com", country: "Russia", status: "active", hasCompletedPersonalityTest: true },
  { id: "12", name: "Liu Wei", email: "liu@example.com", country: "China", status: "premium", hasCompletedPersonalityTest: true },
];

// Mock security alerts
const securityAlerts: SecurityAlert[] = [
  {
    id: 1,
    type: "critical",
    title: "Multiple failed login attempts",
    description: "10+ failed login attempts for user account john@example.com",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "warning",
    title: "Unusual login activity",
    description: "Login from new location for admin account",
    timestamp: "1 day ago"
  },
  {
    id: 3,
    type: "warning",
    title: "Spam activity detected",
    description: "Potential spam messages sent by user robert@example.com",
    timestamp: "3 days ago"
  }
];

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [activeUsers, setActiveUsers] = useState(5687);
  const [totalEvents, setTotalEvents] = useState(3276);
  const [conversionRate, setConversionRate] = useState(12.4);
  const [securityAlertCount, setSecurityAlertCount] = useState(3);
  
  // State for user management
  const [usersPerPage] = useState(4);
  const [totalUsers] = useState(mockUsers.length);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState(generateRealData());
  
  // State for security report
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportData, setReportData] = useState<SecurityReport | null>(null);
  
  // State for investigation dialogs
  const [investigationAlert, setInvestigationAlert] = useState<SecurityAlert | null>(null);
  const [showInvestigationDialog, setShowInvestigationDialog] = useState(false);
  
  // State for add user dialog
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Refresh analytics data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(generateRealData());
      
      // Simulate small changes to metrics
      setActiveUsers(prev => Math.round(prev * (0.99 + Math.random() * 0.02)));
      setTotalEvents(prev => Math.round(prev * (0.99 + Math.random() * 0.02)));
      setConversionRate(prev => +(prev * (0.99 + Math.random() * 0.02)).toFixed(1));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle export users
  const handleExport = () => {
    // Create CSV string
    const headers = ["Name", "Email", "Country", "Status"];
    const csvRows = [headers.join(",")];
    
    mockUsers.forEach(user => {
      const row = [user.name, user.email, user.country, user.status];
      csvRows.push(row.join(","));
    });
    
    // Create downloadable link
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "gathr_users.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export successful",
      description: `${mockUsers.length} users exported to CSV`,
    });
  };
  
  // Handle security report generation
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate API call to generate report
    setTimeout(() => {
      setReportData({
        generatedAt: new Date().toISOString(),
        summary: {
          totalAlerts: 12,
          criticalAlerts: 1,
          highAlerts: 4,
          mediumAlerts: 7,
          resolvedAlerts: 9
        },
        loginActivity: {
          successfulLogins: 428,
          failedLogins: 32,
          suspiciousLogins: 7
        },
        vulnerabilities: [
          { severity: "high", description: "Weak password policy enforcement", recommendation: "Implement stronger password requirements" },
          { severity: "medium", description: "Session timeout too long", recommendation: "Reduce session timeout to 30 minutes" },
          { severity: "low", description: "Missing HSTS headers", recommendation: "Configure HSTS headers on web server" }
        ]
      });
      
      setIsGeneratingReport(false);
      setShowReportDialog(true);
    }, 2000);
  };
  
  // Handle investigation
  const handleInvestigate = (alert: SecurityAlert) => {
    setInvestigationAlert(alert);
    setShowInvestigationDialog(true);
  };
  
  // Handle add user
  const handleAddUser = (newUser: NewUser) => {
    // Simulate API call to add user
    toast({
      title: "User added",
      description: `${newUser.name} has been added to the platform`
    });
  };
  
  if (!isAdmin || !user) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/find-events")} 
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to App</span>
          </Button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Welcome, {user.name}</p>
      </div>
      
      {/* Key metrics */}
      <AdminMetrics 
        activeUsers={activeUsers} 
        totalEvents={totalEvents} 
        conversionRate={conversionRate} 
        securityAlertCount={securityAlertCount} 
      />
      
      {/* Main dashboard tabs */}
      <Tabs defaultValue="analytics">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsTab analyticsData={analyticsData} />
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <UsersTab 
            users={mockUsers}
            usersPerPage={usersPerPage}
            onExport={handleExport}
            onAddUser={() => setShowAddUserDialog(true)}
          />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab 
            securityAlerts={securityAlerts}
            onInvestigate={handleInvestigate}
            onGenerateReport={handleGenerateReport}
            isGeneratingReport={isGeneratingReport}
          />
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <SecurityReportDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog} 
        reportData={reportData} 
      />
      
      <InvestigationDialog 
        open={showInvestigationDialog} 
        onOpenChange={setShowInvestigationDialog} 
        alert={investigationAlert} 
      />
      
      <AddUserDialog 
        open={showAddUserDialog} 
        onOpenChange={setShowAddUserDialog} 
        onAddUser={handleAddUser} 
      />
    </div>
  );
};

export default AdminDashboard;
