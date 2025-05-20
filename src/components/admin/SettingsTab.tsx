
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-4 pt-4">
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
    </div>
  );
};

export default SettingsTab;
