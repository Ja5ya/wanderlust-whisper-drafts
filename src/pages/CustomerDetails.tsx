
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Calendar, MapPin, Plane, Hotel, FileText, Download } from "lucide-react";

const CustomerDetails = () => {
  const [notes, setNotes] = useState("VIP customer. Prefers luxury accommodations. Vegetarian dietary requirements. Celebrating 20th anniversary.");

  const customer = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    destination: "Bali, Indonesia",
    tripType: "Family Vacation",
    status: "Active",
    value: "$12,500",
    travelDates: "Dec 15-22, 2024"
  };

  const emails = [
    {
      date: "2024-01-15",
      subject: "Bali Trip Inquiry - Family of 4",
      type: "Inquiry",
      status: "Responded"
    },
    {
      date: "2024-01-14", 
      subject: "Additional Questions about Activities",
      type: "Follow-up",
      status: "Responded"
    },
    {
      date: "2024-01-12",
      subject: "Flight Preferences",
      type: "Information",
      status: "Pending"
    }
  ];

  const routes = [
    {
      day: "Day 1",
      location: "Arrival in Denpasar",
      activities: "Airport transfer, Hotel check-in, Welcome dinner",
      status: "Confirmed"
    },
    {
      day: "Day 2",
      location: "Ubud Cultural Tour",
      activities: "Rice terraces, Monkey Forest, Traditional market",
      status: "Confirmed"
    },
    {
      day: "Day 3",
      location: "Beach Day - Seminyak",
      activities: "Beach activities, Spa treatment, Sunset dinner",
      status: "Confirmed"
    }
  ];

  const bookings = [
    {
      type: "Flight",
      details: "JFK → DPS (Emirates)",
      date: "Dec 15, 2024",
      status: "Confirmed",
      amount: "$2,400"
    },
    {
      type: "Hotel",
      details: "Four Seasons Resort Bali",
      date: "Dec 15-22, 2024",
      status: "Confirmed", 
      amount: "$4,800"
    },
    {
      type: "Activities",
      details: "Cultural tours & experiences",
      date: "Dec 16-21, 2024",
      status: "Confirmed",
      amount: "$1,200"
    }
  ];

  const goBack = () => {
    window.close();
  };

  const generateVoucher = () => {
    // This would generate and download a PDF voucher
    console.log("Generating voucher...");
  };

  const generateGuideSummary = () => {
    // This would generate and download a PDF guide summary with all trip details
    console.log("Generating guide summary...");
  };

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
              <p className="text-gray-600">{customer.email} • {customer.phone}</p>
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
            <Badge className={`px-3 py-1 ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {customer.status}
            </Badge>
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
              <div className="text-2xl font-bold">{customer.destination}</div>
              <p className="text-xs text-muted-foreground">{customer.tripType}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Travel Dates</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{customer.travelDates}</div>
              <p className="text-xs text-muted-foreground">8 days total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{customer.value}</div>
              <p className="text-xs text-muted-foreground">All inclusive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emails.length}</div>
              <p className="text-xs text-muted-foreground">Total conversations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="voucher">Voucher</TabsTrigger>
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
                        <TableCell>{customer.destination}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Trip Type</TableCell>
                        <TableCell>{customer.tripType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Duration</TableCell>
                        <TableCell>8 days, 7 nights</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Travelers</TableCell>
                        <TableCell>4 (2 adults, 2 children)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Value</TableCell>
                        <TableCell className="text-green-600 font-semibold">{customer.value}</TableCell>
                      </TableRow>
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
                      <TableRow>
                        <TableCell className="font-medium">Flights</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Accommodation</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Activities</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Transfers</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Email History</CardTitle>
                <CardDescription>All email communications with this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emails.map((email, index) => (
                      <TableRow key={index}>
                        <TableCell>{email.date}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>{email.type}</TableCell>
                        <TableCell>
                          <Badge variant={email.status === 'Responded' ? 'default' : 'secondary'}>
                            {email.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Planned Routes & Itinerary</CardTitle>
                <CardDescription>Day-by-day travel plan</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Activities</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{route.day}</TableCell>
                        <TableCell>{route.location}</TableCell>
                        <TableCell>{route.activities}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {route.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{booking.type}</TableCell>
                        <TableCell>{booking.details}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell className="font-semibold">{booking.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDetails;
