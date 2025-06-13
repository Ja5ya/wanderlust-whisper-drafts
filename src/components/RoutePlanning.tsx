
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, DollarSign, Edit, Plus, Bot, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RoutePlanning = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [llmPrompt, setLlmPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [routeDetails, setRouteDetails] = useState({
    destination: "Bali, Indonesia",
    duration: "8 days",
    travelers: "Family of 4",
    budget: "$12,500",
    preferences: "Cultural experiences, beaches, family-friendly"
  });

  const [priceBreakdown, setPriceBreakdown] = useState([
    { item: "Four Seasons Resort Bali", category: "Hotel", days: "7 nights", cost: 4800, profit: 20 },
    { item: "Emirates flights JFK-DPS", category: "Flight", days: "Round trip", cost: 2400, profit: 15 },
    { item: "Private airport transfers", category: "Transport", days: "2 transfers", cost: 200, profit: 25 },
    { item: "Ubud cultural tour", category: "Activity", days: "Full day", cost: 300, profit: 30 },
    { item: "Temple tours with guide", category: "Guide", days: "3 days", cost: 450, profit: 25 },
    { item: "Beach activities package", category: "Activity", days: "2 days", cost: 250, profit: 30 }
  ]);

  const templates = [
    { id: "bali-family", name: "Bali Family Adventure", duration: "8 days", price: "$12,000" },
    { id: "thailand-cultural", name: "Thailand Cultural Tour", duration: "10 days", price: "$9,500" },
    { id: "japan-highlights", name: "Japan Highlights", duration: "12 days", price: "$15,000" },
    { id: "morocco-adventure", name: "Morocco Adventure", duration: "9 days", price: "$8,500" }
  ];

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

  const generateRoute = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Route Generated",
        description: "AI has created a customized itinerary based on email conversations and preferences."
      });
      setIsGenerating(false);
    }, 3000);
  };

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

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Route Planning Controls</CardTitle>
          <CardDescription>Generate AI-powered itineraries based on customer conversations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-select">Select Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe - Bali Trip</SelectItem>
                  <SelectItem value="sarah-smith">Sarah Smith - Thailand</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson - Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Input id="budget" value={routeDetails.budget} readOnly />
            </div>
          </div>

          <div>
            <Label htmlFor="llm-prompt">AI Instructions</Label>
            <Textarea
              id="llm-prompt"
              placeholder="e.g., Add more cultural experiences, reduce travel time between locations, include family-friendly activities..."
              value={llmPrompt}
              onChange={(e) => setLlmPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={generateRoute}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Bot className="h-4 w-4 mr-2 animate-spin" />
                Generating Route...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Route Display (Center) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Itinerary - {routeDetails.destination}</CardTitle>
              <CardDescription>{routeDetails.duration} • {routeDetails.travelers}</CardDescription>
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
        </div>

        {/* Templates (Right) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Route Templates</CardTitle>
              <CardDescription>Choose a template to start with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.duration}</p>
                  <p className="text-sm font-medium text-green-600">{template.price}</p>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanning;
