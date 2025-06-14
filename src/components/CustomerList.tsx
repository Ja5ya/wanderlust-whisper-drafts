
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import CustomerCalendar from "./CustomerCalendar";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
  last_contact: string;
  destination: string;
  trip_type: string;
  value: number;
}

interface CustomerWithBooking extends Customer {
  next_booking?: {
    start_date: string;
    end_date: string;
    destination: string;
  };
}

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers-with-bookings'],
    queryFn: async () => {
      console.log('Fetching customers with bookings...');
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;

      // Fetch next booking for each customer
      const customersWithBookings: CustomerWithBooking[] = await Promise.all(
        customersData.map(async (customer) => {
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('start_date, end_date, destination')
            .eq('customer_id', customer.id)
            .gte('start_date', new Date().toISOString().split('T')[0]) // Future bookings only
            .order('start_date', { ascending: true })
            .limit(1);

          if (bookingsError) {
            console.error('Error fetching bookings for customer:', customer.id, bookingsError);
          }

          return {
            ...customer,
            next_booking: bookings && bookings.length > 0 ? bookings[0] : undefined
          } as CustomerWithBooking;
        })
      );

      console.log('Customers with bookings:', customersWithBookings);
      return customersWithBookings;
    },
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.destination?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openCustomerDetails = (customerId: string) => {
    navigate(`/customer/${customerId}`);
  };

  const formatLastContact = (lastContact: string) => {
    const date = new Date(lastContact);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  const formatTravelDates = (booking: { start_date: string; end_date: string }) => {
    const startDate = parseISO(booking.start_date);
    const endDate = parseISO(booking.end_date);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Loading customers...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">Error loading customers</div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Tabs defaultValue="customers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="customers">Customer List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="space-y-4">
              {/* Search */}
              <div className="relative">
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
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(customer.status)}>
                                  {customer.status}
                                </Badge>
                                {customer.next_booking && (
                                  <Badge variant="outline" className="text-xs">
                                    {formatTravelDates(customer.next_booking)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{customer.next_booking?.destination || customer.destination || 'No destination set'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{customer.trip_type || 'No trip type'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="text-lg font-semibold text-green-600">
                            {customer.value ? formatCurrency(customer.value) : 'TBD'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last contact: {formatLastContact(customer.last_contact)}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" onClick={() => openCustomerDetails(customer.id)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCustomers.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No customers found</div>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or add new customers
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <CustomerCalendar />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerList;
