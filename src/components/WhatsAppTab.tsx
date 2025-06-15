
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreHorizontal, Reply, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    enabled: !customerWhatsApp, // Only fetch if customerWhatsApp not provided
  });

  // Use provided customerWhatsApp or fetched allMessages
  const messages = customerWhatsApp || allMessages;

  const filteredMessages = messages.filter(message =>
    message.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-4">
      {filteredMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No WhatsApp messages found matching your search' : 'No WhatsApp messages found'}
        </div>
      ) : (
        filteredMessages.map((message) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${!message.is_read && message.is_incoming ? 'border-green-200 bg-green-50' : ''}`}
            onClick={() => markAsRead(message.id)}
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
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mark as {message.is_read ? 'Unread' : 'Read'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default WhatsAppTab;
