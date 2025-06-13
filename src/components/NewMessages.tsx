
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Clock, User, MessageSquare, Reply, Forward, Archive } from "lucide-react";
import EmailInbox from "@/components/EmailInbox";
import WhatsAppMessages from "@/components/WhatsAppMessages";
import EmailDrafting from "@/components/EmailDrafting";
import { useEmailMessages } from "@/hooks/useMessages";

const NewMessages = () => {
  const { data: emailMessages = [], isLoading, error } = useEmailMessages();
  
  const unreadEmails = emailMessages.filter(msg => !msg.is_read);
  const recentEmails = emailMessages.slice(0, 5);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Loading messages...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">Error loading messages</div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadEmails.length}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailMessages.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Latest customer communications across all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEmails.map((message) => (
              <div
                key={message.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  !message.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {message.customer?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{message.customer?.name || 'Unknown Customer'}</h4>
                      {!message.is_read && (
                        <Badge variant="default" className="bg-blue-500">New</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{message.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.content}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="h-3 w-3 mr-1" />
                    Archive
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {recentEmails.length === 0 && (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                No customer messages found. New messages will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Management Tabs */}
      <Tabs defaultValue="emails" className="space-y-6">
        <TabsList>
          <TabsTrigger value="emails">Email Inbox</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="drafts">Draft Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="emails">
          <EmailInbox />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppMessages />
        </TabsContent>

        <TabsContent value="drafts">
          <EmailDrafting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewMessages;
