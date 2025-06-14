
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, DollarSign, Plus, Edit, Eye } from "lucide-react";
import { useItineraries, useItineraryDays } from "@/hooks/useItineraries";

const ItineraryManagement = () => {
  const { data: itineraries = [], isLoading } = useItineraries();
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);

  const ItineraryDetailsDialog = ({ itinerary }: { itinerary: any }) => {
    const { data: days = [] } = useItineraryDays(itinerary.id);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                <Badge variant={itinerary.status === 'Draft' ? 'secondary' : 'default'}>
                  {itinerary.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {itinerary.customer?.name || 'Unknown Customer'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {itinerary.total_days} days
                </div>
                {itinerary.budget && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {itinerary.currency} {itinerary.budget}
                  </div>
                )}
                {itinerary.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {itinerary.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {itinerary.title}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
              <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trip Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Customer</label>
                      <p className="text-sm text-gray-600">{itinerary.customer?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <p className="text-sm text-gray-600">{itinerary.total_days} days</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Participants</label>
                      <p className="text-sm text-gray-600">{itinerary.total_participants || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge variant={itinerary.status === 'Draft' ? 'secondary' : 'default'}>
                        {itinerary.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Budget Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {itinerary.budget ? (
                      <>
                        <div>
                          <label className="text-sm font-medium">Total Budget</label>
                          <p className="text-lg font-semibold">{itinerary.currency} {itinerary.budget}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Per Day</label>
                          <p className="text-sm text-gray-600">
                            {itinerary.currency} {(itinerary.budget / itinerary.total_days).toFixed(2)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">Budget not specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {itinerary.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{itinerary.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daily Itinerary</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </div>
              
              <div className="space-y-4">
                {days.length > 0 ? (
                  days.map((day: any) => (
                    <Card key={day.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Day {day.day_number}</CardTitle>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Route</label>
                            <p className="text-sm text-gray-600">
                              {day.start_location} → {day.end_location}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Travel Time</label>
                            <p className="text-sm text-gray-600">{day.travel_hours || 0}h</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Estimated Cost</label>
                            <p className="text-sm text-gray-600">
                              {day.estimated_cost ? `${itinerary.currency} ${day.estimated_cost}` : 'TBD'}
                            </p>
                          </div>
                        </div>
                        
                        {day.places_visited && day.places_visited.length > 0 && (
                          <div className="mt-3">
                            <label className="text-sm font-medium">Places to Visit</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {day.places_visited.map((place: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {place}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {day.description && (
                          <div className="mt-3">
                            <label className="text-sm font-medium">Description</label>
                            <p className="text-sm text-gray-600">{day.description}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No daily itinerary added yet
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Cost Breakdown</h3>
              </div>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {days.map((day: any) => (
                      <div key={day.id} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">Day {day.day_number} - {day.start_location} to {day.end_location}</span>
                        <span className="text-sm font-medium">
                          {day.estimated_cost ? `${itinerary.currency} ${day.estimated_cost}` : 'TBD'}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-3 font-semibold">
                      <span>Total Estimated Cost</span>
                      <span>
                        {itinerary.currency} {days.reduce((total: number, day: any) => total + (day.estimated_cost || 0), 0)}
                      </span>
                    </div>
                    
                    {itinerary.budget && (
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Budget Remaining</span>
                        <span>
                          {itinerary.currency} {itinerary.budget - days.reduce((total: number, day: any) => total + (day.estimated_cost || 0), 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Itinerary Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Itinerary
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading itineraries...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <ItineraryDetailsDialog key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
      )}

      {itineraries.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No itineraries found. Create your first itinerary to get started.
        </div>
      )}
    </div>
  );
};

export default ItineraryManagement;
