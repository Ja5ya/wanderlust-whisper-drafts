
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Users, Calendar, Route, Settings, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import EmailInbox from "@/components/EmailInbox";
import CustomerList from "@/components/CustomerList";
import AITrainingSettings from "@/components/AITrainingSettings";
import BusinessAnalytics from "@/components/BusinessAnalytics";

const Dashboard = () => {
  const [isTrainingSettingsOpen, setIsTrainingSettingsOpen] = useState(false);

  const switchToEmailInbox = () => {
    // Find the email inbox tab trigger and click it
    const emailInboxTab = document.querySelector('[value="email-inbox"]') as HTMLButtonElement;
    if (emailInboxTab) {
      emailInboxTab.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-2xl font-bold text-primary">TravelAssist AI</h1>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Dialog open={isTrainingSettingsOpen} onOpenChange={setIsTrainingSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    AI Training Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>AI Training Settings</DialogTitle>
                  </DialogHeader>
                  <AITrainingSettings />
                </DialogContent>
              </Dialog>
              <Button variant="outline">Settings</Button>
              <Button variant="outline">Account</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DMC Dashboard</h1>
          <p className="text-gray-600">Manage your customer service operations efficiently</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={switchToEmailInbox}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails to Read</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Unread emails</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Routes to Check</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="email-inbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="email-inbox">Email Inbox</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="routes">Route Planning</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="business-analytics">Business Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="email-inbox">
            <EmailInbox />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerList />
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Route Planning</CardTitle>
                <CardDescription>
                  Create optimized itineraries for your customers (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Route Planning Coming Soon</h3>
                  <p className="text-gray-600 mb-6">
                    AI-powered route optimization and itinerary creation will be available in the next update.
                  </p>
                  <Button disabled>Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Automated hotel and flight bookings (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Management Coming Soon</h3>
                  <p className="text-gray-600 mb-6">
                    Integrated booking system for hotels, flights, and activities will be available soon.
                  </p>
                  <Button disabled>Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business-analytics">
            <BusinessAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
