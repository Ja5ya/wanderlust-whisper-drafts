
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Calendar, MapPin } from "lucide-react";

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      status: "Active",
      lastContact: "2 days ago",
      destination: "Bali, Indonesia",
      tripType: "Family Vacation",
      value: "$12,500"
    },
    {
      id: 2,
      name: "Sarah Smith", 
      email: "sarah.smith@email.com",
      status: "Planning",
      lastContact: "1 week ago",
      destination: "Thailand",
      tripType: "Honeymoon",
      value: "$8,900"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com", 
      status: "Traveling",
      lastContact: "3 hours ago",
      destination: "Tokyo, Japan",
      tripType: "Cultural Tour",
      value: "$6,700"
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      status: "Completed", 
      lastContact: "2 weeks ago",
      destination: "Paris, France",
      tripType: "Business + Leisure",
      value: "$15,200"
    },
    {
      id: 5,
      name: "David Chen",
      email: "david.chen@email.com",
      status: "Planning",
      lastContact: "5 days ago", 
      destination: "Morocco",
      tripType: "Adventure",
      value: "$9,400"
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Planning": return "bg-blue-100 text-blue-800";
      case "Traveling": return "bg-orange-100 text-orange-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Manage your customer relationships and track their travel journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Customer List */}
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{customer.destination}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{customer.tripType}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-lg font-semibold text-green-600">
                        {customer.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last contact: {customer.lastContact}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No customers found</div>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or add new customers
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerList;
