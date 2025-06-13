
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageSquare, Phone, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMessage {
  id: string;
  from: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  phone: string;
}

const WhatsAppMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Mock WhatsApp messages
  const [messages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      from: "John Doe",
      message: "Hi! I wanted to ask about changing our Bali hotel to a resort closer to the beach. Is that possible?",
      timestamp: "2024-01-15 14:30",
      isRead: false,
      phone: "+1-555-0123"
    },
    {
      id: "2",
      from: "Sarah Smith",
      message: "Good morning! We're so excited about Thailand trip. Can you send us the final itinerary? Thanks!",
      timestamp: "2024-01-15 09:15",
      isRead: false,
      phone: "+1-555-0124"
    },
    {
      id: "3",
      from: "Mike Johnson",
      message: "The Tokyo temple tour was amazing! Thank you for the recommendation. Any suggestions for our last day?",
      timestamp: "2024-01-14 18:45",
      isRead: true,
      phone: "+1-555-0125"
    }
  ]);

  const connectWhatsApp = () => {
    setIsConnected(true);
    toast({
      title: "Success",
      description: "Connected to WhatsApp Business API successfully!"
    });
  };

  const filteredMessages = messages.filter(message =>
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect WhatsApp Business</CardTitle>
          <CardDescription>
            Connect your WhatsApp Business account to manage customer messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={connectWhatsApp}
            className="w-full h-16"
          >
            <MessageSquare className="h-6 w-6 mr-2" />
            Connect WhatsApp Business
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Secure integration with WhatsApp Business API
          </p>
        </CardContent>
      </Card>
    );
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
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                } ${!message.isRead ? 'border-l-4 border-l-green-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {message.from.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{message.from}</span>
                    {!message.isRead && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Phone className="h-3 w-3 mr-1" />
                  {message.phone}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Details */}
      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
          <CardDescription>
            {selectedMessage ? `Conversation with ${selectedMessage.from}` : 'Select a message to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedMessage.from}</span>
                  <span className="text-sm text-gray-500">{selectedMessage.timestamp}</span>
                </div>
                <p className="text-sm">{selectedMessage.message}</p>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button size="sm" variant="outline">
                  Mark as Read
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a message to view details and respond
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppMessages;
