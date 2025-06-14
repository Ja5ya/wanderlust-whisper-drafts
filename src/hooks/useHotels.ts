
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  email_sender_name: string | null;
  email_recipient_name: string | null;
  star_rating: number | null;
  amenities: string[] | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HotelRate {
  id: string;
  hotel_id: string;
  room_type_id: string;
  date: string;
  regime: string;
  rate_per_room: number;
  currency: string;
  cancellation_policy: string | null;
  payment_method: string[] | null;
  available_rooms: number | null;
  minimum_stay: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  room_type?: {
    name: string;
    description: string | null;
    max_occupancy: number;
  };
}

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Hotel[];
    },
  });
};

export const useHotelRates = (hotelId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['hotel-rates', hotelId, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('hotel_rates')
        .select(`
          *,
          room_type:room_types(name, description, max_occupancy)
        `)
        .eq('hotel_id', hotelId)
        .eq('is_available', true);

      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) throw error;
      return data as HotelRate[];
    },
    enabled: !!hotelId,
  });
};
