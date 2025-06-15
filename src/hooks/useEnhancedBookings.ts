
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

export interface EnhancedBooking {
  id: string;
  customer_id: string | null;
  booking_reference: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  notes: string | null;
  hotel_id: string | null;
  room_type_id: string | null;
  regime: string | null;
  number_of_rooms: number | null;
  number_of_guests: number | null;
  special_requests: string | null;
  cancellation_policy: string | null;
  payment_status: string | null;
  confirmation_number: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
  };
  hotel?: {
    name: string;
    location: string;
  };
  room_type?: {
    name: string;
    max_occupancy: number;
  };
}

export interface BookingItem {
  id: string;
  booking_id: string;
  item_type: string;
  item_name: string;
  description: string | null;
  date: string | null;
  quantity: number | null;
  unit_price: number;
  total_price: number;
  currency: string;
  supplier_reference: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export const useEnhancedBookings = () => {
  return useQuery({
    queryKey: ['enhanced-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers!customer_id(name, email),
          hotel:hotels!hotel_id(name, location),
          room_type:room_types!room_type_id(name, max_occupancy)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EnhancedBooking[];
    },
  });
};

export const useBookingItems = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking-items', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_items')
        .select('*')
        .eq('booking_id', bookingId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as BookingItem[];
    },
    enabled: !!bookingId,
  });
};

export const useCreateBookingItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: TablesInsert<'booking_items'>) => {
      const { data, error } = await supabase
        .from('booking_items')
        .insert([newItem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['booking-items', data.booking_id] });
    },
  });
};
