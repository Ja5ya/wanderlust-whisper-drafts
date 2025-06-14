
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TourTemplate {
  id: string;
  name: string;
  theme: string;
  duration_days: number;
  start_point: string;
  end_point: string;
  description: string | null;
  difficulty_level: string | null;
  min_participants: number | null;
  max_participants: number | null;
  base_price: number | null;
  currency: string | null;
  season_availability: string[] | null;
  included_services: string[] | null;
  excluded_services: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourDayTemplate {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  travel_hours: number;
  places_visited: string[];
  description: string;
  difficulty_level: string | null;
  season_availability: string[] | null;
  estimated_cost: number | null;
  currency: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourContentBlock {
  id: string;
  name: string;
  type: string;
  content: string;
  duration_hours: number | null;
  location: string | null;
  cost_per_person: number | null;
  currency: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTourTemplates = () => {
  return useQuery({
    queryKey: ['tour-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as TourTemplate[];
    },
  });
};

export const useTourDayTemplates = () => {
  return useQuery({
    queryKey: ['tour-day-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_day_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as TourDayTemplate[];
    },
  });
};

export const useTourContentBlocks = (type?: string) => {
  return useQuery({
    queryKey: ['tour-content-blocks', type],
    queryFn: async () => {
      let query = supabase
        .from('tour_content_blocks')
        .select('*')
        .eq('is_active', true);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) throw error;
      return data as TourContentBlock[];
    },
  });
};
