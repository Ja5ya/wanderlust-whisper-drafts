
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailInbox from "./EmailInbox";
import WhatsAppMessages from "./WhatsAppMessages";
import ConversationSummary from "./ConversationSummary";

const NewMessages = () => {
  const [llmQuery, setLlmQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleLlmQuery = async () => {
    if (!llmQuery.trim()) return;

    setIsProcessing(true);
    
    // Simulate LLM processing
    setTimeout(() => {
      toast({
        title: "Query Processed",
        description: "LLM has analyzed the conversations and interactions."
      });
      setIsProcessing(false);
      setLlmQuery("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email Messages</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailInbox />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppMessages />
        </TabsContent>
      </Tabs>

      {/* LLM Query Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Ask questions or request summaries of previous interactions across email and WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConversationSummary />
          
          <div>
            <Label htmlFor="llm-query">Ask AI about conversations</Label>
            <div className="flex gap-2 mt-2">
              <Textarea
                id="llm-query"
                placeholder="e.g., Summarize the last 5 interactions with John Doe, or What are the common customer concerns this week?"
                value={llmQuery}
                onChange={(e) => setLlmQuery(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleLlmQuery}
                disabled={isProcessing}
                className="shrink-0"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMessages;
