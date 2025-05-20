
/**
 * AdminDashboard Component
 * 
 * Platform owner dashboard that provides analytics, user management,
 * security monitoring, and other admin features.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Download, UserPlus, FileText } from "lucide-react";
import axios from "axios";
import { Label } from "@/components/ui/label";

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

// Mock user data for admin panel
const mockUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", country: "United States", status: "active" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", country: "Canada", status: "active" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", country: "United Kingdom", status: "premium" },
  { id: 4, name: "Carlos Mendez", email: "carlos@example.com", country: "Spain", status: "suspended" },
  { id: 5, name: "Priya Sharma", email: "priya@example.com", country: "India", status: "active" },
  { id: 6, name: "David Kim", email: "david@example.com", country: "South Korea", status: "premium" },
  { id: 7, name: "Fatima Al-Farsi", email: "fatima@example.com", country: "UAE", status: "active" },
  { id: 8, name: "John Smith", email: "john@example.com", country: "Australia", status: "suspended" },
  { id: 9, name: "Sophia Rodriguez", email: "sophia@example.com", country: "Mexico", status: "premium" },
  { id: 10, name: "Mohammed Al-Karim", email: "mohammed@example.com", country: "Saudi Arabia", status: "active" },
  { id: 11, name: "Anna Petrov", email: "anna@example.com", country: "Russia", status: "active" },
  { id: 12, name: "Liu Wei", email: "liu@example.com", country: "China", status: "premium" },
];

// Mock security alerts
const securityAlerts = [
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
  const [filteredUsers, setFilteredUsers] = useState(mockUsers.slice(0, 4));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);
  const [totalUsers] = useState(mockUsers.length);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState(generateRealData());
  
  // State for security report
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // State for investigation dialogs
  const [investigationAlert, setInvestigationAlert] = useState(null);
  const [showInvestigationDialog, setShowInvestigationDialog] = useState(false);
  
  // State for add user dialog
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", country: "", status: "active" });
  
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
  
  // Update user list when page changes
  useEffect(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    
    // Filter by search term if provided
    const filtered = searchTerm
      ? mockUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.country.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : mockUsers;
    
    setFilteredUsers(filtered.slice(indexOfFirstUser, indexOfLastUser));
  }, [currentPage, searchTerm, usersPerPage]);
  
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
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle pagination
  const handleNextPage = () => {
    const maxPage = Math.ceil(
      (searchTerm ? mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.country.toLowerCase().includes(searchTerm.toLowerCase())
      ).length : mockUsers.length) / usersPerPage
    );
    
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
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
  const handleInvestigate = (alert) => {
    setInvestigationAlert(alert);
    setShowInvestigationDialog(true);
  };
  
  // Handle add user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.country) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call to add user
    toast({
      title: "User added",
      description: `${newUser.name} has been added to the platform`
    });
    
    // Reset form and close dialog
    setNewUser({ name: "", email: "", country: "", status: "active" });
    setShowAddUserDialog(false);
  };
  
  if (!isAdmin || !user) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.name}</p>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Premium Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityAlertCount}</div>
            <p className="text-xs text-muted-foreground">-1 from last week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main dashboard tabs */}
      <Tabs defaultValue="analytics">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly new user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#FF7057" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Overview</CardTitle>
                <CardDescription>Distribution of event activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={analyticsData.eventData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        fill="#FF7057"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Age distribution of users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.demographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#FF7057" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Country</CardTitle>
              <CardDescription>Geographic user breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.usersByCountry} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="country" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#FF7057" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                  <Button 
                    onClick={() => setShowAddUserDialog(true)}
                    className="bg-gathr-coral hover:bg-gathr-coral/90 flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Add User</span>
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Country</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-t">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.country}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 
                            user.status === 'premium' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            {user.status !== 'suspended' ? (
                              <Button variant="ghost" size="sm" className="text-red-500">Suspend</Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-green-500">Activate</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {
                    searchTerm 
                      ? mockUsers.filter(user => 
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.country.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length 
                      : totalUsers
                  } users
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= Math.ceil(
                        (searchTerm ? mockUsers.filter(user => 
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.country.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length : mockUsers.length) / usersPerPage
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Center</CardTitle>
              <CardDescription>Monitor and manage platform security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Active Alerts</h3>
                  <div className="border rounded-md divide-y">
                    {securityAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-4 ${
                          alert.type === 'critical' ? 'bg-red-50' : 
                          alert.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`mr-2 mt-0.5 ${
                            alert.type === 'critical' ? 'text-red-500' : 
                            alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                          }`}>⚠️</div>
                          <div>
                            <h4 className={`font-medium ${
                              alert.type === 'critical' ? 'text-red-700' : 
                              alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                            }`}>{alert.title}</h4>
                            <p className={`text-sm ${
                              alert.type === 'critical' ? 'text-red-600' : 
                              alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                            }`}>{alert.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className={`text-xs ${
                                alert.type === 'critical' ? 'text-red-600' : 
                                alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                              }`}>{alert.timestamp}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7"
                                onClick={() => handleInvestigate(alert)}
                              >
                                Investigate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Security Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Login Activity</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Successful logins (24h)</span>
                          <span className="font-medium">428</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Failed logins (24h)</span>
                          <span className="font-medium">32</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Password resets (24h)</span>
                          <span className="font-medium">12</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Account Security</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>2FA enabled users</span>
                          <span className="font-medium">42%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Social login usage</span>
                          <span className="font-medium">68%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Email verification rate</span>
                          <span className="font-medium">94%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gathr-coral hover:bg-gathr-coral/90 flex items-center gap-2"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? "Generating..." : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Generate Full Security Report</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">General Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center border p-4 rounded-md">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">Enable to temporarily disable the platform for maintenance</p>
                    </div>
                    <div className="flex items-center h-7">
                      <input type="checkbox" className="h-4 w-4" id="maintenance-mode" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border p-4 rounded-md">
                    <div>
                      <h4 className="font-medium">User Registration</h4>
                      <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                    </div>
                    <div className="flex items-center h-7">
                      <input type="checkbox" className="h-4 w-4" id="registration" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border p-4 rounded-md">
                    <div>
                      <h4 className="font-medium">Event Creation</h4>
                      <p className="text-sm text-muted-foreground">Allow users to create new events</p>
                    </div>
                    <div className="flex items-center h-7">
                      <input type="checkbox" className="h-4 w-4" id="event-creation" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">App Distribution</h3>
                <div className="border p-4 rounded-md space-y-4">
                  <p className="text-sm">
                    Configure app distribution settings for mobile platforms
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.05 20.28C16.07 21.23 15 20.92 13.97 20.51C12.86 20.08 11.86 20.07 10.7 20.51C9.19 21.06 8.45 20.67 7.64 20.28C3.95 18.15 4.44 12.82 8.65 12.58C9.95 12.67 10.82 13.37 11.53 13.43C12.64 13.21 13.7 12.5 14.9 12.61C16.35 12.74 17.37 13.39 17.97 14.54C14.91 16.09 15.5 19.96 17.05 20.28V20.28Z" fill="#000"/>
                        <path d="M11.36 12.3C11.12 10.42 12.64 8.86 14.4 8.65C14.74 10.76 12.69 12.39 11.36 12.3V12.3Z" fill="#000"/>
                      </svg>
                      <h4 className="font-medium">App Store Distribution</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Status:</p>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Version:</p>
                        <span>1.2.5 (Build 142)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage App Store Distribution
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.12007 8.52002V15.48C5.12007 17.36 6.35007 18.24 8.02007 17.26L10.5701 15.77L13.1201 14.28C14.7901 13.3 14.7901 11.7 13.1201 10.72L10.5701 9.23002L8.02007 7.74002C6.35007 6.76002 5.12007 7.64002 5.12007 8.52002Z" fill="#000"/>
                        <rect x="15" y="7" width="4" height="10" rx="1" fill="#000"/>
                      </svg>
                      <h4 className="font-medium">Google Play Distribution</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Status:</p>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Version:</p>
                        <span>1.2.5 (142)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Google Play Distribution
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gathr-coral hover:bg-gathr-coral/90">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Security Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Security Report</DialogTitle>
            <DialogDescription>
              Generated on {reportData?.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {reportData && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{reportData.summary.criticalAlerts}</div>
                    <div className="text-sm">Critical Alerts</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{reportData.summary.highAlerts}</div>
                    <div className="text-sm">High Alerts</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{reportData.summary.mediumAlerts}</div>
                    <div className="text-sm">Medium Alerts</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Login Activity</h3>
                <div className="border rounded-md p-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Successful logins (24h)</span>
                      <span className="font-medium">{reportData.loginActivity.successfulLogins}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Failed logins (24h)</span>
                      <span className="font-medium text-amber-600">{reportData.loginActivity.failedLogins}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Suspicious logins (24h)</span>
                      <span className="font-medium text-red-600">{reportData.loginActivity.suspiciousLogins}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Vulnerabilities</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">Severity</th>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.vulnerabilities.map((vuln, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              vuln.severity === 'high' ? 'bg-red-100 text-red-700' : 
                              vuln.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{vuln.description}</td>
                          <td className="py-3 px-4">{vuln.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline">Download PDF</Button>
            <Button onClick={() => setShowReportDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Investigation Dialog */}
      <Dialog open={showInvestigationDialog} onOpenChange={setShowInvestigationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Investigation: {investigationAlert?.title}</DialogTitle>
            <DialogDescription>
              {investigationAlert?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Alert Details</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Alert ID:</span>
                  <span className="font-medium">{investigationAlert?.id}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{investigationAlert?.type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="font-medium">{investigationAlert?.timestamp}</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Action</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Dismiss</Button>
                <Button variant="destructive" className="flex-1">Block User</Button>
                <Button className="flex-1 bg-gathr-coral hover:bg-gathr-coral/90">Reset Password</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowInvestigationDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account on the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country"
                value={newUser.country}
                onChange={(e) => setNewUser({...newUser, country: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                className="w-full border rounded-md px-3 py-2"
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="premium">Premium</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddUser}
              className="bg-gathr-coral hover:bg-gathr-coral/90"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
