
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wand2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  currentItinerary: any[];
}

const RouteEditDialog = ({ isOpen, onClose, tourName, currentItinerary }: RouteEditDialogProps) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateChanges = async () => {
    if (!editPrompt.trim()) {
      toast({
        title: "Please enter editing instructions",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Route Updated",
        description: "The itinerary has been updated based on your instructions."
      });
      setIsGenerating(false);
      setEditPrompt("");
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Route: {tourName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-prompt">Route Editing Instructions</Label>
            <Textarea
              id="edit-prompt"
              placeholder="e.g., Add more cultural experiences on day 3, reduce travel time between locations, include a cooking class, remove the spa day and add adventure activities..."
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Current Itinerary Summary:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {currentItinerary.map((day, index) => (
                <div key={index}>
                  <span className="font-medium">Day {day.day}:</span> {day.location} - {day.activities}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateChanges}
              disabled={isGenerating || !editPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Apply Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteEditDialog;
