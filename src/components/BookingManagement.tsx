
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Mail, ExternalLink, Calendar, Hotel, Plane } from "lucide-react";

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("status");

  const reservations = [
    {
      id: "R001",
      client: "John Doe",
      hotel: "Four Seasons Bali",
      destination: "Bali",
      checkIn: "2024-12-15",
      checkOut: "2024-12-22",
      status: "need-start",
      amount: "$4,800",
      type: "Hotel"
    },
    {
      id: "R002", 
      client: "Sarah Smith",
      hotel: "Mandarin Oriental Bangkok",
      destination: "Thailand",
      checkIn: "2024-11-20",
      checkOut: "2024-11-27",
      status: "follow-up",
      amount: "$3,200",
      type: "Hotel"
    },
    {
      id: "R003",
      client: "Mike Johnson",
      hotel: "Park Hyatt Tokyo",
      destination: "Japan",
      checkIn: "2024-10-10",
      checkOut: "2024-10-17",
      status: "completed",
      amount: "$5,400",
      type: "Hotel"
    },
    {
      id: "F001",
      client: "John Doe",
      hotel: "Emirates JFK-DPS",
      destination: "Bali",
      checkIn: "2024-12-15",
      checkOut: "2024-12-22",
      status: "need-start",
      amount: "$2,400",
      type: "Flight"
    }
  ];

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
    switch (status) {
      case "need-start": return "bg-red-100 text-red-800";
      case "follow-up": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReservations = reservations
    .filter(reservation => {
      const matchesSearch = reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reservation.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reservation.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "status") {
        const statusOrder = { "need-start": 0, "follow-up": 1, "completed": 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (sortBy === "client") return a.client.localeCompare(b.client);
      if (sortBy === "hotel") return a.hotel.localeCompare(b.hotel);
      return 0;
    });

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
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>Manage all hotel and flight reservations</CardDescription>
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
                    <SelectItem value="need-start">Need Start</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Hotel/Flight</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.client}</TableCell>
                      <TableCell>{reservation.hotel}</TableCell>
                      <TableCell>{reservation.destination}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{reservation.checkIn}</div>
                          <div className="text-gray-500">to {reservation.checkOut}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reservation.type === 'Hotel' ? <Hotel className="h-3 w-3 mr-1" /> : <Plane className="h-3 w-3 mr-1" />}
                          {reservation.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{reservation.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm">
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
