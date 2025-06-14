import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Users, Calendar as CalendarIcon, Info, Edit3, Briefcase, Globe, StickyNote, DollarSign, CheckCircle, Clock, Plane, UserCheck } from "lucide-react";
import { format, parseISO, differenceInDays, isPast, isFuture } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";

interface Booking {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  booking_reference: string;
}

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
  number_of_people: number | null;
  traveler_details: Json | null;
  notes_id: string | null;
  guide_id: string | null;
  start_date: string | null;
  end_date: string | null;
  nationality: string | null;
  created_at: string;
  updated_at: string;
}

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", id)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData as CustomerData);

        // Fetch customer bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("customer_id", id)
          .order("start_date", { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData as Booking[]);

      } catch (err: any) {
        console.error("Error fetching customer details:", err);
        setError(err.message || "Failed to fetch customer details");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "planning":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "traveling":
        return "bg-orange-100 text-orange-800";
      case "completed":
      case "past":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const calculateTripProgress = (startDateString?: string | null, endDateString?: string | null) => {
    if (!startDateString || !endDateString) return { progress: 0, label: "Dates not set" };
    
    const startDate = parseISO(startDateString);
    const endDate = parseISO(endDateString);
    const today = new Date();
    today.setHours(0,0,0,0);

    const totalDuration = differenceInDays(endDate, startDate);
    if (totalDuration <= 0) return { progress: isPast(endDate) ? 100 : 0, label: isPast(endDate) ? "Completed" : "Starts soon/Invalid dates" };

    if (isPast(endDate)) return { progress: 100, label: "Completed" };
    if (isFuture(startDate)) return { progress: 0, label: `Starts in ${differenceInDays(startDate, today)} days` };
    
    const daysElapsed = differenceInDays(today, startDate);
    const progress = Math.min(100, Math.max(0,(daysElapsed / totalDuration) * 100));
    return { progress, label: "In Progress" };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading customer details...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500"><div className="text-xl">Error: {error}</div></div>;
  }

  if (!customer) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Customer not found.</div></div>;
  }

  const { progress: mainTripProgress, label: mainTripProgressLabel } = calculateTripProgress(customer.start_date, customer.end_date);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        &larr; Back to Customer List
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={`https://avatar.vercel.sh/${customer.email}.png`} alt={customer.name} />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3" /> {customer.email}
                </CardDescription>
                {customer.phone && (
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" /> {customer.phone}
                  </CardDescription>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Primary Contact Status</h4>
            <Badge className={getStatusColor(customer.status)}>{customer.status || "N/A"}</Badge>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Preferred Destination</h4>
            <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-muted-foreground" /> {customer.destination || "Not specified"}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Preferred Trip Type</h4>
            <p className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-muted-foreground" /> {customer.trip_type || "Not specified"}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Nationality</h4>
            <p className="flex items-center gap-1"><Globe className="h-4 w-4 text-muted-foreground" /> {customer.nationality || "Not specified"}</p>
          </div>
           <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Group Size</h4>
            <p className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground" /> {customer.number_of_people || "N/A"} people</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Customer Value</h4>
            <p className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" /> {customer.value ? formatCurrency(customer.value) : "TBD"}</p>
          </div>
          <div className="space-y-2 md:col-span-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Primary Trip Dates</h4>
            {customer.start_date && customer.end_date ? (
              <>
                <p className="flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-muted-foreground" /> 
                  {format(parseISO(customer.start_date), "MMM d, yyyy")} - {format(parseISO(customer.end_date), "MMM d, yyyy")}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${mainTripProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${mainTripProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">{mainTripProgressLabel}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No primary trip dates set.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="travelers">Traveler Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="communication">Communication Log</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => {
                const { progress, label } = calculateTripProgress(booking.start_date, booking.end_date);
                let statusIcon = <Clock className="h-4 w-4 mr-2 text-yellow-500" />;
                if (label === "Completed") statusIcon = <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
                                else if (label === "In Progress") statusIcon = <Plane className="h-4 w-4 mr-2 text-blue-500" />

                return (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{booking.destination}</CardTitle>
                          <CardDescription>Ref: {booking.booking_reference}</CardDescription>
                        </div>
                         <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        {format(parseISO(booking.start_date), "MMM d, yyyy")} - {format(parseISO(booking.end_date), "MMM d, yyyy")}
                      </p>
                       <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                           style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">{statusIcon} {label}</p>
                      <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-muted-foreground" /> Total: {formatCurrency(booking.total_amount)}</p>
                    </CardContent>
                    <CardFooter>
                       <Button variant="outline" size="sm">View Booking Details</Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No bookings found for this customer.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="travelers">
          <Card>
            <CardHeader>
              <CardTitle>Traveler Information</CardTitle>
              <CardDescription>Details of all individuals in the travel group.</CardDescription>
            </CardHeader>
            <CardContent>
              {customer.traveler_details && Array.isArray(customer.traveler_details) && customer.traveler_details.length > 0 ? (
                <ul className="space-y-3">
                  {(customer.traveler_details as Array<{name: string; passport?: string}>).map((traveler, index) => (
                    <li key={index} className="p-3 border rounded-md">
                      <p className="font-semibold">{traveler.name}</p>
                      {traveler.passport && <p className="text-sm text-muted-foreground">Passport: {traveler.passport}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No traveler details provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
           <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              {customer.notes_id ? (
                <p>Notes ID: {customer.notes_id} (Content to be fetched)</p>
              ) : (
                <p className="text-muted-foreground">No notes linked to this customer.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="communication">
          <Card>
            <CardHeader><CardTitle>Communication History</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Communication log coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
