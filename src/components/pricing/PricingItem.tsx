
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PricingItem {
  id: string;
  name: string;
  dates: string;
  nights?: number;
  price: number;
  currency: string;
}

interface PricingItemProps {
  item: PricingItem;
  category: string;
  showNights?: boolean;
  showPerPerson?: boolean;
  totalParticipants: number;
  onUpdatePrice: (category: string, id: string, newPrice: number) => void;
  onUpdateNights: (id: string, newNights: number) => void;
  onRemove: (category: string, id: string) => void;
}

export const PricingItemComponent = ({ 
  item, 
  category, 
  showNights = false, 
  showPerPerson = false, 
  totalParticipants,
  onUpdatePrice,
  onUpdateNights,
  onRemove
}: PricingItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="flex-1">
        <div className="font-medium text-sm">{item.name}</div>
        <div className="text-xs text-gray-500">{item.dates}</div>
        {showNights && item.nights && (
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Input
              type="number"
              value={item.nights}
              onChange={(e) => onUpdateNights(item.id, Number(e.target.value))}
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
            onChange={(e) => onUpdatePrice(category, item.id, Number(e.target.value))}
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
        onClick={() => onRemove(category, item.id)}
        className="ml-2"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
