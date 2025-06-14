
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CreateBookingData {
  customer_id: string;
  hotel_id?: string;
  booking_reference: string;
  destination: string;
  start_date: string;
  end_date: string;
  number_of_guests: number;
  number_of_rooms?: number;
  total_amount: number;
  status?: string;
  regime?: string;
  special_requests?: string;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
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
        description: "Booking created successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    },
  });
};
