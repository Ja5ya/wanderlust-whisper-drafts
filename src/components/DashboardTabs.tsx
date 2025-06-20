
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewMessages from "@/components/NewMessages";
import CustomerList from "@/components/CustomerList";
import ItineraryManagement from "@/components/ItineraryManagement";
import BookingManagement from "@/components/BookingManagement";
import BusinessAnalytics from "@/components/BusinessAnalytics";

interface DashboardTabsProps {
  defaultValue?: string;
}

const DashboardTabs = ({ defaultValue = "new-messages" }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
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
  );
};

export default DashboardTabs;
