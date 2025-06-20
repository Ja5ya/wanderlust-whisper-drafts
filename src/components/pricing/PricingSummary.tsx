
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PricingSummaryProps {
  profitMargin: number;
  onProfitMarginChange: (margin: number) => void;
  hotelTotal: number;
  activityTotal: number;
  transportTotal: number;
  guideTotal: number;
  subtotal: number;
  profit: number;
  total: number;
}

export const PricingSummary = ({
  profitMargin,
  onProfitMarginChange,
  hotelTotal,
  activityTotal,
  transportTotal,
  guideTotal,
  subtotal,
  profit,
  total
}: PricingSummaryProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="profit-margin">Profit Margin (%)</Label>
        <Input
          id="profit-margin"
          type="number"
          value={profitMargin}
          onChange={(e) => onProfitMarginChange(Number(e.target.value))}
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
  );
};
