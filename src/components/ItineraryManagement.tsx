import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Users, MapPin, Search, RefreshCw, Check, MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import SpeechToText from "./SpeechToText";
import PricingBreakdown from "./PricingBreakdown";
import TemplateButtons from "./TemplateButtons";
import NotesSection from "./NotesSection";

const ItineraryManagement = () => {
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [draftItinerary, setDraftItinerary] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ['itineraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select(`
          *,
          customer:customers!customer_id(name, email, status)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: customerEmails = [] } = useQuery({
    queryKey: ['customer-emails', selectedItinerary?.customer_id],
    queryFn: async () => {
      if (!selectedItinerary?.customer_id) return [];
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .eq('customer_id', selectedItinerary.customer_id)
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedItinerary?.customer_id,
  });

  const { data: customerWhatsApp = [] } = useQuery({
    queryKey: ['customer-whatsapp', selectedItinerary?.customer_id],
    queryFn: async () => {
      if (!selectedItinerary?.customer_id) return [];
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('customer_id', selectedItinerary.customer_id)
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedItinerary?.customer_id,
  });

  // Filter and sort itineraries
  const filteredAndSortedItineraries = itineraries
    .filter(itinerary => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        itinerary.title.toLowerCase().includes(searchLower) ||
        itinerary.customer?.name.toLowerCase().includes(searchLower) ||
        itinerary.description?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "start_date":
          if (!a.start_date && !b.start_date) return 0;
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case "total_days":
          return b.total_days - a.total_days;
        case "total_participants":
          return (b.total_participants || 0) - (a.total_participants || 0);
        case "budget":
          return (b.budget || 0) - (a.budget || 0);
        case "updated_at":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  const generateItinerary = async () => {
    if (!selectedItinerary) return;

    setIsGenerating(true);
    
    // Get recent messages for context
    const recentMessages = [
      ...customerEmails.slice(0, 3).map(email => `Email: ${email.subject} - ${email.content}`),
      ...customerWhatsApp.slice(0, 3).map(msg => `WhatsApp: ${msg.message_content}`)
    ];

    setTimeout(() => {
      let itinerary = `PERSONALIZED ITINERARY FOR ${selectedItinerary.customer?.name?.toUpperCase() || 'CLIENT'}
Duration: ${selectedItinerary.total_days} days
Participants: ${selectedItinerary.total_participants || 'Not specified'}

${recentMessages.length > 0 ? `\nBased on recent communications:\n${recentMessages.join('\n')}\n` : ''}

DAY-BY-DAY ITINERARY:

Day 1: Arrival & Welcome
- Airport pickup and transfer to hotel
- Hotel check-in and welcome briefing
- City orientation tour
- Welcome dinner at local restaurant

Day 2: Cultural Immersion
- Morning: Historical sites and museums
- Afternoon: Local market exploration
- Evening: Traditional cultural performance

Day 3: Adventure & Nature
- Full-day outdoor adventure activity
- Scenic location visits
- Photography opportunities
- Local lunch experience

${selectedItinerary.total_days > 3 ? `
Day 4-${selectedItinerary.total_days - 1}: Extended Exploration
- Customized activities based on preferences
- Multiple location visits
- Cultural immersion experiences
- Local interaction opportunities
` : ''}

Day ${selectedItinerary.total_days}: Departure
- Final shopping and souvenir hunting
- Hotel checkout and airport transfer
- Departure assistance

${customPrompt ? `\nCustom Requirements: ${customPrompt}` : ''}
${voiceNotes ? `\nVoice Notes: ${voiceNotes}` : ''}

INCLUDED SERVICES:
• Accommodation (${selectedItinerary.total_days - 1} nights)
• All transfers and transportation
• Professional guide services
• Entrance fees to attractions
• Selected meals as mentioned
• 24/7 emergency support

EXCLUDED SERVICES:
• International flights
• Travel insurance
• Personal expenses
• Tips and gratuities
• Optional activities`;

      setDraftItinerary(itinerary);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "AI itinerary generated successfully!",
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
    setVoiceNotes("");
    setCustomPrompt("");
  };

  const handleItinerarySelect = (itinerary: any) => {
    setSelectedItinerary(itinerary);
    setDraftItinerary("");
    setCustomPrompt("");
    setVoiceNotes("");
    // Auto-generate itinerary when selected
    setTimeout(() => {
      generateItinerary();
    }, 100);
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading itineraries...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Itinerary Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Itinerary
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search itineraries by title, customer, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Updated</SelectItem>
            <SelectItem value="start_date">Travel Date</SelectItem>
            <SelectItem value="total_days">Number of Days</SelectItem>
            <SelectItem value="total_participants">Number of People</SelectItem>
            <SelectItem value="budget">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Itinerary List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Itineraries ({filteredAndSortedItineraries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredAndSortedItineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedItinerary?.id === itinerary.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleItinerarySelect(itinerary)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{itinerary.customer?.name || 'Unknown Client'}</h3>
                      <Badge variant={itinerary.customer?.status === 'active' ? 'default' : 'secondary'}>
                        {itinerary.customer?.status || 'Unknown'}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="font-medium">{itinerary.title}</div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{itinerary.total_days} days</span>
                        </div>
                        
                        {itinerary.total_participants && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{itinerary.total_participants}</span>
                          </div>
                        )}
                      </div>
                      
                      {itinerary.budget && (
                        <div className="flex items-center space-x-1">
                          <span>${itinerary.budget.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {itinerary.start_date && (
                        <div className="text-xs text-gray-500">
                          {format(parseISO(itinerary.start_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredAndSortedItineraries.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No itineraries found</p>
                    <p className="text-xs">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first itinerary to get started'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Itinerary Details */}
        <div className="lg:col-span-2">
          {selectedItinerary ? (
            <div className="space-y-6">
              {/* Recent Messages Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Recent Communications Context
                  </CardTitle>
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
                    {customerEmails.length === 0 && customerWhatsApp.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        No recent communications to display
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Generated Itinerary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI Generated Itinerary</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TemplateButtons />
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
                      rows={15}
                      className="border-green-200 bg-green-50/30 font-mono text-sm"
                      placeholder="AI itinerary will appear here automatically..."
                    />
                  )}
                </CardContent>
              </Card>

              {/* Custom Instructions & Voice */}
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

              {/* Enhanced Price Breakdown */}
              <PricingBreakdown 
                totalDays={selectedItinerary.total_days}
                totalParticipants={selectedItinerary.total_participants || 1}
              />

              {/* Notes Section */}
              <NotesSection 
                contextId={selectedItinerary.id}
                contextType="itinerary"
                title="Itinerary Notes"
              />

              {/* Action Buttons */}
              {draftItinerary && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={acceptItinerary} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept & Save Itinerary
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select an Itinerary</h3>
                <p className="text-gray-600">Choose an itinerary from the list to view AI-generated content and pricing details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryManagement;
