
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, Clock, AlertCircle } from "lucide-react";
import { useUnreadEmailCount } from "@/hooks/useMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardActionCardsProps {
  onEmailsClick: () => void;
}

const DashboardActionCards = ({ onEmailsClick }: DashboardActionCardsProps) => {
  const { data: unreadEmailCount = 0 } = useUnreadEmailCount();

  const { data: pendingBookings = 0 } = useQuery({
    queryKey: ['pending-bookings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeCustomers = 0 } = useQuery({
    queryKey: ['active-customers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Active', 'Traveling']);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: customerIssues = 0 } = useQuery({
    queryKey: ['customer-issues-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('email_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) throw error;
      return Math.min(count || 0, 10);
    },
  });

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onEmailsClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emails to Read</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadEmailCount}</div>
          <p className="text-xs text-muted-foreground">Unread emails</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingBookings}</div>
          <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Issues</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerIssues}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActionCards;
