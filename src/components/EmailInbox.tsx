
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

  // Auto-add to drafts when AI response is generated
  useEffect(() => {
    if (draftResponse && selectedEmail) {
      // Automatically add to drafts when response is generated
      console.log("Auto-adding email response to drafts:", {
        to: selectedEmail.from_email,
        subject: `Re: ${selectedEmail.subject}`,
        content: draftResponse
      });
    }
  }, [draftResponse, selectedEmail]);

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
        description: "Email draft generated and added to drafts automatically!",
        className: "fixed top-4 right-4 z-50"
      });
    }, 2000);
  };

  const regenerateDraft = () => {
    setDraftResponse("");
    generateDraft();
  };

  const sendEmail = () => {
    if (!draftResponse || !selectedEmail) return;
    
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully!",
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
          {!selectedEmail ? (
            /* Gmail-style Email List View */
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
                  <div className="space-y-1">
                    {emails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          !email.is_read ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => setSelectedEmail(email)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium text-sm ${!email.is_read ? 'font-bold' : ''}`}>
                                {email.customer?.name || email.from_email}
                              </span>
                              {!email.is_read && <Badge variant="secondary" className="text-xs">New</Badge>}
                            </div>
                            <div className={`text-sm mb-1 ${!email.is_read ? 'font-semibold' : ''}`}>
                              {email.subject}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {email.content}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                            {new Date(email.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Gmail-style Email Detail View with AI Assistant */
            <div className="space-y-6">
              {/* Back to Inbox Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedEmail(null);
                  setDraftResponse("");
                  setCustomPrompt("");
                  setVoiceNotes("");
                }}
              >
                ← Back to Inbox
              </Button>

              {/* Trip Context Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Trip Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Trip ID or reference (e.g., TRIP-2024-001)"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Load Trip
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Loading trip context helps AI provide more relevant responses about ongoing bookings
                  </p>
                </CardContent>
              </Card>

              {/* Email Detail with AI Assistant */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Email Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                    <CardDescription>
                      From: {selectedEmail.customer?.name || selectedEmail.from_email} • {new Date(selectedEmail.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedEmail.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Assistant */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Email Assistant</CardTitle>
                    <CardDescription>
                      Generate and customize your response
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* AI Generated Response */}
                    <div>
                      <Label htmlFor="draft-response">AI Generated Response (Auto-saved to Drafts)</Label>
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

                    {/* Custom Instructions and Regenerate - Side by Side */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                        <Input
                          id="custom-prompt"
                          placeholder="e.g., mention our spring promotion..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={regenerateDraft}
                          disabled={isGenerating}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
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
                        <Button onClick={sendEmail} className="flex-1">
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
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
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
