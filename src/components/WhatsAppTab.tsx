
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, MoreHorizontal, Reply, Phone, RefreshCw, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SpeechToText from "./SpeechToText";

interface WhatsAppTabProps {
  searchTerm?: string;
  customerWhatsApp?: any[];
  customerId?: string;
  customerName?: string;
}

interface WhatsAppMessage {
  id: string;
  phone_number: string;
  message_content: string;
  timestamp: string;
  is_incoming: boolean;
  is_read: boolean;
  customer_id?: string;
}

const WhatsAppTab = ({ searchTerm = "", customerWhatsApp, customerId, customerName }: WhatsAppTabProps) => {
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: allMessages = [], isLoading } = useQuery({
    queryKey: ['whatsapp-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as WhatsAppMessage[];
    },
    enabled: !customerWhatsApp,
  });

  // Use provided customerWhatsApp or fetched allMessages
  const messages = customerWhatsApp || allMessages;

  const filteredMessages = messages.filter(message =>
    message.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-generate response when message is selected
  useEffect(() => {
    if (selectedMessage && !draftResponse) {
      generateDraft();
    }
  }, [selectedMessage]);

  const generateDraft = async () => {
    if (!selectedMessage) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let draft = `Hi ${selectedMessage.phone_number}! 

Thank you for your WhatsApp message. I'd be happy to help you with your travel needs.

Based on your inquiry, I've prepared some initial recommendations:
• Customized itinerary based on your preferences
• Family-friendly accommodations
• Local experiences and cultural activities
• Transportation arrangements

I'll send you a detailed proposal within 24 hours with specific pricing and availability.

${customPrompt ? `\nAdditional notes: ${customPrompt}` : ''}
${voiceNotes ? `\nVoice notes: ${voiceNotes}` : ''}

Best regards,
Travel Specialist
TravelAssist DMC`;

      setDraftResponse(draft);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "WhatsApp draft generated successfully!",
        className: "fixed top-4 right-4 z-50"
      });
    }, 2000);
  };

  const regenerateDraft = () => {
    setDraftResponse("");
    generateDraft();
  };

  const acceptDraft = () => {
    toast({
      title: "Draft Accepted",
      description: "WhatsApp message moved to your drafts for final review and sending.",
      className: "fixed top-4 right-4 z-50"
    });
    setDraftResponse("");
    setSelectedMessage(null);
    setVoiceNotes("");
    setCustomPrompt("");
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('whatsapp_messages')
      .update({ is_read: true })
      .eq('id', messageId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading && !customerWhatsApp) {
    return <div className="text-center py-8">Loading WhatsApp messages...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WhatsApp Messages</span>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No WhatsApp messages found matching your search' : 'No WhatsApp messages found'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedMessage?.id === message.id ? 'bg-primary/10 border-primary' : ''
                  } ${!message.is_read && message.is_incoming ? 'border-green-200 bg-green-50' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-green-100 text-green-700">
                            <MessageCircle className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-base">{message.phone_number}</CardTitle>
                            {!message.is_read && message.is_incoming && <Badge className="bg-green-100 text-green-800 text-xs">New</Badge>}
                            {!message.is_incoming && <Badge variant="outline" className="text-xs">Sent</Badge>}
                          </div>
                          <CardDescription className="text-sm">
                            {message.is_incoming ? 'Incoming message' : 'Outgoing message'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">
                      {message.message_content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Assistant Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI WhatsApp Assistant</CardTitle>
          <CardDescription>
            {selectedMessage ? `Responding to: ${selectedMessage.phone_number}` : 'Select a WhatsApp message to generate a response'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMessage && (
            <>
              {/* Original Message */}
              <div>
                <Label htmlFor="whatsapp-content">Original Message</Label>
                <Textarea
                  id="whatsapp-content"
                  value={selectedMessage.message_content}
                  readOnly
                  rows={4}
                  className="bg-gray-50"
                />
              </div>

              {/* AI Generated Response */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="draft-response">AI Generated Response</Label>
                  {draftResponse && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={regenerateDraft}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  )}
                </div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI response...
                  </div>
                ) : (
                  <Textarea
                    id="draft-response"
                    value={draftResponse}
                    onChange={(e) => setDraftResponse(e.target.value)}
                    rows={12}
                    className="border-green-200 bg-green-50/30"
                    placeholder="AI response will appear here automatically..."
                  />
                )}
              </div>

              {/* Custom Instructions */}
              <div>
                <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                <Input
                  id="custom-prompt"
                  placeholder="e.g., mention our spring promotion..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>

              {/* Voice Notes */}
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
                {voiceNotes && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <strong>Transcription available:</strong> Voice notes have been captured and will be included in the AI response when regenerated.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {draftResponse && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={acceptDraft} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept & Move to Drafts
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTab;
