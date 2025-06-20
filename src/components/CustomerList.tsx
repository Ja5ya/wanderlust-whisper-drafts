import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, Phone, Mail, MapPin, Calendar, Eye, Grid, List, ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import CreateCustomerForm from "./CreateCustomerForm";
import CustomerCalendar from "./CustomerCalendar";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  status: string;
  number_of_people: number | null;
  start_date: string | null;
  end_date: string | null;
  trip_type: string | null;
  nationality: string | null;
  value: number | null;
  last_contact: string | null;
  created_at: string;
}

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerView, setCustomerView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Customer[];
    },
  });

  const filteredAndSortedCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.destination && customer.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'status':
          valueA = a.status.toLowerCase();
          valueB = b.status.toLowerCase();
          break;
        case 'value':
          valueA = a.value || 0;
          valueB = b.value || 0;
          break;
        case 'date':
          valueA = new Date(a.start_date || '').getTime();
          valueB = new Date(b.start_date || '').getTime();
          break;
        case 'destination':
          valueA = (a.destination || '').toLowerCase();
          valueB = (b.destination || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'traveling': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (customerId: string) => {
    navigate(`/customer/${customerId}`);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Customer List</TabsTrigger>
          <TabsTrigger value="calendar">Customer Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Customer Management</h2>
                <p className="text-gray-600">Manage your customer relationships and travel plans</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <CreateCustomerForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{filteredAndSortedCustomers.length} customers</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="date">Travel Date</SelectItem>
                    <SelectItem value="destination">Destination</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </Button>
                
                <div className="flex border rounded-lg p-1">
                  <Button
                    variant={customerView === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCustomerView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={customerView === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCustomerView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading customers...</div>
            ) : (
              <div className={customerView === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                {filteredAndSortedCustomers.map((customer) => (
                  <Card key={customer.id} className={`hover:shadow-md transition-shadow flex flex-col ${customerView === 'list' ? 'p-4' : ''}`}>
                    {customerView === 'grid' ? (
                      <>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{customer.name}</CardTitle>
                            <Badge className={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </div>
                          <CardDescription>{customer.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-2 flex-1">
                            {customer.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {customer.phone}
                              </div>
                            )}
                            {customer.destination && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {customer.destination}
                              </div>
                            )}
                            {customer.start_date && customer.end_date && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(customer.start_date).toLocaleDateString()} - {new Date(customer.end_date).toLocaleDateString()}
                              </div>
                            )}
                            {customer.trip_type && (
                              <div className="text-sm text-gray-600">
                                <strong>Type:</strong> {customer.trip_type}
                              </div>
                            )}
                            {customer.number_of_people && (
                              <div className="text-sm text-gray-600">
                                <strong>Travelers:</strong> {customer.number_of_people}
                              </div>
                            )}
                            {customer.value && (
                              <div className="text-sm font-semibold text-green-600">
                                Estimated Value: ${customer.value.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleViewDetails(customer.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <h4 className="font-medium">{customer.name}</h4>
                            <Badge className={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600">
                            <span>{customer.email}</span>
                            {customer.destination && <span>{customer.destination}</span>}
                            {customer.value && <span className="text-green-600 font-medium">${customer.value.toLocaleString()}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(customer.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {filteredAndSortedCustomers.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No customers found matching your search criteria' : 'No customers found. Create your first customer to get started.'}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <CustomerCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerList;
