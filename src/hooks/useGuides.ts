
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export interface Guide extends Tables<'guides'> {}
export interface GuideRate extends Tables<'guide_rates'> {}

export const useGuides = () => {
  return useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Guide[];
    },
  });
};

export const useGuideRates = (guideId: string) => {
  return useQuery({
    queryKey: ['guide-rates', guideId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guide_rates')
        .select('*')
        .eq('guide_id', guideId)
        .eq('is_active', true)
        .order('service_type', { ascending: true });
      
      if (error) throw error;
      return data as GuideRate[];
    },
    enabled: !!guideId,
  });
};

export const useCreateGuide = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newGuide: TablesInsert<'guides'>) => {
      const { data, error } = await supabase
        .from('guides')
        .insert([newGuide])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guides'] });
    },
  });
};
