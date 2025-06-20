
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PricingSection } from "./pricing/PricingSection";
import { PricingSummary } from "./pricing/PricingSummary";
import { AddItemDialog } from "./pricing/AddItemDialog";
import { usePricingItems } from "@/hooks/usePricingItems";

interface PricingBreakdownProps {
  totalDays: number;
  totalParticipants: number;
}

const PricingBreakdown = ({ totalDays, totalParticipants }: PricingBreakdownProps) => {
  const {
    hotels,
    activities,
    transportation,
    guides,
    updateItemPrice,
    updateItemNights,
    addItem,
    removeItem
  } = usePricingItems();

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

  const handleAddItem = (category: string) => {
    setCurrentCategory(category as any);
    setIsAddDialogOpen(true);
  };

  const handleItemChange = (field: string, value: string | number) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNewItem = () => {
    if (!newItem.name || !newItem.dates || newItem.price <= 0) return;

    const itemToAdd = {
      name: newItem.name,
      dates: newItem.dates,
      price: newItem.price,
      ...(currentCategory === 'hotels' && { nights: newItem.nights || 1 })
    };

    addItem(currentCategory, itemToAdd);
    setNewItem({ name: '', dates: '', price: 0, nights: 0 });
    setIsAddDialogOpen(false);
  };

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
          totalParticipants={totalParticipants}
          onAddItem={handleAddItem}
          onUpdatePrice={updateItemPrice}
          onUpdateNights={updateItemNights}
          onRemoveItem={removeItem}
        />
        
        <Separator />
        
        <PricingSection 
          title="Activities" 
          items={activities} 
          category="activities" 
          showPerPerson={true}
          totalParticipants={totalParticipants}
          onAddItem={handleAddItem}
          onUpdatePrice={updateItemPrice}
          onUpdateNights={updateItemNights}
          onRemoveItem={removeItem}
        />
        
        <Separator />
        
        <PricingSection 
          title="Transportation" 
          items={transportation} 
          category="transportation"
          totalParticipants={totalParticipants}
          onAddItem={handleAddItem}
          onUpdatePrice={updateItemPrice}
          onUpdateNights={updateItemNights}
          onRemoveItem={removeItem}
        />
        
        <Separator />
        
        <PricingSection 
          title="Guides" 
          items={guides} 
          category="guides"
          totalParticipants={totalParticipants}
          onAddItem={handleAddItem}
          onUpdatePrice={updateItemPrice}
          onUpdateNights={updateItemNights}
          onRemoveItem={removeItem}
        />

        <Separator />

        <PricingSummary
          profitMargin={profitMargin}
          onProfitMarginChange={setProfitMargin}
          hotelTotal={hotelTotal}
          activityTotal={activityTotal}
          transportTotal={transportTotal}
          guideTotal={guideTotal}
          subtotal={subtotal}
          profit={profit}
          total={total}
        />

        <AddItemDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          currentCategory={currentCategory}
          newItem={newItem}
          onItemChange={handleItemChange}
          onAddItem={handleAddNewItem}
        />
      </CardContent>
    </Card>
  );
};

export default PricingBreakdown;
