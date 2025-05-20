
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/admin"; // We'll create this type later

interface UsersTabProps {
  users: User[];
  usersPerPage: number;
  onExport: () => void;
  onAddUser: () => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, usersPerPage, onExport, onAddUser }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Update user list when page or search changes
  useEffect(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    
    // Filter by search term if provided
    const filtered = searchTerm
      ? users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.country.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : users;
    
    setFilteredUsers(filtered.slice(indexOfFirstUser, indexOfLastUser));
  }, [currentPage, searchTerm, users, usersPerPage]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle pagination
  const handleNextPage = () => {
    const maxPage = Math.ceil(
      (searchTerm ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.country.toLowerCase().includes(searchTerm.toLowerCase())
      ).length : users.length) / usersPerPage
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

  return (
    <div className="space-y-4 pt-4">
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
              <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button 
                onClick={onAddUser}
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
                  ? users.filter(user => 
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.country.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length 
                  : users.length
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
                    (searchTerm ? users.filter(user => 
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.country.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length : users.length) / usersPerPage
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
