
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Users, Calendar, Route, Settings, AlertCircle, CheckCircle, Clock, Hotel, MapIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NewMessages from "@/components/NewMessages";
import CustomerList from "@/components/CustomerList";
import AITrainingSettings from "@/components/AITrainingSettings";
import BusinessAnalytics from "@/components/BusinessAnalytics";
import RoutePlanning from "@/components/RoutePlanning";
import ItineraryManagement from "@/components/ItineraryManagement";
import BookingManagement from "@/components/BookingManagement";
import BackOffice from "@/components/BackOffice";
import { useUnreadEmailCount } from "@/hooks/useMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [isTrainingSettingsOpen, setIsTrainingSettingsOpen] = useState(false);
  const [isBackOfficeOpen, setIsBackOfficeOpen] = useState(false);

  const { data: unreadEmailCount = 0 } = useUnreadEmailCount();

  const { data: pendingBookings = 0 } = useQuery({
    queryKey: ['pending-bookings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeCustomers = 0 } = useQuery({
    queryKey: ['active-customers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Active', 'Traveling']);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: customerIssues = 0 } = useQuery({
    queryKey: ['customer-issues-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('email_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) throw error;
      return Math.min(count || 0, 10); // Cap at 10 for display purposes
    },
  });

  const switchToNewMessages = () => {
    const newMessagesTab = document.querySelector('[value="new-messages"]') as HTMLButtonElement;
    if (newMessagesTab) {
      newMessagesTab.click();
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
              <Dialog open={isBackOfficeOpen} onOpenChange={setIsBackOfficeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Hotel className="h-4 w-4 mr-2" />
                    Back Office
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Back Office Management</DialogTitle>
                  </DialogHeader>
                  <BackOffice />
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={switchToNewMessages}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails to Read</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadEmailCount}</div>
              <p className="text-xs text-muted-foreground">Unread emails</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerIssues}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="new-messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="new-messages">Messages</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="new-messages">
            <NewMessages />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerList />
          </TabsContent>

          <TabsContent value="itineraries">
            <ItineraryManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <BusinessAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
