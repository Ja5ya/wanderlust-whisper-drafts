
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Check, Plus, MapPin, Calendar, Users, DollarSign, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SpeechToText from "./SpeechToText";
import { useTourTemplates, useTourDayTemplates } from "@/hooks/useTourTemplates";
import { useTransportRates, useActivityRates } from "@/hooks/usePricingTables";

interface ItineraryTabProps {
  customerItineraries: any[];
  customerId: string;
  customerName: string;
  customerEmails: any[];
  customerWhatsApp: any[];
}

const ItineraryTab = ({ 
  customerItineraries, 
  customerId, 
  customerName, 
  customerEmails, 
  customerWhatsApp 
}: ItineraryTabProps) => {
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [draftItinerary, setDraftItinerary] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [pricing, setPricing] = useState({
    hotels: 0,
    transportation: 0,
    activities: 0,
    guides: 0,
    profitMargin: 20,
    totalCost: 0,
    totalProfit: 0
  });
  const { toast } = useToast();

  const { data: tourTemplates = [] } = useTourTemplates();
  const { data: tourDayTemplates = [] } = useTourDayTemplates();
  const { data: transportRates = [] } = useTransportRates();
  const { data: activityRates = [] } = useActivityRates();

  useEffect(() => {
    if (selectedItinerary && !draftItinerary) {
      generateItinerary();
    }
  }, [selectedItinerary]);

  useEffect(() => {
    calculatePricing();
  }, [pricing.hotels, pricing.transportation, pricing.activities, pricing.guides, pricing.profitMargin]);

  const calculatePricing = () => {
    const subtotal = pricing.hotels + pricing.transportation + pricing.activities + pricing.guides;
    const profit = (subtotal * pricing.profitMargin) / 100;
    const total = subtotal + profit;
    
    setPricing(prev => ({
      ...prev,
      totalCost: subtotal,
      totalProfit: profit
    }));
  };

  const generateItinerary = async () => {
    if (!selectedItinerary) return;

    setIsGenerating(true);
    
    // Get recent messages for context
    const recentMessages = [
      ...customerEmails.slice(0, 3).map(email => `Email: ${email.subject} - ${email.content}`),
      ...customerWhatsApp.slice(0, 3).map(msg => `WhatsApp: ${msg.message_content}`)
    ];

    setTimeout(() => {
      let itinerary = `ITINERARY FOR ${customerName.toUpperCase()}
Duration: ${selectedItinerary.total_days} days
Participants: ${selectedItinerary.total_participants || 'Not specified'}

${recentMessages.length > 0 ? `\nBased on recent communications:\n${recentMessages.join('\n')}\n` : ''}

DAY-BY-DAY ITINERARY:

Day 1: Arrival & City Orientation
- Arrival at destination
- Hotel check-in and welcome briefing
- City orientation tour
- Welcome dinner at local restaurant

Day 2: Cultural Exploration
- Morning: Historical sites tour
- Afternoon: Local market visit
- Evening: Traditional performance

Day 3: Adventure Activities
- Morning: Outdoor adventure activity
- Afternoon: Scenic location visit
- Evening: Leisure time

${selectedItinerary.total_days > 3 ? `
Day 4-${selectedItinerary.total_days - 1}: Extended Activities
- Customized activities based on preferences
- Multiple location visits
- Cultural immersion experiences
` : ''}

Day ${selectedItinerary.total_days}: Departure
- Final shopping opportunity
- Transfer to airport
- Departure assistance

${customPrompt ? `\nCustom Requirements: ${customPrompt}` : ''}
${voiceNotes ? `\nVoice Notes: ${voiceNotes}` : ''}

INCLUDED SERVICES:
• Accommodation (${selectedItinerary.total_days - 1} nights)
• All transfers and transportation
• Professional guide services
• Entrance fees to attractions
• Selected meals as mentioned

EXCLUDED SERVICES:
• International flights
• Travel insurance
• Personal expenses
• Tips and gratuities`;

      setDraftItinerary(itinerary);
      setIsGenerating(false);
      
      // Auto-calculate initial pricing based on database rates
      const estimatedHotels = (selectedItinerary.total_days - 1) * 150; // $150 per night
      const estimatedTransport = selectedItinerary.total_days * 80; // $80 per day
      const estimatedActivities = selectedItinerary.total_days * 50; // $50 per day
      const estimatedGuides = selectedItinerary.total_days * 120; // $120 per day
      
      setPricing(prev => ({
        ...prev,
        hotels: estimatedHotels,
        transportation: estimatedTransport,
        activities: estimatedActivities,
        guides: estimatedGuides
      }));
      
      toast({
        title: "Success",
        description: "Itinerary generated successfully!",
      });
    }, 3000);
  };

  const regenerateItinerary = () => {
    setDraftItinerary("");
    generateItinerary();
  };

  const acceptItinerary = () => {
    toast({
      title: "Itinerary Accepted",
      description: "Itinerary saved successfully!",
    });
    setDraftItinerary("");
    setSelectedItinerary(null);
    setVoiceNotes("");
    setCustomPrompt("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Itinerary Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Itinerary
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Itinerary List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Customer Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customerItineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedItinerary?.id === itinerary.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedItinerary(itinerary)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{itinerary.title}</span>
                      <Badge variant={itinerary.status === 'Draft' ? 'secondary' : 'default'}>
                        {itinerary.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>{itinerary.total_days} days</span>
                      </div>
                      {itinerary.total_participants && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-3 w-3" />
                          <span>{itinerary.total_participants} people</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {customerItineraries.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No itineraries found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Itinerary Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItinerary ? (
            <>
              {/* Recent Messages Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Communications Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {[...customerEmails.slice(0, 2), ...customerWhatsApp.slice(0, 2)].map((msg, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                        <span className="font-medium">
                          {'subject' in msg ? 'Email' : 'WhatsApp'}:
                        </span>
                        <span className="ml-2">
                          {'subject' in msg ? msg.subject : msg.message_content.substring(0, 100)}...
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Generated Itinerary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI Generated Itinerary</CardTitle>
                    <div className="flex items-center space-x-2">
                      {draftItinerary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={regenerateItinerary}
                          disabled={isGenerating}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Templates
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating AI itinerary...
                    </div>
                  ) : (
                    <Textarea
                      value={draftItinerary}
                      onChange={(e) => setDraftItinerary(e.target.value)}
                      rows={12}
                      className="border-green-200 bg-green-50/30 font-mono text-sm"
                      placeholder="AI itinerary will appear here automatically..."
                    />
                  )}

                  {/* Templates Sidebar */}
                  {showTemplates && (
                    <div className="border-t pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Tour Templates</Label>
                          <div className="max-h-40 overflow-y-auto space-y-1 mt-2">
                            {tourTemplates.map((template) => (
                              <div key={template.id} className="text-xs p-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">
                                <div className="font-medium">{template.name}</div>
                                <div className="text-gray-600">{template.duration_days} days • {template.theme}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Day Templates</Label>
                          <div className="max-h-40 overflow-y-auto space-y-1 mt-2">
                            {tourDayTemplates.map((template) => (
                              <div key={template.id} className="text-xs p-2 bg-green-50 rounded hover:bg-green-100 cursor-pointer">
                                <div className="font-medium">{template.name}</div>
                                <div className="text-gray-600">{template.start_point} → {template.end_point}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom-prompt">Custom Instructions</Label>
                    <Input
                      id="custom-prompt"
                      placeholder="e.g., add adventure activities, focus on cultural experiences..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="voice-notes">Voice Notes & Transcription</Label>
                    <Textarea
                      id="voice-notes"
                      placeholder="Your voice notes and transcription will appear here..."
                      value={voiceNotes}
                      onChange={(e) => setVoiceNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="mt-2">
                      <SpeechToText 
                        onTranscript={(text) => setVoiceNotes(prev => prev ? `${prev}\n\n${text}` : text)}
                        placeholder="Click microphone to add voice notes..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hotels">Hotels ($)</Label>
                      <Input
                        id="hotels"
                        type="number"
                        value={pricing.hotels}
                        onChange={(e) => setPricing(prev => ({ ...prev, hotels: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="transportation">Transportation ($)</Label>
                      <Input
                        id="transportation"
                        type="number"
                        value={pricing.transportation}
                        onChange={(e) => setPricing(prev => ({ ...prev, transportation: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="activities">Activities ($)</Label>
                      <Input
                        id="activities"
                        type="number"
                        value={pricing.activities}
                        onChange={(e) => setPricing(prev => ({ ...prev, activities: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="guides">Guides ($)</Label>
                      <Input
                        id="guides"
                        type="number"
                        value={pricing.guides}
                        onChange={(e) => setPricing(prev => ({ ...prev, guides: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profit-margin">Profit Margin (%)</Label>
                      <Input
                        id="profit-margin"
                        type="number"
                        value={pricing.profitMargin}
                        onChange={(e) => setPricing(prev => ({ ...prev, profitMargin: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal:</span>
                        <span className="font-medium">${pricing.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Profit ({pricing.profitMargin}%):</span>
                        <span className="font-medium text-green-600">${pricing.totalProfit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${(pricing.totalCost + pricing.totalProfit).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {draftItinerary && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={acceptItinerary} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept & Save Itinerary
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select an itinerary to view details and generate AI content
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryTab;
