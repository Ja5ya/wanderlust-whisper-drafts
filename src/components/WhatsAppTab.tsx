
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import SpeechToText from "./SpeechToText";

interface WhatsAppTabProps {
  customerWhatsApp: any[];
  customerId: string;
  customerName: string;
}

const WhatsAppTab = ({ customerWhatsApp, customerId, customerName }: WhatsAppTabProps) => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedMessage && !draftResponse) {
      generateDraft();
    }
  }, [selectedMessage]);

  const generateDraft = async () => {
    if (!selectedMessage) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      let draft = `Hi ${customerName}! 👋

Thanks for reaching out! I'd be happy to help you with your travel plans.

Based on your message, here's what I can offer:
✈️ Customized itinerary
🏨 Best accommodation options
🎯 Local experiences
🚗 Transportation arrangements

I'll send you detailed options shortly with pricing and availability.

${customPrompt ? `\n📝 ${customPrompt}` : ''}
${voiceNotes ? `\n🎤 Voice notes: ${voiceNotes}` : ''}

Best regards,
Your Travel Specialist 🌟`;

      setDraftResponse(draft);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "WhatsApp draft generated successfully!",
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
      description: "WhatsApp message ready to send.",
    });
    setDraftResponse("");
    setSelectedMessage(null);
    setVoiceNotes("");
    setCustomPrompt("");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* WhatsApp Messages List */}
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
          <div className="space-y-2">
            {customerWhatsApp.map((message) => (
              <div
                key={message.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                } ${!message.is_read ? 'border-l-4 border-l-green-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-green-600" />
                    <span className="font-medium text-sm">{message.phone_number}</span>
                  </div>
                  <span className="text-xs text-gray-500">{format(parseISO(message.timestamp), 'MMM d, HH:mm')}</span>
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">{message.message_content}</div>
                {!message.is_read && (
                  <Badge variant="secondary" className="text-xs mt-1">New</Badge>
                )}
              </div>
            ))}
            {customerWhatsApp.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No WhatsApp messages found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Draft Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI WhatsApp Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMessage ? (
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
                    rows={8}
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
              </div>

              {/* Action Buttons */}
              {draftResponse && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={acceptDraft} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept & Send WhatsApp
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a WhatsApp message to view details and generate a response
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTab;
