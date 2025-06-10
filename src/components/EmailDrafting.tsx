
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailDrafting = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [emailType, setEmailType] = useState("");
  const [draftedEmail, setDraftedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const sampleCustomerMessages = [
    {
      type: "Booking Inquiry",
      email: "john.doe@email.com",
      message: "Hi, I'm planning a 7-day trip to Bali for my family of 4 in December. We're interested in cultural experiences, some beach time, and family-friendly activities. Could you help us plan an itinerary and provide pricing?"
    },
    {
      type: "Itinerary Change",
      email: "sarah.smith@email.com", 
      message: "Hello, we need to modify our upcoming trip to Thailand. We'd like to extend our stay in Bangkok by 2 days and skip Phuket due to weather concerns. Can you help us adjust the booking?"
    },
    {
      type: "Activity Question",
      email: "mike.johnson@email.com",
      message: "We're arriving in Tokyo next week and wondering about the best temples to visit. Also, are there any special cultural events happening during our stay from March 15-22?"
    }
  ];

  const generateEmailDraft = async () => {
    if (!customerMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer message to generate a draft response.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let draft = "";
      
      if (emailType === "booking-inquiry" || customerMessage.toLowerCase().includes("booking") || customerMessage.toLowerCase().includes("trip")) {
        draft = `Dear ${customerEmail.split('@')[0]},

Thank you for your interest in our destination management services. We're excited to help you plan your upcoming trip!

Based on your inquiry, I've prepared a preliminary itinerary that includes:
• Cultural experiences and local guided tours
• Family-friendly activities suitable for all ages
• Recommended accommodations in prime locations
• Transportation arrangements
• Local dining experiences

I'll be sending you a detailed proposal within 24 hours with specific activities, pricing, and availability for your travel dates.

In the meantime, please let me know if you have any specific preferences or requirements that we should consider while planning your itinerary.

Looking forward to creating an unforgettable experience for you and your family!

Best regards,
Travel Specialist
TravelAssist DMC`;
      } else if (emailType === "itinerary-change" || customerMessage.toLowerCase().includes("change") || customerMessage.toLowerCase().includes("modify")) {
        draft = `Dear ${customerEmail.split('@')[0]},

Thank you for reaching out regarding the changes to your upcoming trip.

I've reviewed your booking and can certainly help you modify your itinerary. Here's what I can arrange:

• Extension of your Bangkok stay by 2 additional days
• Cancellation of the Phuket portion (with applicable refund)
• Alternative destination recommendations if you'd like to maintain the same trip duration
• Updated transportation arrangements

I'll process these changes and send you an updated itinerary with revised pricing within the next 2 hours. Please note that some changes may be subject to cancellation fees depending on the timing and supplier policies.

Would you like me to suggest alternative destinations for the time originally allocated to Phuket?

Best regards,
Travel Specialist
TravelAssist DMC`;
      } else {
        draft = `Dear ${customerEmail.split('@')[0]},

Thank you for your message. I'm delighted to assist you with information about your upcoming trip.

Based on your inquiry, I'll provide you with:
• Detailed recommendations tailored to your interests
• Current local information and updates
• Practical tips for your visit
• Any special arrangements that might enhance your experience

I'll compile this information and send you a comprehensive response within the next few hours.

If you have any urgent questions or need immediate assistance, please don't hesitate to call our 24/7 support line.

Best regards,
Travel Specialist
TravelAssist DMC`;
      }
      
      setDraftedEmail(draft);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "Email draft generated successfully!"
      });
    }, 2000);
  };

  const loadSampleMessage = (sample: typeof sampleCustomerMessages[0]) => {
    setCustomerEmail(sample.email);
    setCustomerMessage(sample.message);
    setEmailType(sample.type.toLowerCase().replace(' ', '-'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            AI-Powered Email Drafting
          </CardTitle>
          <CardDescription>
            Generate professional email responses for your customers automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sample Messages */}
          <div>
            <Label className="text-sm font-medium">Quick Start - Try Sample Messages:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sampleCustomerMessages.map((sample, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => loadSampleMessage(sample)}
                >
                  {sample.type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email-type">Email Type</Label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking-inquiry">Booking Inquiry</SelectItem>
                    <SelectItem value="itinerary-change">Itinerary Change</SelectItem>
                    <SelectItem value="activity-question">Activity Question</SelectItem>
                    <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer-message">Customer Message</Label>
                <Textarea
                  id="customer-message"
                  placeholder="Paste the customer's email message here..."
                  value={customerMessage}
                  onChange={(e) => setCustomerMessage(e.target.value)}
                  rows={8}
                />
              </div>

              <Button 
                onClick={generateEmailDraft} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Draft...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Generate Email Draft
                  </>
                )}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="drafted-email">Generated Email Draft</Label>
                <Textarea
                  id="drafted-email"
                  placeholder="Your AI-generated email draft will appear here..."
                  value={draftedEmail}
                  onChange={(e) => setDraftedEmail(e.target.value)}
                  rows={15}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled={!draftedEmail}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button className="flex-1" disabled={!draftedEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailDrafting;
