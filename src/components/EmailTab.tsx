
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import SpeechToText from "./SpeechToText";

interface EmailTabProps {
  customerEmails: any[];
  customerId: string;
  customerName: string;
}

const EmailTab = ({ customerEmails, customerId, customerName }: EmailTabProps) => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedEmail && !draftResponse) {
      generateDraft();
    }
  }, [selectedEmail]);

  const generateDraft = async () => {
    if (!selectedEmail) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      let draft = `Dear ${customerName},

Thank you for your message. I'd be happy to help you with your travel needs.

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
        description: "Email draft generated successfully!",
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
      description: "Email moved to your drafts folder for final review and sending.",
    });
    setDraftResponse("");
    setSelectedEmail(null);
    setVoiceNotes("");
    setCustomPrompt("");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Email List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Email Messages</span>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {customerEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                } ${!email.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{email.from_email}</span>
                  <span className="text-xs text-gray-500">{format(parseISO(email.timestamp), 'MMM d, HH:mm')}</span>
                </div>
                <div className="text-sm font-medium mb-1">{email.subject}</div>
                <div className="text-xs text-gray-600 line-clamp-2">{email.content}</div>
                {!email.is_read && (
                  <Badge variant="secondary" className="text-xs mt-1">New</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Draft Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI Email Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedEmail ? (
            <>
              {/* Original Message */}
              <div>
                <Label htmlFor="email-content">Original Message</Label>
                <Textarea
                  id="email-content"
                  value={selectedEmail.content}
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
                    Accept & Move to Drafts
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select an email to view details and generate a response
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTab;
