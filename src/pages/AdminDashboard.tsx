
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

// Mock analytics data
const userGrowthData = [
  { month: "Jan", users: 1240 },
  { month: "Feb", users: 1830 },
  { month: "Mar", users: 2300 },
  { month: "Apr", users: 3400 },
  { month: "May", users: 4200 },
  { month: "Jun", users: 5100 },
  { month: "Jul", users: 6800 },
];

const eventData = [
  { name: "Created", value: 850 },
  { name: "Attended", value: 3200 },
  { name: "Cancelled", value: 120 },
];

const demographicData = [
  { age: "18-24", users: 2500 },
  { age: "25-34", users: 4800 },
  { age: "35-44", users: 3100 },
  { age: "45-54", users: 1400 },
  { age: "55+", users: 800 },
];

const usersByCountry = [
  { country: "United States", users: 4200 },
  { country: "United Kingdom", users: 1800 },
  { country: "Germany", users: 1400 },
  { country: "Canada", users: 1100 },
  { country: "Australia", users: 950 },
  { country: "Others", users: 2550 },
];

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState(5687);
  const [totalEvents, setTotalEvents] = useState(3276);
  const [conversionRate, setConversionRate] = useState(12.4);
  const [securityAlerts, setSecurityAlerts] = useState(3);
  
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
            <div className="text-2xl font-bold">{securityAlerts}</div>
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
                  <LineChart data={userGrowthData}>
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
                        data={eventData} 
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
                    <BarChart data={demographicData}>
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
                  <BarChart data={usersByCountry} layout="vertical">
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
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-8 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-gathr-coral focus:border-transparent w-64"
                  />
                  <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button className="bg-gathr-coral hover:bg-gathr-coral/90">Add User</Button>
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
                    <tr className="border-t">
                      <td className="py-3 px-4">Sarah Johnson</td>
                      <td className="py-3 px-4">sarah@example.com</td>
                      <td className="py-3 px-4">United States</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Suspend</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4">Michael Chen</td>
                      <td className="py-3 px-4">michael@example.com</td>
                      <td className="py-3 px-4">Canada</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Suspend</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4">Emma Wilson</td>
                      <td className="py-3 px-4">emma@example.com</td>
                      <td className="py-3 px-4">United Kingdom</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Premium</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500">Suspend</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4">Carlos Mendez</td>
                      <td className="py-3 px-4">carlos@example.com</td>
                      <td className="py-3 px-4">Spain</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Suspended</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-green-500">Activate</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing 4 of 5,687 users
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
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
                    <div className="p-4 bg-red-50">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5 text-red-500">⚠️</div>
                        <div>
                          <h4 className="font-medium text-red-700">Multiple failed login attempts</h4>
                          <p className="text-sm text-red-600">10+ failed login attempts for user account john@example.com</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-red-600">2 hours ago</span>
                            <Button size="sm" variant="outline" className="h-7">Investigate</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5 text-amber-500">⚠️</div>
                        <div>
                          <h4 className="font-medium text-amber-700">Unusual login activity</h4>
                          <p className="text-sm text-amber-600">Login from new location for admin account</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-amber-600">1 day ago</span>
                            <Button size="sm" variant="outline" className="h-7">Investigate</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5 text-amber-500">⚠️</div>
                        <div>
                          <h4 className="font-medium text-amber-700">Spam activity detected</h4>
                          <p className="text-sm text-amber-600">Potential spam messages sent by user robert@example.com</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-amber-600">3 days ago</span>
                            <Button size="sm" variant="outline" className="h-7">Investigate</Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
              <Button className="w-full bg-gathr-coral hover:bg-gathr-coral/90">
                Generate Full Security Report
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
                      <input type="checkbox" className="h-4 w-4" id="registration" checked />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border p-4 rounded-md">
                    <div>
                      <h4 className="font-medium">Event Creation</h4>
                      <p className="text-sm text-muted-foreground">Allow users to create new events</p>
                    </div>
                    <div className="flex items-center h-7">
                      <input type="checkbox" className="h-4 w-4" id="event-creation" checked />
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
    </div>
  );
};

export default AdminDashboard;
