
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, MessageSquare } from "lucide-react";

const ConversationSummary = () => {
  const [summaryData] = useState({
    totalInteractions: 156,
    emailCount: 89,
    whatsappCount: 67,
    responseRate: 94,
    avgResponseTime: "2.3 hours",
    topTopics: [
      { topic: "Booking Changes", count: 23 },
      { topic: "Itinerary Requests", count: 18 },
      { topic: "Payment Issues", count: 12 },
      { topic: "General Inquiries", count: 34 }
    ]
  });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Total Interactions</p>
            <p className="text-2xl font-bold">{summaryData.totalInteractions}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-sm font-medium">Response Rate</p>
            <p className="text-2xl font-bold">{summaryData.responseRate}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-orange-500" />
          <div>
            <p className="text-sm font-medium">Avg Response Time</p>
            <p className="text-lg font-bold">{summaryData.avgResponseTime}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Channel Split</p>
          <div className="flex gap-1">
            <Badge variant="outline">Email: {summaryData.emailCount}</Badge>
            <Badge variant="outline">WhatsApp: {summaryData.whatsappCount}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConversationSummary;
