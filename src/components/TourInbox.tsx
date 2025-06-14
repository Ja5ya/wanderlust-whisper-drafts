
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, MapPin, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TourRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  tourTitle: string;
  destination: string;
  duration: number;
  estimatedPrice: number;
  priority: 'High' | 'Medium' | 'Low';
  requestDate: string;
  status: 'Needs Route' | 'In Progress' | 'Route Ready';
}

const TourInbox = ({ onSelectTour }: { onSelectTour: (tour: TourRequest) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [isAddTourOpen, setIsAddTourOpen] = useState(false);
  const [newTour, setNewTour] = useState({
    customerName: "",
    customerEmail: "",
    tourTitle: "",
    destination: "",
    duration: "",
    estimatedPrice: "",
    priority: "Medium" as const
  });

  const tourRequests: TourRequest[] = [
    {
      id: "1",
      customerName: "John Doe",
      customerEmail: "john.doe@email.com",
      tourTitle: "Bali Family Adventure",
      destination: "Bali, Indonesia",
      duration: 8,
      estimatedPrice: 12500,
      priority: "High",
      requestDate: "2024-01-15",
      status: "Needs Route"
    },
    {
      id: "2",
      customerName: "Sarah Smith",
      customerEmail: "sarah.smith@email.com",
      tourTitle: "Thailand Honeymoon",
      destination: "Thailand",
      duration: 10,
      estimatedPrice: 8900,
      priority: "Medium",
      requestDate: "2024-01-14",
      status: "In Progress"
    },
    {
      id: "3",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@email.com",
      tourTitle: "Japan Cultural Experience",
      destination: "Tokyo, Japan",
      duration: 12,
      estimatedPrice: 15000,
      priority: "Low",
      requestDate: "2024-01-13",
      status: "Route Ready"
    }
  ];

  const filteredTours = tourRequests.filter(tour =>
    tour.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Needs Route": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Route Ready": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleTourClick = (tour: TourRequest) => {
    setSelectedTour(tour.id);
    onSelectTour(tour);
  };

  const handleAddTour = () => {
    // Add tour logic here
    console.log("Adding new tour:", newTour);
    setIsAddTourOpen(false);
    setNewTour({
      customerName: "",
      customerEmail: "",
      tourTitle: "",
      destination: "",
      duration: "",
      estimatedPrice: "",
      priority: "Medium"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tour Route Requests</CardTitle>
            <CardDescription>Customers requiring new route planning</CardDescription>
          </div>
          <Dialog open={isAddTourOpen} onOpenChange={setIsAddTourOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tour Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tour Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      value={newTour.customerName}
                      onChange={(e) => setNewTour({...newTour, customerName: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-email">Customer Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={newTour.customerEmail}
                      onChange={(e) => setNewTour({...newTour, customerEmail: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tour-title">Tour Title</Label>
                  <Input
                    id="tour-title"
                    value={newTour.tourTitle}
                    onChange={(e) => setNewTour({...newTour, tourTitle: e.target.value})}
                    placeholder="e.g., Bali Family Adventure"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={newTour.destination}
                      onChange={(e) => setNewTour({...newTour, destination: e.target.value})}
                      placeholder="e.g., Bali, Indonesia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newTour.duration}
                      onChange={(e) => setNewTour({...newTour, duration: e.target.value})}
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated-price">Estimated Price</Label>
                    <Input
                      id="estimated-price"
                      type="number"
                      value={newTour.estimatedPrice}
                      onChange={(e) => setNewTour({...newTour, estimatedPrice: e.target.value})}
                      placeholder="12500"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTour.priority} onValueChange={(value: any) => setNewTour({...newTour, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddTourOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTour}>
                    Add Tour Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tour requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTours.map((tour) => (
            <Card 
              key={tour.id} 
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedTour === tour.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleTourClick(tour)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {tour.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium truncate">{tour.tourTitle}</h4>
                        <Badge className={getPriorityColor(tour.priority)} variant="secondary">
                          {tour.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tour.customerName}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{tour.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{tour.duration} days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${tour.estimatedPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(tour.status)} variant="outline">
                    {tour.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tour requests found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TourInbox;
