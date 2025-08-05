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
  booking_id?: string;
  itinerary_id?: string;
  trip_reference?: string;
  customer?: {
    name: string;
    email: string;
  };
}

export const useEmailMessages = () => {
  return useQuery({
    queryKey: ['email-messages'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('email_messages')
          .select(`
            id,
            customer_id,
            from_email,
            to_email,
            subject,
            content,
            is_read,
            is_draft,
            is_sent,
            timestamp,
            booking_id,
            itinerary_id,
            trip_reference,
            customers!email_messages_customer_id_fkey (
              name,
              email
            )
          `)
          .order('timestamp', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        if (!data) {
          console.warn('No data returned from Supabase');
          return [];
        }

        return data as EmailMessage[];
      } catch (error) {
        console.error('Error in useEmailMessages:', error);
        throw error instanceof Error 
          ? error 
          : new Error('Failed to fetch email messages');
      }
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useUnreadEmailCount = () => {
  return useQuery({
    queryKey: ['unread-email-count'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('email_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        return count || 0;
      } catch (error) {
        console.error('Error in useUnreadEmailCount:', error);
        throw error instanceof Error 
          ? error 
          : new Error('Failed to fetch unread email count');
      }
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
};
