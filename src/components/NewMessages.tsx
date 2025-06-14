
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
