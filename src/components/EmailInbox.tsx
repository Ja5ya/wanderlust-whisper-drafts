
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Send, RefreshCw, Plus, Check, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEmailMessages } from "@/hooks/useMessages";
import { useAddToFAQ } from "@/hooks/useAddToFAQ";
import SpeechToText from "./SpeechToText";

const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const { toast } = useToast();

  const { data: emails = [], isLoading } = useEmailMessages();
  const addToFAQ = useAddToFAQ();

  // Auto-generate response when email is selected
  useEffect(() => {
    if (selectedEmail && !draftResponse) {
      generateDraft();
    }
  }, [selectedEmail]);

  const connectEmailProvider = (provider: string) => {
    setIsConnected(true);
    toast({
      title: "Success",
      description: `Connected to ${provider} successfully!`,
      className: "fixed top-4 right-4 z-50"
    });
  };

  const generateDraft = async () => {
    if (!selectedEmail) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let draft = `Dear ${selectedEmail.customer?.name || selectedEmail.from_email.split('@')[0]},

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
      description: "Email moved to your drafts folder for final review and sending.",
      className: "fixed top-4 right-4 z-50"
    });
    setDraftResponse("");
    setSelectedEmail(null);
    setVoiceNotes("");
    setCustomPrompt("");
  };

  const handleAddToFAQ = () => {
    if (!selectedEmail || !faqQuestion.trim() || !faqAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both question and answer fields",
        variant: "destructive",
        className: "fixed top-4 right-4 z-50"
      });
      return;
    }
    
    addToFAQ.mutate({
      question: faqQuestion,
      answer: faqAnswer,
      category: "Customer Inquiries"
    });
    
    setFaqQuestion("");
    setFaqAnswer("");
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Email</CardTitle>
          <CardDescription>
            Connect your Gmail or Outlook account to start managing emails with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => connectEmailProvider('Gmail')}
              className="h-16"
            >
              <Mail className="h-6 w-6 mr-2" />
              Connect Gmail
            </Button>
            <Button 
              onClick={() => connectEmailProvider('Outlook')}
              variant="outline"
              className="h-16"
            >
              <Mail className="h-6 w-6 mr-2" />
              Connect Outlook
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Your email credentials are securely stored and encrypted
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inbox</span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading emails...</div>
                ) : (
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedEmail?.id === email.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                        } ${!email.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => setSelectedEmail(email)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{email.customer?.name || email.from_email}</span>
                          <span className="text-xs text-gray-500">{new Date(email.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-sm font-medium mb-1">{email.subject}</div>
                        <div className="text-xs text-gray-600 line-clamp-2">{email.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Draft Section */}
            <Card>
              <CardHeader>
                <CardTitle>AI Email Assistant</CardTitle>
                <CardDescription>
                  {selectedEmail ? `Responding to: ${selectedEmail.subject}` : 'Select an email to generate a response'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEmail && (
                  <>
                    {/* Original Message - Top */}
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

                    {/* AI Generated Response - Below Original */}
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

                    {/* Custom Instructions - Below AI Response */}
                    <div>
                      <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                      <Input
                        id="custom-prompt"
                        placeholder="e.g., mention our spring promotion..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                      />
                    </div>

                    {/* Voice Notes - Bottom */}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add to FAQ
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add to FAQ</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="faq-question">Question</Label>
                                <Input
                                  id="faq-question"
                                  value={faqQuestion}
                                  onChange={(e) => setFaqQuestion(e.target.value)}
                                  placeholder="Enter the FAQ question..."
                                />
                              </div>
                              <div>
                                <Label htmlFor="faq-answer">Answer</Label>
                                <Textarea
                                  id="faq-answer"
                                  value={faqAnswer}
                                  onChange={(e) => setFaqAnswer(e.target.value)}
                                  placeholder="Enter the FAQ answer..."
                                  rows={4}
                                />
                              </div>
                              <Button 
                                onClick={handleAddToFAQ} 
                                disabled={addToFAQ.isPending}
                                className="w-full"
                              >
                                {addToFAQ.isPending ? "Adding..." : "Add to FAQ"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Sent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No sent messages to display
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No draft messages to display
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailInbox;
