
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TourInbox from "./TourInbox";
import RouteEditDialog from "./RouteEditDialog";

const RoutePlanning = () => {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [priceBreakdown, setPriceBreakdown] = useState([
    { item: "Four Seasons Resort Bali", category: "Hotel", days: "7 nights", cost: 4800, profit: 20 },
    { item: "Emirates flights JFK-DPS", category: "Flight", days: "Round trip", cost: 2400, profit: 15 },
    { item: "Private airport transfers", category: "Transport", days: "2 transfers", cost: 200, profit: 25 },
    { item: "Ubud cultural tour", category: "Activity", days: "Full day", cost: 300, profit: 30 },
    { item: "Temple tours with guide", category: "Guide", days: "3 days", cost: 450, profit: 25 },
    { item: "Beach activities package", category: "Activity", days: "2 days", cost: 250, profit: 30 }
  ]);

  const itinerary = [
    { day: 1, location: "Denpasar", activities: "Arrival, hotel check-in, welcome dinner", status: "Confirmed" },
    { day: 2, location: "Ubud", activities: "Rice terraces, Monkey Forest, traditional market", status: "Confirmed" },
    { day: 3, location: "Ubud", activities: "Temple tours, cooking class", status: "Confirmed" },
    { day: 4, location: "Seminyak", activities: "Beach day, spa treatment", status: "Confirmed" },
    { day: 5, location: "Seminyak", activities: "Water sports, sunset dinner", status: "Pending" },
    { day: 6, location: "Nusa Dua", activities: "Resort day, cultural show", status: "Pending" },
    { day: 7, location: "Nusa Dua", activities: "Free day, shopping", status: "Pending" },
    { day: 8, location: "Denpasar", activities: "Departure", status: "Confirmed" }
  ];

  const updatePrice = (index: number, field: string, value: number) => {
    const updated = [...priceBreakdown];
    updated[index] = { ...updated[index], [field]: value };
    setPriceBreakdown(updated);
  };

  const addPriceItem = () => {
    setPriceBreakdown([...priceBreakdown, {
      item: "New Item",
      category: "Other",
      days: "1",
      cost: 0,
      profit: 20
    }]);
  };

  const totalCost = priceBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = priceBreakdown.reduce((sum, item) => sum + (item.cost * item.profit / 100), 0);
  const totalPrice = totalCost + totalProfit;

  const handleTourSelect = (tour: any) => {
    setSelectedTour(tour);
  };

  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tour Inbox (Left) */}
        <div className="lg:col-span-1">
          <TourInbox onSelectTour={handleTourSelect} />
        </div>

        {/* Route Display (Right) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTour ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedTour.tourTitle}</CardTitle>
                      <CardDescription>
                        {selectedTour.customerName} • {selectedTour.duration} days • {selectedTour.destination}
                      </CardDescription>
                    </div>
                    <Button onClick={openEditDialog} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Route
                    </Button>
                  </div>
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
                      {itinerary.map((day) => (
                        <TableRow key={day.day}>
                          <TableCell className="font-medium">Day {day.day}</TableCell>
                          <TableCell>{day.location}</TableCell>
                          <TableCell>{day.activities}</TableCell>
                          <TableCell>
                            <Badge variant={day.status === 'Confirmed' ? 'default' : 'secondary'}>
                              {day.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Detailed Price Breakdown</span>
                    <Button onClick={addPriceItem} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Profit %</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.days}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.cost}
                              onChange={(e) => updatePrice(index, 'cost', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.profit}
                              onChange={(e) => updatePrice(index, 'profit', parseInt(e.target.value) || 0)}
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            ${(item.cost + (item.cost * item.profit / 100)).toFixed(0)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-xl font-bold">${totalCost.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Profit</p>
                        <p className="text-xl font-bold text-green-600">${totalProfit.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Client Price</p>
                        <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Wand2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tour Request</h3>
                <p className="text-gray-600">
                  Choose a tour request from the inbox to view and edit the route details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Route Edit Dialog */}
      {selectedTour && (
        <RouteEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          tourName={selectedTour.tourTitle}
          currentItinerary={itinerary}
        />
      )}
    </div>
  );
};

export default RoutePlanning;
