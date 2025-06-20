
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingItem {
  id: string;
  name: string;
  dates: string;
  nights?: number;
  price: number;
  currency: string;
}

interface PricingBreakdownProps {
  totalDays: number;
  totalParticipants: number;
}

const PricingBreakdown = ({ totalDays, totalParticipants }: PricingBreakdownProps) => {
  const { toast } = useToast();
  
  const [hotels, setHotels] = useState<PricingItem[]>([
    { id: '1', name: 'Four Seasons Resort Bali', dates: 'Jan 15 - Jan 18', nights: 3, price: 450, currency: 'USD' },
    { id: '2', name: 'The Ritz-Carlton Ubud', dates: 'Jan 18 - Jan 20', nights: 2, price: 380, currency: 'USD' }
  ]);

  const [activities, setActivities] = useState<PricingItem[]>([
    { id: '1', name: 'Ubud Rice Terraces Tour', dates: 'Jan 16', price: 85, currency: 'USD' },
    { id: '2', name: 'Temple Hopping Experience', dates: 'Jan 17', price: 95, currency: 'USD' },
    { id: '3', name: 'Cooking Class & Market Visit', dates: 'Jan 19', price: 120, currency: 'USD' }
  ]);

  const [transportation, setTransportation] = useState<PricingItem[]>([
    { id: '1', name: 'Airport Transfer (Arrival)', dates: 'Jan 15', price: 35, currency: 'USD' },
    { id: '2', name: 'Private Driver (3 days)', dates: 'Jan 16 - Jan 18', price: 150, currency: 'USD' },
    { id: '3', name: 'Airport Transfer (Departure)', dates: 'Jan 20', price: 35, currency: 'USD' }
  ]);

  const [guides, setGuides] = useState<PricingItem[]>([
    { id: '1', name: 'Licensed Cultural Guide - Made', dates: 'Jan 16 - Jan 17', price: 80, currency: 'USD' },
    { id: '2', name: 'Adventure Guide - Kadek', dates: 'Jan 18 - Jan 19', price: 75, currency: 'USD' }
  ]);

  const [profitMargin, setProfitMargin] = useState(20);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<'hotels' | 'activities' | 'transportation' | 'guides'>('hotels');
  const [newItem, setNewItem] = useState({ name: '', dates: '', price: 0, nights: 0 });

  // Calculate totals
  const hotelTotal = hotels.reduce((sum, item) => sum + (item.price * (item.nights || 1)), 0);
  const activityTotal = activities.reduce((sum, item) => sum + (item.price * totalParticipants), 0);
  const transportTotal = transportation.reduce((sum, item) => sum + item.price, 0);
  const guideTotal = guides.reduce((sum, item) => sum + item.price, 0);

  const subtotal = hotelTotal + activityTotal + transportTotal + guideTotal;
  const profit = (subtotal * profitMargin) / 100;
  const total = subtotal + profit;

  const updateItemPrice = (category: string, id: string, newPrice: number) => {
    const updateList = (items: PricingItem[]) =>
      items.map(item => item.id === id ? { ...item, price: newPrice } : item);

    switch (category) {
      case 'hotels':
        setHotels(updateList(hotels));
        break;
      case 'activities':
        setActivities(updateList(activities));
        break;
      case 'transportation':
        setTransportation(updateList(transportation));
        break;
      case 'guides':
        setGuides(updateList(guides));
        break;
    }
  };

  const updateItemNights = (id: string, newNights: number) => {
    setHotels(hotels.map(item => 
      item.id === id ? { ...item, nights: newNights } : item
    ));
  };

  const addItem = () => {
    if (!newItem.name || !newItem.dates || newItem.price <= 0) return;

    const item: PricingItem = {
      id: Date.now().toString(),
      name: newItem.name,
      dates: newItem.dates,
      price: newItem.price,
      currency: 'USD',
      ...(currentCategory === 'hotels' && { nights: newItem.nights || 1 })
    };

    switch (currentCategory) {
      case 'hotels':
        setHotels([...hotels, item]);
        break;
      case 'activities':
        setActivities([...activities, item]);
        break;
      case 'transportation':
        setTransportation([...transportation, item]);
        break;
      case 'guides':
        setGuides([...guides, item]);
        break;
    }

    setNewItem({ name: '', dates: '', price: 0, nights: 0 });
    setIsAddDialogOpen(false);
    toast({ title: "Success", description: `${currentCategory.slice(0, -1)} added successfully!` });
  };

  const removeItem = (category: string, id: string) => {
    switch (category) {
      case 'hotels':
        setHotels(hotels.filter(item => item.id !== id));
        break;
      case 'activities':
        setActivities(activities.filter(item => item.id !== id));
        break;
      case 'transportation':
        setTransportation(transportation.filter(item => item.id !== id));
        break;
      case 'guides':
        setGuides(guides.filter(item => item.id !== id));
        break;
    }
  };

  const PricingSection = ({ title, items, category, showNights = false, showPerPerson = false }: {
    title: string;
    items: PricingItem[];
    category: string;
    showNights?: boolean;
    showPerPerson?: boolean;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{title}</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCurrentCategory(category as any);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex-1">
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">{item.dates}</div>
              {showNights && item.nights && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Input
                    type="number"
                    value={item.nights}
                    onChange={(e) => updateItemNights(item.id, Number(e.target.value))}
                    className="w-16 h-6 text-xs"
                    min="1"
                  />
                  nights
                </div>
              )}
            </div>
            <div className="text-right flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span>$</span>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItemPrice(category, item.id, Number(e.target.value))}
                  className="w-20 h-8 text-sm font-medium"
                  min="0"
                />
                {showNights && item.nights && (
                  <span className="text-sm"> × {item.nights} = ${item.price * item.nights}</span>
                )}
                {showPerPerson && (
                  <span className="text-sm"> × {totalParticipants} = ${item.price * totalParticipants}</span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeItem(category, item.id)}
              className="ml-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PricingSection 
          title="Hotels" 
          items={hotels} 
          category="hotels" 
          showNights={true}
        />
        
        <Separator />
        
        <PricingSection 
          title="Activities" 
          items={activities} 
          category="activities" 
          showPerPerson={true}
        />
        
        <Separator />
        
        <PricingSection 
          title="Transportation" 
          items={transportation} 
          category="transportation"
        />
        
        <Separator />
        
        <PricingSection 
          title="Guides" 
          items={guides} 
          category="guides"
        />

        <Separator />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profit-margin">Profit Margin (%)</Label>
            <Input
              id="profit-margin"
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Hotels Total:</span>
              <span className="font-medium">${hotelTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Activities Total:</span>
              <span className="font-medium">${activityTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Transportation Total:</span>
              <span className="font-medium">${transportTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Guides Total:</span>
              <span className="font-medium">${guideTotal.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Profit ({profitMargin}%):</span>
              <span className="font-medium text-green-600">${profit.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Price:</span>
              <span className="text-blue-600">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Add Item Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {currentCategory.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder={`Enter ${currentCategory.slice(0, -1)} name...`}
                />
              </div>
              <div>
                <Label htmlFor="item-dates">Dates</Label>
                <Input
                  id="item-dates"
                  value={newItem.dates}
                  onChange={(e) => setNewItem({ ...newItem, dates: e.target.value })}
                  placeholder="e.g., Jan 15 - Jan 18"
                />
              </div>
              {currentCategory === 'hotels' && (
                <div>
                  <Label htmlFor="item-nights">Number of Nights</Label>
                  <Input
                    id="item-nights"
                    type="number"
                    value={newItem.nights}
                    onChange={(e) => setNewItem({ ...newItem, nights: Number(e.target.value) })}
                    placeholder="Number of nights"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="item-price">Price (USD)</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  placeholder="Enter price..."
                />
              </div>
              <Button onClick={addItem} className="w-full">
                Add {currentCategory.slice(0, -1)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PricingBreakdown;
