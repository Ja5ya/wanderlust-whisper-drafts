import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Mail, ExternalLink, Calendar, Hotel, Plane, Plus } from "lucide-react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import CreateBookingForm from "./CreateBookingForm";

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("status");
  
  const { data: bookings = [], isLoading } = useBookings();
  const updateBookingStatus = useUpdateBookingStatus();

  const emailTemplates = [
    {
      id: "hotel-inquiry",
      name: "Hotel Availability Inquiry",
      subject: "Booking Inquiry for {{dates}} - {{guests}} guests",
      template: "Dear {{hotel_name}},\n\nWe would like to inquire about availability for the following dates..."
    },
    {
      id: "booking-confirmation",
      name: "Booking Confirmation Request",
      subject: "Booking Confirmation - {{client_name}}",
      template: "Dear {{hotel_name}},\n\nWe would like to confirm the following booking..."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "status") {
        const statusOrder = { "pending": 0, "confirmed": 1, "cancelled": 2 };
        return statusOrder[a.status.toLowerCase()] - statusOrder[b.status.toLowerCase()];
      }
      if (sortBy === "client") return (a.customer?.name || '').localeCompare(b.customer?.name || '');
      if (sortBy === "hotel") return (a.hotel?.name || '').localeCompare(b.hotel?.name || '');
      return 0;
    });

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    updateBookingStatus.mutate({ id: bookingId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all-reservations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-reservations">All Reservations</TabsTrigger>
          <TabsTrigger value="email-booking">Email Booking</TabsTrigger>
          <TabsTrigger value="booking-com">Booking.com</TabsTrigger>
          <TabsTrigger value="hotels-com">Hotels.com</TabsTrigger>
        </TabsList>

        <TabsContent value="all-reservations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Reservations</CardTitle>
                  <CardDescription>Manage all hotel and flight reservations</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Booking</DialogTitle>
                    </DialogHeader>
                    <CreateBookingForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client, hotel, or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reservations Table */}
              {isLoading ? (
                <div className="text-center py-8">Loading bookings...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                        <TableCell>{booking.customer?.name || 'Unknown'}</TableCell>
                        <TableCell>{booking.hotel?.name || 'Not specified'}</TableCell>
                        <TableCell>{booking.destination}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                            <div className="text-gray-500">to {new Date(booking.end_date).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.number_of_guests}</TableCell>
                        <TableCell className="font-semibold">${booking.total_amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select onValueChange={(value) => handleStatusUpdate(booking.id, value)}>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Update" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {filteredBookings.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  No bookings found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-booking">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Booking System</CardTitle>
                <CardDescription>Send automated booking emails to hotels with human approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Templates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Email Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {emailTemplates.map((template) => (
                        <div key={template.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm">
                              Use Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Pending Emails */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Four Seasons Bali</p>
                              <p className="text-sm text-gray-600">John Doe booking inquiry</p>
                            </div>
                            <Badge variant="secondary">Draft</Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm">
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="booking-com">
          <Card>
            <CardHeader>
              <CardTitle>Booking.com Integration</CardTitle>
              <CardDescription>Automated booking through Booking.com API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking.com Integration</h3>
                <p className="text-gray-600 mb-6">
                  Connect to Booking.com API for automated hotel reservations and real-time availability.
                </p>
                <Button>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect to Booking.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels-com">
          <Card>
            <CardHeader>
              <CardTitle>Hotels.com Integration</CardTitle>
              <CardDescription>Automated booking through Hotels.com API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotels.com Integration</h3>
                <p className="text-gray-600 mb-6">
                  Connect to Hotels.com API for automated hotel reservations and competitive pricing.
                </p>
                <Button>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect to Hotels.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingManagement;
