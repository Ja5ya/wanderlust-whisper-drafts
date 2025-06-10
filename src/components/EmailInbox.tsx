import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, RefreshCw, Plus, Check, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [draftResponse, setDraftResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Mock email data
  const [emails] = useState<EmailMessage[]>([
    {
      id: "1",
      from: "john.doe@email.com",
      subject: "Bali Trip Inquiry - Family of 4",
      content: "Hi, I'm planning a 7-day trip to Bali for my family of 4 in December. We're interested in cultural experiences, some beach time, and family-friendly activities. Could you help us plan an itinerary and provide pricing?",
      timestamp: "2024-01-15 09:30",
      isRead: false
    },
    {
      id: "2", 
      from: "sarah.smith@email.com",
      subject: "Thailand Itinerary Changes",
      content: "Hello, we need to modify our upcoming trip to Thailand. We'd like to extend our stay in Bangkok by 2 days and skip Phuket due to weather concerns. Can you help us adjust the booking?",
      timestamp: "2024-01-15 08:15",
      isRead: false
    },
    {
      id: "3",
      from: "mike.johnson@email.com", 
      subject: "Tokyo Temple Recommendations",
      content: "We're arriving in Tokyo next week and wondering about the best temples to visit. Also, are there any special cultural events happening during our stay from March 15-22?",
      timestamp: "2024-01-14 16:45",
      isRead: true
    }
  ]);

  const connectEmailProvider = (provider: string) => {
    // Simulate connection
    setIsConnected(true);
    toast({
      title: "Success",
      description: `Connected to ${provider} successfully!`
    });
  };

  const generateDraft = async () => {
    if (!selectedEmail) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let draft = `Dear ${selectedEmail.from.split('@')[0]},

Thank you for your inquiry. I'd be happy to help you with your travel needs.

Based on your message, I've prepared some initial recommendations:
• Customized itinerary based on your preferences
• Family-friendly accommodations
• Local experiences and cultural activities
• Transportation arrangements

I'll send you a detailed proposal within 24 hours with specific pricing and availability.

${customPrompt ? `\nAdditional notes: ${customPrompt}` : ''}

Best regards,
Travel Specialist
TravelAssist DMC`;

      setDraftResponse(draft);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "Email draft generated successfully!"
      });
    }, 2000);
  };

  const acceptDraft = () => {
    toast({
      title: "Draft Accepted",
      description: "Email moved to your drafts folder for final review and sending."
    });
    setDraftResponse("");
    setSelectedEmail(null);
  };

  const addToFAQ = () => {
    if (!selectedEmail) return;
    
    // Open FAQ editor in new tab
    const newTab = window.open('/faq-editor', '_blank');
    if (newTab) {
      toast({
        title: "Opening FAQ Editor",
        description: "FAQ editor opened in new tab for review and editing."
      });
    }
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
                <div className="space-y-2">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmail?.id === email.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                      } ${!email.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{email.from}</span>
                        <span className="text-xs text-gray-500">{email.timestamp}</span>
                      </div>
                      <div className="text-sm font-medium mb-1">{email.subject}</div>
                      <div className="text-xs text-gray-600 line-clamp-2">{email.content}</div>
                    </div>
                  ))}
                </div>
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

                    <div>
                      <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                      <Input
                        id="custom-prompt"
                        placeholder="e.g., mention our spring promotion..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={generateDraft}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Generate AI Response
                        </>
                      )}
                    </Button>

                    {draftResponse && (
                      <>
                        <div>
                          <Label htmlFor="draft-response">AI Generated Response</Label>
                          <Textarea
                            id="draft-response"
                            value={draftResponse}
                            onChange={(e) => setDraftResponse(e.target.value)}
                            rows={12}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={acceptDraft} className="flex-1">
                            <Check className="h-4 w-4 mr-2" />
                            Accept & Move to Drafts
                          </Button>
                          <Button onClick={addToFAQ} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add to FAQ
                          </Button>
                        </div>
                      </>
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
