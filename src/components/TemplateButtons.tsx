
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TemplateButtons = () => {
  const [isTextBlockOpen, setIsTextBlockOpen] = useState(false);
  const [isDayTemplateOpen, setIsDayTemplateOpen] = useState(false);
  const [isTourTemplateOpen, setIsTourTemplateOpen] = useState(false);
  const { toast } = useToast();

  const [textBlock, setTextBlock] = useState({ title: '', content: '' });
  const [dayTemplate, setDayTemplate] = useState({ 
    name: '', 
    startPoint: '', 
    endPoint: '', 
    description: '',
    estimatedCost: 0 
  });
  const [tourTemplate, setTourTemplate] = useState({ 
    name: '', 
    theme: '', 
    duration: 0, 
    description: '',
    basePrice: 0 
  });

  const addTextBlock = () => {
    if (!textBlock.title || !textBlock.content) return;
    
    toast({
      title: "Success",
      description: "Text block added successfully!",
    });
    
    setTextBlock({ title: '', content: '' });
    setIsTextBlockOpen(false);
  };

  const addDayTemplate = () => {
    if (!dayTemplate.name || !dayTemplate.description) return;
    
    toast({
      title: "Success", 
      description: "Day template added successfully!",
    });
    
    setDayTemplate({ name: '', startPoint: '', endPoint: '', description: '', estimatedCost: 0 });
    setIsDayTemplateOpen(false);
  };

  const addTourTemplate = () => {
    if (!tourTemplate.name || !tourTemplate.description) return;
    
    toast({
      title: "Success",
      description: "Tour template added successfully!",
    });
    
    setTourTemplate({ name: '', theme: '', duration: 0, description: '', basePrice: 0 });
    setIsTourTemplateOpen(false);
  };

  return (
    <div className="flex gap-2">
      {/* Add Text Block */}
      <Dialog open={isTextBlockOpen} onOpenChange={setIsTextBlockOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Text Block
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Text Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-title">Title</Label>
              <Input
                id="text-title"
                value={textBlock.title}
                onChange={(e) => setTextBlock({ ...textBlock, title: e.target.value })}
                placeholder="Enter text block title..."
              />
            </div>
            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={textBlock.content}
                onChange={(e) => setTextBlock({ ...textBlock, content: e.target.value })}
                placeholder="Enter text block content..."
                rows={4}
              />
            </div>
            <Button onClick={addTextBlock} className="w-full">
              Add Text Block
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Day Template */}
      <Dialog open={isDayTemplateOpen} onOpenChange={setIsDayTemplateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Day Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Day Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="day-name">Template Name</Label>
              <Input
                id="day-name"
                value={dayTemplate.name}
                onChange={(e) => setDayTemplate({ ...dayTemplate, name: e.target.value })}
                placeholder="Enter day template name..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-point">Start Point</Label>
                <Input
                  id="start-point"
                  value={dayTemplate.startPoint}
                  onChange={(e) => setDayTemplate({ ...dayTemplate, startPoint: e.target.value })}
                  placeholder="Starting location..."
                />
              </div>
              <div>
                <Label htmlFor="end-point">End Point</Label>
                <Input
                  id="end-point"
                  value={dayTemplate.endPoint}
                  onChange={(e) => setDayTemplate({ ...dayTemplate, endPoint: e.target.value })}
                  placeholder="Ending location..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="day-description">Description</Label>
              <Textarea
                id="day-description"
                value={dayTemplate.description}
                onChange={(e) => setDayTemplate({ ...dayTemplate, description: e.target.value })}
                placeholder="Describe the day template..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="estimated-cost">Estimated Cost (USD)</Label>
              <Input
                id="estimated-cost"
                type="number"
                value={dayTemplate.estimatedCost}
                onChange={(e) => setDayTemplate({ ...dayTemplate, estimatedCost: Number(e.target.value) })}
                placeholder="Estimated cost per person..."
              />
            </div>
            <Button onClick={addDayTemplate} className="w-full">
              Add Day Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Tour Template */}
      <Dialog open={isTourTemplateOpen} onOpenChange={setIsTourTemplateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tour Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tour Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tour-name">Template Name</Label>
              <Input
                id="tour-name"
                value={tourTemplate.name}
                onChange={(e) => setTourTemplate({ ...tourTemplate, name: e.target.value })}
                placeholder="Enter tour template name..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tour-theme">Theme</Label>
                <Input
                  id="tour-theme"
                  value={tourTemplate.theme}
                  onChange={(e) => setTourTemplate({ ...tourTemplate, theme: e.target.value })}
                  placeholder="e.g., Cultural, Adventure..."
                />
              </div>
              <div>
                <Label htmlFor="tour-duration">Duration (Days)</Label>
                <Input
                  id="tour-duration"
                  type="number"
                  value={tourTemplate.duration}
                  onChange={(e) => setTourTemplate({ ...tourTemplate, duration: Number(e.target.value) })}
                  placeholder="Number of days..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tour-description">Description</Label>
              <Textarea
                id="tour-description"
                value={tourTemplate.description}
                onChange={(e) => setTourTemplate({ ...tourTemplate, description: e.target.value })}
                placeholder="Describe the tour template..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="base-price">Base Price (USD)</Label>
              <Input
                id="base-price"
                type="number"
                value={tourTemplate.basePrice}
                onChange={(e) => setTourTemplate({ ...tourTemplate, basePrice: Number(e.target.value) })}
                placeholder="Base price per person..."
              />
            </div>
            <Button onClick={addTourTemplate} className="w-full">
              Add Tour Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateButtons;
