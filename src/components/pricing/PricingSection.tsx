
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PricingItemComponent } from "./PricingItem";

interface PricingItem {
  id: string;
  name: string;
  dates: string;
  nights?: number;
  price: number;
  currency: string;
}

interface PricingSectionProps {
  title: string;
  items: PricingItem[];
  category: string;
  showNights?: boolean;
  showPerPerson?: boolean;
  totalParticipants: number;
  onAddItem: (category: string) => void;
  onUpdatePrice: (category: string, id: string, newPrice: number) => void;
  onUpdateNights: (id: string, newNights: number) => void;
  onRemoveItem: (category: string, id: string) => void;
}

export const PricingSection = ({ 
  title, 
  items, 
  category, 
  showNights = false, 
  showPerPerson = false,
  totalParticipants,
  onAddItem,
  onUpdatePrice,
  onUpdateNights,
  onRemoveItem
}: PricingSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{title}</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddItem(category)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <PricingItemComponent
            key={item.id}
            item={item}
            category={category}
            showNights={showNights}
            showPerPerson={showPerPerson}
            totalParticipants={totalParticipants}
            onUpdatePrice={onUpdatePrice}
            onUpdateNights={onUpdateNights}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};
