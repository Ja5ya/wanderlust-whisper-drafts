import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Calendar, MapPin, Plane, Hotel, FileText, Download, Send, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isToday, isFuture, isPast } from "date-fns";
import { formatCurrency } from "@/lib/utils";

// It's good practice to define the shape of the customer object
// This should match the `customers` table schema from `supabase/types.ts`
interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  destination: string | null;
  trip_type: string | null;
  value: number | null;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
  // New fields
  number_of_people: number | null;
  traveler_details: Json | null;
  notes_id: string | null;
  guide_id: string | null;
  start_date: string | null;
  end_date: string | null;
  nationality: string | null;
}

const CustomerDetails = () => {
  const params = useParams();
  const customerId = params.id; // Fixed: Changed from params.customerId to params.id
  const [notes, setNotes] = useState("");

  console.log('CustomerDetails - params:', params);
  console.log('CustomerDetails - customerId extracted:', customerId);

  const { data: customer, isLoading: customerLoading, error: customerError } = useQuery<CustomerData, Error>({
    queryKey: ['customer-details', customerId],
    queryFn: async () => {
      if (!customerId || typeof customerId !== 'string') {
        console.error('Invalid customer ID:', customerId);
        throw new Error('Invalid customer ID provided');
      }
      
      console.log('Fetching customer details for ID:', customerId);
      const { data, error } = await supabase
        .from('customers')
        .select('*') // This will fetch all columns, including new ones
        .eq('id', customerId)
        .single();
      
      if (error) {
        console.error('Error fetching customer:', error);
        throw error;
      }
      
      console.log('Customer data fetched:', data);
      return data as CustomerData; // Ensure the fetched data conforms to CustomerData
    },
    enabled: !!customerId && typeof customerId === 'string',
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['customer-bookings', customerId],
    queryFn: async () => {
      if (!customerId || typeof customerId !== 'string') return [];
      
      console.log('Fetching bookings for customer:', customerId);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      console.log('Bookings data fetched:', data);
      return data || [];
    },
    enabled: !!customerId && typeof customerId === 'string',
  });

  const { data: emails = [], isLoading: emailsLoading } = useQuery({
    queryKey: ['customer-emails', customerId],
    queryFn: async () => {
      if (!customerId || typeof customerId !== 'string') return [];
      
      console.log('Fetching emails for customer:', customerId);
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .eq('customer_id', customerId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching emails:', error);
        throw error;
      }
      
      console.log('Emails data fetched:', data);
      return data || [];
    },
    enabled: !!customerId && typeof customerId === 'string',
  });

  const { data: whatsappMessages = [], isLoading: whatsappLoading } = useQuery({
    queryKey: ['customer-whatsapp', customerId],
    queryFn: async () => {
      if (!customerId || typeof customerId !== 'string') return [];
      
      console.log('Fetching WhatsApp messages for customer:', customerId);
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('customer_id', customerId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching WhatsApp messages:', error);
        throw error;
      }
      
      console.log('WhatsApp messages data fetched:', data);
      return data || [];
    },
    enabled: !!customerId && typeof customerId === 'string',
  });

  // Calculate the customer's current status based on bookings
  const calculateCustomerStatus = () => {
    if (!customer) return 'Planning'; // Default if customer data not loaded
    
    // Priority 1: Check current booking from bookings table
    const currentBookingFromBookingsTable = bookings.find(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    });

    if (currentBookingFromBookingsTable) return 'Traveling';

    // Priority 2: Check future booking from bookings table
    const futureBookingFromBookingsTable = bookings.find(booking => {
      const startDate = new Date(booking.start_date);
      return isFuture(startDate);
    });

    if (futureBookingFromBookingsTable) {
      if (futureBookingFromBookingsTable.status === 'Confirmed' && futureBookingFromBookingsTable.total_amount > 0) {
        return 'Active';
      } else {
        return 'Planning';
      }
    }

    // Priority 3: Check customer's primary start_date and end_date if no relevant bookings
    if (customer.start_date && customer.end_date) {
      const primaryStartDate = new Date(customer.start_date);
      const primaryEndDate = new Date(customer.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (today >= primaryStartDate && today <= primaryEndDate) {
        return "Traveling";
      } else if (isFuture(primaryStartDate)) {
        // Assuming primary trip status on customer matches 'Active' if it's confirmed/paid
        // This might need more refined logic if payment status for primary trip is stored elsewhere
        return customer.status === "Active" ? "Active" : "Planning";
      }
      // If past, will fall through to check if any booking was completed.
    }
    
    // Priority 4: If all bookings are in the past, or no bookings and primary trip is past
    const allBookingsPast = bookings.every(booking => isPast(new Date(booking.end_date)));
    const primaryTripPast = customer.end_date ? isPast(new Date(customer.end_date)) : false;

    if (bookings.length > 0 && allBookingsPast) {
      return 'Completed';
    }
    if (bookings.length === 0 && customer.start_date && primaryTripPast) {
      return 'Completed';
    }
    
    // Default to customer's original status or 'Planning'
    return customer.status || 'Planning';
  };

  const goBack = () => {
    window.history.back();
  };

  const generateVoucher = () => {
    console.log("Generating voucher...");
  };

  const generateGuideSummary = () => {
    console.log("Generating guide summary...");
  };

  const sendToGuide = () => {
    console.log("Sending tour details to guide...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Planning": return "bg-blue-100 text-blue-800";
      case "Traveling": return "bg-orange-100 text-orange-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isLoading = customerLoading || bookingsLoading || emailsLoading || whatsappLoading;

  // Show error if customer ID is invalid
  if (!customerId || typeof customerId !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">Invalid customer ID</div>
            <p className="text-sm text-muted-foreground">
              The customer ID in the URL is not valid
            </p>
            <Button onClick={goBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (customerError) {
    console.error('Customer error:', customerError);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">Error loading customer details</div>
            <p className="text-sm text-muted-foreground">
              {customerError instanceof Error ? customerError.message : 'Unknown error occurred'}
            </p>
            <Button onClick={goBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">Loading customer details...</div>
            <div className="text-sm text-muted-foreground">
              Customer ID: {customerId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">Customer not found</div>
            <p className="text-sm text-muted-foreground">
              No customer found with ID: {customerId}
            </p>
            <Button onClick={goBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Use customer's primary start/end date if no upcoming booking from bookings table
  const nextBookingToDisplay = bookings.find(booking => new Date(booking.start_date) >= new Date()) || 
    (customer.start_date && customer.end_date ? { 
        start_date: customer.start_date, 
        end_date: customer.end_date, 
        destination: customer.destination || 'N/A', 
        status: customer.status, 
        total_amount: customer.value || 0 
    } : null);

  const currentStatus = calculateCustomerStatus();
  const totalCommunications = emails.length + whatsappMessages.length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">{customer.email} • {customer.phone || 'No phone'}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={generateGuideSummary}>
              <Download className="h-4 w-4 mr-2" />
              Generate Guide Summary
            </Button>
            <Button variant="outline" onClick={generateVoucher}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Voucher
            </Button>
            <Button variant="outline" onClick={sendToGuide}>
              <Send className="h-4 w-4 mr-2" />
              Send to Guide
            </Button>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(currentStatus)}>
                {currentStatus}
              </Badge>
              {nextBookingToDisplay && (
                <Badge variant="outline" className="text-xs">
                  {format(parseISO(nextBookingToDisplay.start_date), 'MMM d')} - {format(parseISO(nextBookingToDisplay.end_date), 'MMM d, yyyy')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Customer Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destination</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ (nextBookingToDisplay?.destination) || customer.destination || 'No destination'}</div>
              <p className="text-xs text-muted-foreground">{customer.trip_type || 'No trip type'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Travel Dates</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {nextBookingToDisplay 
                  ? `${format(parseISO(nextBookingToDisplay.start_date), 'MMM d')} - ${format(parseISO(nextBookingToDisplay.end_date), 'MMM d, yyyy')}`
                  : 'No upcoming trips'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {nextBookingToDisplay ? `${Math.ceil((new Date(nextBookingToDisplay.end_date).getTime() - new Date(nextBookingToDisplay.start_date).getTime()) / (1000 * 60 * 60 * 24))} days total` : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {customer.value ? formatCurrency(customer.value) : 'TBD'}
              </div>
              <p className="text-xs text-muted-foreground">All inclusive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Communications</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommunications}</div>
              <p className="text-xs text-muted-foreground">Total interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="voucher">Voucher</TabsTrigger>
            <TabsTrigger value="guide-summary">Guide Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Destination</TableCell>
                        <TableCell>{ (nextBookingToDisplay?.destination) || customer.destination || 'Not set'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Trip Type</TableCell>
                        <TableCell>{customer.trip_type || 'Not set'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Duration</TableCell>
                        <TableCell>
                          {nextBookingToDisplay 
                            ? `${Math.ceil((new Date(nextBookingToDisplay.end_date).getTime() - new Date(nextBookingToDisplay.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                            : 'Not set'
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(currentStatus)}>
                              {currentStatus}
                            </Badge>
                            {nextBookingToDisplay && (
                              <span className="text-sm text-muted-foreground">
                                {format(parseISO(nextBookingToDisplay.start_date), 'MMM d')} - {format(parseISO(nextBookingToDisplay.end_date), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Value</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {customer.value ? formatCurrency(customer.value) : 'TBD'}
                        </TableCell>
                      </TableRow>
                       {/* Display new fields in summary if available */}
                       {customer.nationality && (
                        <TableRow>
                          <TableCell className="font-medium">Nationality</TableCell>
                          <TableCell>{customer.nationality}</TableCell>
                        </TableRow>
                      )}
                      {customer.number_of_people && (
                        <TableRow>
                          <TableCell className="font-medium">Number of People</TableCell>
                          <TableCell>{customer.number_of_people}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.destination}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <Badge className={booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {booking.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(parseISO(booking.start_date), 'MMM d')} - {format(parseISO(booking.end_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {bookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communications">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email History</CardTitle>
                  <CardDescription>Email communications with this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emails.map((email) => (
                        <TableRow key={email.id}>
                          <TableCell>{format(parseISO(email.timestamp), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{email.subject}</TableCell>
                          <TableCell>{email.from_email}</TableCell>
                          <TableCell>
                            <Badge variant={email.is_read ? 'default' : 'secondary'}>
                              {email.is_read ? 'Read' : 'Unread'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emails.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No emails found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Messages</CardTitle>
                  <CardDescription>WhatsApp communications with this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {whatsappMessages.map((msg) => (
                        <TableRow key={msg.id}>
                          <TableCell>{format(parseISO(msg.timestamp), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="max-w-xs truncate">{msg.message_content}</TableCell>
                          <TableCell>{msg.is_incoming ? 'Incoming' : 'Outgoing'}</TableCell>
                          <TableCell>
                            <Badge variant={msg.is_read ? 'default' : 'secondary'}>
                              {msg.is_read ? 'Read' : 'Unread'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {whatsappMessages.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No WhatsApp messages found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Planned Routes & Itinerary</CardTitle>
                <CardDescription>Day-by-day travel plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Route planning feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings & Reservations</CardTitle>
                <CardDescription>All confirmed and pending bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.destination}</TableCell>
                        <TableCell>{format(parseISO(booking.start_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(parseISO(booking.end_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(booking.total_amount)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes & Special Requests</CardTitle>
                <CardDescription>Important information about the customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={10}
                  placeholder="Add notes about customer preferences, special requests, dietary requirements, etc."
                />
                <div className="mt-4">
                  <Button>Save Notes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voucher">
            <Card>
              <CardHeader>
                <CardTitle>Trip Voucher</CardTitle>
                <CardDescription>Official travel confirmation and voucher</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Trip Voucher</h3>
                  <p className="text-gray-600 mb-6">
                    Create an official PDF voucher with all trip details, confirmations, and emergency contacts.
                  </p>
                  <Button onClick={generateVoucher}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate & Download Voucher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide-summary">
            <Card>
              <CardHeader>
                <CardTitle>Guide Summary</CardTitle>
                <CardDescription>Comprehensive summary for tour guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Guide Summary</h3>
                  <p className="text-gray-600 mb-6">
                    Create a detailed PDF summary including hotel bookings, flights, itinerary, and customer details for tour guides.
                  </p>
                  <Button onClick={generateGuideSummary}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download Guide Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDetails;
