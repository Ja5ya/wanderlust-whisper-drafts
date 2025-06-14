
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  customer_id: string;
  hotel_id: string | null;
  booking_reference: string;
  destination: string;
  start_date: string;
  end_date: string;
  number_of_guests: number;
  number_of_rooms: number | null;
  total_amount: number;
  status: string;
  confirmation_number: string | null;
  regime: string | null;
  special_requests: string | null;
  created_at: string;
  customer?: {
    name: string;
    email: string;
  };
  hotel?: {
    name: string;
    location: string;
  };
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(name, email),
          hotel:hotels(name, location)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['pending-bookings-count'] });
      toast({
        title: "Success",
        description: "Booking status updated successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive"
      });
    },
  });
};
