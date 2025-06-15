
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MoreHorizontal, Reply, Forward } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmailTabProps {
  searchTerm?: string;
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

const EmailTab = ({ searchTerm = "" }: EmailTabProps) => {
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['email-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_messages')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as EmailMessage[];
    },
  });

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

  if (isLoading) {
    return <div className="text-center py-8">Loading email messages...</div>;
  }

  return (
    <div className="space-y-4">
      {filteredEmails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No email messages found matching your search' : 'No email messages found'}
        </div>
      ) : (
        filteredEmails.map((email) => (
          <Card 
            key={email.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${!email.is_read ? 'border-blue-200 bg-blue-50' : ''}`}
            onClick={() => markAsRead(email.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {email.from_email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-base">{email.from_email}</CardTitle>
                      {!email.is_read && <Badge variant="secondary" className="text-xs">New</Badge>}
                      {email.is_draft && <Badge variant="outline" className="text-xs">Draft</Badge>}
                    </div>
                    <CardDescription className="text-sm">{email.subject}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{formatDate(email.timestamp)}</span>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {email.content}
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button size="sm" variant="outline">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Mark as {email.is_read ? 'Unread' : 'Read'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default EmailTab;
