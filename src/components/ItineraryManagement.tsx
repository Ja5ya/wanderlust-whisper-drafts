
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, DollarSign, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ItineraryManagement = () => {
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const { toast } = useToast();

  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ['itineraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select(`
          *,
          customer:customers(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading itineraries...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Itinerary Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Itinerary
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Itinerary List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {itineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedItinerary?.id === itinerary.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedItinerary(itinerary)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{itinerary.title}</h3>
                      <Badge variant={itinerary.status === 'Draft' ? 'secondary' : 'default'}>
                        {itinerary.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      {itinerary.customer && (
                        <div className="font-medium">{itinerary.customer.name}</div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{itinerary.total_days} days</span>
                        </div>
                        
                        {itinerary.total_participants && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{itinerary.total_participants}</span>
                          </div>
                        )}
                      </div>
                      
                      {itinerary.budget && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${itinerary.budget.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {itinerary.start_date && (
                        <div className="text-xs text-gray-500">
                          {format(parseISO(itinerary.start_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {itineraries.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No itineraries found</p>
                    <p className="text-xs">Create your first itinerary to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Itinerary Details */}
        <div className="lg:col-span-2">
          {selectedItinerary ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedItinerary.title}</CardTitle>
                    {selectedItinerary.customer && (
                      <p className="text-sm text-gray-600 mt-1">
                        Client: {selectedItinerary.customer.name}
                      </p>
                    )}
                  </div>
                  <Badge variant={selectedItinerary.status === 'Draft' ? 'secondary' : 'default'}>
                    {selectedItinerary.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Itinerary Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Duration:</span>
                    <p className="text-sm text-gray-600">{selectedItinerary.total_days} days</p>
                  </div>
                  {selectedItinerary.total_participants && (
                    <div>
                      <span className="text-sm font-medium">Participants:</span>
                      <p className="text-sm text-gray-600">{selectedItinerary.total_participants}</p>
                    </div>
                  )}
                  {selectedItinerary.budget && (
                    <div>
                      <span className="text-sm font-medium">Budget:</span>
                      <p className="text-sm text-gray-600">${selectedItinerary.budget.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedItinerary.start_date && (
                    <div>
                      <span className="text-sm font-medium">Start Date:</span>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(selectedItinerary.start_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>

                {selectedItinerary.description && (
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">{selectedItinerary.description}</p>
                  </div>
                )}

                {selectedItinerary.notes && (
                  <div>
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{selectedItinerary.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Edit Itinerary
                  </Button>
                  <Button variant="outline" size="sm">
                    View Days
                  </Button>
                  <Button size="sm">
                    Share with Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select an Itinerary</h3>
                <p className="text-gray-600">Choose an itinerary from the list to view its details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryManagement;
