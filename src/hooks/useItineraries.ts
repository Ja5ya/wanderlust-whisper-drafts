
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Itinerary {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  total_days: number;
  start_date: string | null;
  end_date: string | null;
  total_participants: number | null;
  status: string;
  budget: number | null;
  currency: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
  };
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string | null;
  start_location: string;
  end_location: string;
  travel_hours: number | null;
  places_visited: string[] | null;
  description: string | null;
  estimated_cost: number | null;
  tour_day_template_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useItineraries = () => {
  return useQuery({
    queryKey: ['itineraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select(`
          *,
          customer:customers(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Itinerary[];
    },
  });
};

export const useItineraryDays = (itineraryId: string) => {
  return useQuery({
    queryKey: ['itinerary-days', itineraryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('day_number', { ascending: true });
      
      if (error) throw error;
      return data as ItineraryDay[];
    },
    enabled: !!itineraryId,
  });
};

export const useCreateItinerary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItinerary: Partial<Itinerary>) => {
      const { data, error } = await supabase
        .from('itineraries')
        .insert([newItinerary])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  });
};
