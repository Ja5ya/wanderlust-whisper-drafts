
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export interface TransportRate extends Tables<'transport_rates'> {}
export interface ActivityRate extends Tables<'activity_rates'> {}

export const useTransportRates = () => {
  return useQuery({
    queryKey: ['transport-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_rates')
        .select('*')
        .eq('is_active', true)
        .order('vehicle_type', { ascending: true });
      
      if (error) throw error;
      return data as TransportRate[];
    },
  });
};

export const useActivityRates = () => {
  return useQuery({
    queryKey: ['activity-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_rates')
        .select('*')
        .eq('is_active', true)
        .order('activity_name', { ascending: true });
      
      if (error) throw error;
      return data as ActivityRate[];
    },
  });
};

export const useCreateTransportRate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newRate: TablesInsert<'transport_rates'>) => {
      const { data, error } = await supabase
        .from('transport_rates')
        .insert([newRate])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-rates'] });
    },
  });
};

export const useCreateActivityRate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newRate: TablesInsert<'activity_rates'>) => {
      const { data, error } = await supabase
        .from('activity_rates')
        .insert([newRate])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-rates'] });
    },
  });
};
