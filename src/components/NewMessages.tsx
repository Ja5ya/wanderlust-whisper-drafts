
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EmailInbox from "./EmailInbox";
import WhatsAppTab from "./WhatsAppTab";

const NewMessages = () => {
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [whatsappSearchTerm, setWhatsappSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Center</CardTitle>
          <CardDescription>Manage customer communications across all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Messages</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <EmailInbox />
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search WhatsApp messages..."
                  value={whatsappSearchTerm}
                  onChange={(e) => setWhatsappSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <WhatsAppTab searchTerm={whatsappSearchTerm} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMessages;
