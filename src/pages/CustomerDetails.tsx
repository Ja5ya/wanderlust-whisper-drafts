import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users, Plus, DollarSign, Clock, Star, MessageSquare } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";

const CustomerDetails = () => {
  const { id } = useParams();

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          guide:guides(name, phone, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: customerItineraries = [] } = useQuery({
    queryKey: ['customer-itineraries', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: customerBookings = [] } = useQuery({
    queryKey: ['customer-bookings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotel:hotels(name, location)
        `)
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: customerNotes = [] } = useQuery({
    queryKey: ['customer-notes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: customerEmails = [] } = useQuery({
    queryKey: ['customer-emails', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .eq('customer_id', id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: customerWhatsApp = [] } = useQuery({
    queryKey: ['customer-whatsapp', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('customer_id', id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (customerLoading) {
    return <div className="container mx-auto py-8">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="container mx-auto py-8">Customer not found</div>;
  }

  // Calculate trip progress
  const getTripProgress = () => {
    if (!customer.start_date || !customer.end_date) return 0;
    const start = parseISO(customer.start_date);
    const end = parseISO(customer.end_date);
    const now = new Date();
    const totalDays = differenceInDays(end, start);
    const daysPassed = differenceInDays(now, start);
    return Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Planning':
        return { color: 'bg-blue-100 text-blue-800', icon: Calendar };
      case 'Active':
        return { color: 'bg-green-100 text-green-800', icon: Clock };
      case 'Traveling':
        return { color: 'bg-orange-100 text-orange-800', icon: MapPin };
      case 'Completed':
        return { color: 'bg-gray-100 text-gray-800', icon: Star };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Users };
    }
  };

  const statusInfo = getStatusInfo(customer.status);
  const tripProgress = getTripProgress();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Link>
        
        {/* Enhanced Customer Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <ArrowLeft className="h-6 w-6 text-gray-400" />
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-gray-600">{customer.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={statusInfo.color}>
                    <statusInfo.icon className="h-3 w-3 mr-1" />
                    {customer.status}
                  </Badge>
                  {customer.nationality && (
                    <Badge variant="outline">{customer.nationality}</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {customer.value ? `$${customer.value.toLocaleString()}` : 'TBD'}
              </div>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>

          {/* Trip Progress */}
          {customer.start_date && customer.end_date && customer.status === 'Traveling' && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Trip Progress</span>
                <span className="text-sm text-gray-500">{Math.round(tripProgress)}%</span>
              </div>
              <Progress value={tripProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{format(parseISO(customer.start_date), 'MMM d')}</span>
                <span>{format(parseISO(customer.end_date), 'MMM d')}</span>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{customerItineraries.length}</div>
              <div className="text-xs text-gray-600">Itineraries</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{customerBookings.length}</div>
              <div className="text-xs text-gray-600">Bookings</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{customerEmails.length + customerWhatsApp.length}</div>
              <div className="text-xs text-gray-600">Messages</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{customerNotes.length}</div>
              <div className="text-xs text-gray-600">Notes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Customer Info Sidebar - Enhanced */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.destination && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{customer.destination}</span>
                </div>
              )}
              {customer.number_of_people && (
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{customer.number_of_people} travelers</span>
                </div>
              )}
              {customer.trip_type && (
                <div>
                  <span className="text-sm font-medium">Trip Type: </span>
                  <span className="text-sm">{customer.trip_type}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {customer.guide && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{customer.guide.name}</p>
                  {customer.guide.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.guide.phone}</span>
                    </div>
                  )}
                  {customer.guide.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.guide.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerEmails.slice(0, 3).map((email: any) => (
                  <div key={email.id} className="border-b pb-2 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium truncate">{email.subject}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">
                      {format(parseISO(email.timestamp), 'MMM d, HH:mm')}
                    </p>
                  </div>
                ))}
                {customerEmails.length === 0 && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Enhanced with Messages tab */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Messages</h3>
              </div>

              {(customerEmails.length > 0 || customerWhatsApp.length > 0) ? (
                <div className="space-y-4">
                  {/* Combine and sort all messages */}
                  {[...customerEmails.map(email => ({...email, type: 'email'})), 
                    ...customerWhatsApp.map(msg => ({...msg, type: 'whatsapp'}))]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((message: any) => (
                    <Card key={`${message.type}-${message.id}`} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            {message.type === 'email' ? (
                              <Mail className="h-4 w-4 text-blue-500" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-green-500" />
                            )}
                            <CardTitle className="text-lg">
                              {message.type === 'email' ? message.subject : 'WhatsApp Message'}
                            </CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={message.is_read ? 'secondary' : 'default'}>
                              {message.is_read ? 'Read' : 'Unread'}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(parseISO(message.timestamp), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">
                              {message.type === 'email' ? 'From:' : 'Phone:'} 
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              {message.type === 'email' ? message.from_email : message.phone_number}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Message:</span>
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                              {message.type === 'email' ? message.content : message.message_content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No messages found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="itineraries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Customer Itineraries</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Itinerary
                </Button>
              </div>

              {customerItineraries.length > 0 ? (
                <div className="grid gap-4">
                  {customerItineraries.map((itinerary: any) => (
                    <Card key={itinerary.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                          <Badge variant={itinerary.status === 'Draft' ? 'secondary' : 'default'}>
                            {itinerary.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium">Duration:</span>
                            <p className="text-sm text-gray-600">{itinerary.total_days} days</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Participants:</span>
                            <p className="text-sm text-gray-600">{itinerary.total_participants || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Budget:</span>
                            <p className="text-sm text-gray-600">
                              {itinerary.budget ? `${itinerary.currency} ${itinerary.budget}` : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        {itinerary.description && (
                          <p className="text-sm text-gray-600 mt-3">{itinerary.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No itineraries created yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Customer Bookings</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              </div>

              {customerBookings.length > 0 ? (
                <div className="grid gap-4">
                  {customerBookings.map((booking: any) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{booking.booking_reference}</CardTitle>
                          <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm font-medium">Destination:</span>
                            <p className="text-sm text-gray-600">{booking.destination}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Dates:</span>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Amount:</span>
                            <p className="text-sm text-gray-600 font-bold text-green-600">${booking.total_amount}</p>
                          </div>
                        </div>
                        {booking.hotel && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Hotel:</span>
                            <p className="text-sm text-gray-600">{booking.hotel.name}, {booking.hotel.location}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No bookings found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Customer Notes</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>

              {customerNotes.length > 0 ? (
                <div className="space-y-4">
                  {customerNotes.map((note: any) => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <span className="text-sm text-gray-500">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                        {note.category && (
                          <Badge variant="outline" className="mt-2">
                            {note.category}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No notes available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
