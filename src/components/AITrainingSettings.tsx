
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AITrainingSettings = () => {
  const [emailPrompt, setEmailPrompt] = useState("You are a professional travel consultant for a destination management company. Always be helpful, informative, and maintain a professional tone. Focus on providing detailed travel recommendations and assistance.");
  const [routePrompt, setRoutePrompt] = useState("Create optimized travel itineraries considering travel time, attractions, cultural experiences, and practical logistics. Always include estimated times and costs.");
  const [bookingPrompt, setBookingPrompt] = useState("Assist with hotel and flight bookings by providing accurate information, comparing options, and ensuring customer preferences are met.");
  
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [newTextBlock, setNewTextBlock] = useState({ title: "", content: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFAQDialogOpen, setIsFAQDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What is included in your tour packages?",
      answer: "Our tour packages typically include accommodation, transportation, guided tours, and some meals. Specific inclusions vary by package."
    },
    {
      id: 2,
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 30-60 days in advance for international trips and 2-3 weeks for domestic travel."
    },
    {
      id: 3,
      question: "What is your cancellation policy?",
      answer: "Cancellation policies vary by package. Generally, we offer full refunds for cancellations made 30+ days in advance, with graduated fees for shorter notice."
    }
  ]);

  const [textBlocks, setTextBlocks] = useState([
    {
      id: 1,
      title: "Cultural Experience Recommendations",
      content: "When recommending cultural experiences, always include local museums, traditional markets, cultural shows, and opportunities to interact with local communities."
    },
    {
      id: 2,
      title: "Family Travel Guidelines",
      content: "For families with children, prioritize safety, entertainment value, educational opportunities, and age-appropriate activities. Always suggest family-friendly accommodations."
    }
  ]);

  const savePrompts = () => {
    toast({
      title: "Success",
      description: "AI prompts have been updated successfully!"
    });
  };

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setFaqs([...faqs, { id: Date.now(), ...newFAQ }]);
      setNewFAQ({ question: "", answer: "" });
      setIsFAQDialogOpen(false);
      toast({
        title: "Success",
        description: "FAQ added to knowledge base!"
      });
    }
  };

  const addTextBlock = () => {
    if (newTextBlock.title && newTextBlock.content) {
      setTextBlocks([...textBlocks, { id: Date.now(), ...newTextBlock }]);
      setNewTextBlock({ title: "", content: "" });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Text block added successfully!"
      });
    }
  };

  const deleteFAQ = (id: number) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    toast({
      title: "Success",
      description: "FAQ removed from knowledge base."
    });
  };

  const deleteTextBlock = (id: number) => {
    setTextBlocks(textBlocks.filter(block => block.id !== id));
    toast({
      title: "Success", 
      description: "Text block removed successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Training Settings</h2>
          <p className="text-gray-600">Configure AI behavior and knowledge base</p>
        </div>
      </div>

      <Tabs defaultValue="prompts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="textblocks">Text Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle>AI Behavior Prompts</CardTitle>
              <CardDescription>
                Configure how the AI responds in different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email-prompt">Email Drafting Prompt</Label>
                <Textarea
                  id="email-prompt"
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                  rows={4}
                  placeholder="Define how the AI should behave when drafting emails..."
                />
              </div>

              <div>
                <Label htmlFor="route-prompt">Route Planning Prompt</Label>
                <Textarea
                  id="route-prompt"
                  value={routePrompt}
                  onChange={(e) => setRoutePrompt(e.target.value)}
                  rows={4}
                  placeholder="Define how the AI should create travel routes..."
                />
              </div>

              <div>
                <Label htmlFor="booking-prompt">Booking Assistance Prompt</Label>
                <Textarea
                  id="booking-prompt"
                  value={bookingPrompt}
                  onChange={(e) => setBookingPrompt(e.target.value)}
                  rows={4}
                  placeholder="Define how the AI should help with bookings..."
                />
              </div>

              <Button onClick={savePrompts} className="w-full">
                <Check className="h-4 w-4 mr-2" />
                Save All Prompts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>FAQ Knowledge Base</span>
                <Dialog open={isFAQDialogOpen} onOpenChange={setIsFAQDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New FAQ</DialogTitle>
                      <DialogDescription>
                        Add a frequently asked question and answer to the knowledge base
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="faq-question">Question</Label>
                        <Input
                          id="faq-question"
                          value={newFAQ.question}
                          onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                          placeholder="What is your question?"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq-answer">Answer</Label>
                        <Textarea
                          id="faq-answer"
                          value={newFAQ.answer}
                          onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                          placeholder="Provide a detailed answer..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addFAQ}>Add FAQ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Manage frequently asked questions that the AI can reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{faq.question}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFAQ(faq.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="textblocks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Route Planning Text Blocks</span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Text Block
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Text Block</DialogTitle>
                      <DialogDescription>
                        Add reusable content blocks for route planning
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="block-title">Title</Label>
                        <Input
                          id="block-title"
                          value={newTextBlock.title}
                          onChange={(e) => setNewTextBlock({...newTextBlock, title: e.target.value})}
                          placeholder="Block title..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="block-content">Content</Label>
                        <Textarea
                          id="block-content"
                          value={newTextBlock.content}
                          onChange={(e) => setNewTextBlock({...newTextBlock, content: e.target.value})}
                          placeholder="Block content..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addTextBlock}>Add Text Block</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Reusable content blocks for consistent route planning guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {textBlocks.map((block) => (
                  <Card key={block.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{block.title}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTextBlock(block.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{block.content}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingSettings;
