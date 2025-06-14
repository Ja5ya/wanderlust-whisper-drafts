
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users, Plus } from "lucide-react";
import { useItineraries } from "@/hooks/useItineraries";
import { useEnhancedBookings } from "@/hooks/useEnhancedBookings";

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

  if (customerLoading) {
    return <div className="container mx-auto py-8">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="container mx-auto py-8">Customer not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">{customer.email}</p>
          </div>
          <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
            {customer.status}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Customer Info Sidebar */}
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
              {customer.nationality && (
                <div>
                  <span className="text-sm font-medium">Nationality: </span>
                  <span className="text-sm">{customer.nationality}</span>
                </div>
              )}
              {customer.number_of_people && (
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{customer.number_of_people} travelers</span>
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

          {customer.traveler_details && (
            <Card>
              <CardHeader>
                <CardTitle>Traveler Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(customer.traveler_details) ? (
                    customer.traveler_details.map((traveler: any, index: number) => (
                      <div key={index} className="border-b pb-2 last:border-b-0">
                        <p className="font-medium">{traveler.name}</p>
                        {traveler.passport && (
                          <p className="text-sm text-gray-600">Passport: {traveler.passport}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">Traveler details available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="itineraries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

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
                    <Card key={itinerary.id}>
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
                    <Card key={booking.id}>
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
                            <p className="text-sm text-gray-600">${booking.total_amount}</p>
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
