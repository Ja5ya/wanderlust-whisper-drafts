
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: string;
  newItem: {
    name: string;
    dates: string;
    price: number;
    nights: number;
  };
  onItemChange: (field: string, value: string | number) => void;
  onAddItem: () => void;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  currentCategory,
  newItem,
  onItemChange,
  onAddItem
}: AddItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onItemChange('name', e.target.value)}
              placeholder={`Enter ${currentCategory.slice(0, -1)} name...`}
            />
          </div>
          <div>
            <Label htmlFor="item-dates">Dates</Label>
            <Input
              id="item-dates"
              value={newItem.dates}
              onChange={(e) => onItemChange('dates', e.target.value)}
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
                onChange={(e) => onItemChange('nights', Number(e.target.value))}
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
              onChange={(e) => onItemChange('price', Number(e.target.value))}
              placeholder="Enter price..."
            />
          </div>
          <Button onClick={onAddItem} className="w-full">
            Add {currentCategory.slice(0, -1)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
