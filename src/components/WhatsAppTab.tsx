
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, MoreHorizontal, Reply, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    enabled: !customerWhatsApp,
  });

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow 
                key={message.id}
                className={`cursor-pointer hover:bg-muted/50 ${!message.is_read && message.is_incoming ? 'bg-green-50' : ''}`}
                onClick={() => markAsRead(message.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        <MessageCircle className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{message.phone_number}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm line-clamp-1">
                    {message.message_content.substring(0, 100)}...
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                </TableCell>
                <TableCell>
                  {message.is_incoming ? 
                    <Badge className="bg-blue-100 text-blue-800">Incoming</Badge> : 
                    <Badge variant="outline">Outgoing</Badge>
                  }
                </TableCell>
                <TableCell>
                  {!message.is_read && message.is_incoming && <Badge className="bg-green-100 text-green-800 text-xs">New</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default WhatsAppTab;
