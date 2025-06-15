
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MoreHorizontal, Reply, Forward } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EmailTabProps {
  searchTerm?: string;
  customerEmails?: any[];
  customerId?: string;
  customerName?: string;
}

interface EmailMessage {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  is_sent: boolean;
  is_draft: boolean;
  customer_id?: string;
}

const EmailTab = ({ searchTerm = "", customerEmails, customerId, customerName }: EmailTabProps) => {
  const { data: allEmails = [], isLoading } = useQuery({
    queryKey: ['email-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as EmailMessage[];
    },
    enabled: !customerEmails,
  });

  const emails = customerEmails || allEmails;

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsRead = async (emailId: string) => {
    await supabase
      .from('email_messages')
      .update({ is_read: true })
      .eq('id', emailId);
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

  if (isLoading && !customerEmails) {
    return <div className="text-center py-8">Loading email messages...</div>;
  }

  return (
    <div className="space-y-4">
      {filteredEmails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No email messages found matching your search' : 'No email messages found'}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmails.map((email) => (
              <TableRow 
                key={email.id}
                className={`cursor-pointer hover:bg-muted/50 ${!email.is_read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(email.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {email.from_email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{email.from_email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{email.subject}</span>
                    {!email.is_read && <Badge variant="secondary" className="text-xs">New</Badge>}
                    {email.is_draft && <Badge variant="outline" className="text-xs">Draft</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {email.content.substring(0, 100)}...
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">{formatDate(email.timestamp)}</span>
                </TableCell>
                <TableCell>
                  {email.is_sent ? 
                    <Badge variant="default">Sent</Badge> : 
                    <Badge variant="secondary">Received</Badge>
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="outline">
                      <Forward className="h-3 w-3 mr-1" />
                      Forward
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

export default EmailTab;
