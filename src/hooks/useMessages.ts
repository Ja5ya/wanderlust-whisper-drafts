
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EmailMessage {
  id: string;
  customer_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  content: string;
  is_read: boolean;
  is_draft: boolean;
  is_sent: boolean;
  timestamp: string;
  customer?: {
    name: string;
    email: string;
  };
}

export const useEmailMessages = () => {
  return useQuery({
    queryKey: ['email-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_messages')
        .select(`
          *,
          customer:customers!customer_id(name, email)
        `)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as EmailMessage[];
    },
  });
};

export const useUnreadEmailCount = () => {
  return useQuery({
    queryKey: ['unread-email-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('email_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    },
  });
};
