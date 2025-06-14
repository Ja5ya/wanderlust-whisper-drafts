
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Phone, Mail, Plus, Edit } from "lucide-react";
import { useHotels, useHotelRates } from "@/hooks/useHotels";
import CreateHotelForm from "./CreateHotelForm";

const HotelManagement = () => {
  const { data: hotels = [], isLoading } = useHotels();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const HotelDetailsDialog = ({ hotel }: { hotel: any }) => {
    const { data: rates = [] } = useHotelRates(hotel.id);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{hotel.name}</CardTitle>
                {hotel.star_rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{hotel.star_rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {hotel.location}
                </div>
                {hotel.contact_phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {hotel.contact_phone}
                  </div>
                )}
                {hotel.contact_email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {hotel.contact_email}
                  </div>
                )}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {hotel.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {hotel.name}
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Hotel
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Hotel Information</TabsTrigger>
              <TabsTrigger value="rates">Rates & Availability</TabsTrigger>
              <TabsTrigger value="rooms">Room Types</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <p className="text-sm text-gray-600">{hotel.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <p className="text-sm text-gray-600">{hotel.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <p className="text-sm text-gray-600">{hotel.country || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Person</label>
                      <p className="text-sm text-gray-600">{hotel.contact_person || 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hotel Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Star Rating</label>
                      <p className="text-sm text-gray-600">{hotel.star_rating || 'Not rated'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-gray-600">{hotel.description || 'No description available'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Amenities</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hotel.amenities?.map((amenity: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        )) || <span className="text-sm text-gray-600">No amenities listed</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Current Rates</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rate
                </Button>
              </div>
              
              <div className="grid gap-4">
                {rates.length > 0 ? (
                  rates.map((rate: any) => (
                    <Card key={rate.id}>
                      <CardContent className="pt-4">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-sm font-medium">Date</label>
                            <p className="text-sm">{new Date(rate.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Room Type</label>
                            <p className="text-sm">{rate.room_type?.name || 'Standard'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Regime</label>
                            <p className="text-sm">{rate.regime}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Rate</label>
                            <p className="text-sm font-semibold">{rate.currency} {rate.rate_per_room}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No rates available for this hotel</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Room Types</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room Type
                </Button>
              </div>
              
              <div className="grid gap-4">
                {rates.filter((rate: any) => rate.room_type).map((rate: any) => (
                  <Card key={rate.room_type.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{rate.room_type.name}</h4>
                          <p className="text-sm text-gray-600">{rate.room_type.description}</p>
                          <p className="text-sm">Max Occupancy: {rate.room_type.max_occupancy} guests</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
            </DialogHeader>
            <CreateHotelForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Search hotels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading hotels...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <HotelDetailsDialog key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}

      {filteredHotels.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No hotels found matching your search criteria
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
