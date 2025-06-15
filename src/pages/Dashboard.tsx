
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerList from "@/components/CustomerList";
import BookingManagement from "@/components/BookingManagement";
import EmailInbox from "@/components/EmailInbox";
import BackOffice from "@/components/BackOffice";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your travel business operations
          </p>
        </div>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="emails">Email Center</TabsTrigger>
          <TabsTrigger value="back-office">Back Office</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <CustomerList />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <EmailInbox />
        </TabsContent>

        <TabsContent value="back-office" className="space-y-4">
          <BackOffice />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
