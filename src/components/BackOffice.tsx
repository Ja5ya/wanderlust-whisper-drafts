
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelManagement from "@/components/HotelManagement";
import GuideManagement from "@/components/GuideManagement";
import ActivityManagement from "@/components/ActivityManagement";

const BackOffice = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Back Office Management</h1>
        <p className="text-gray-600">Manage your operational resources</p>
      </div>

      <Tabs defaultValue="hotels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels">
          <HotelManagement />
        </TabsContent>

        <TabsContent value="guides">
          <GuideManagement />
        </TabsContent>

        <TabsContent value="activities">
          <ActivityManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackOffice;
