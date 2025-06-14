
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CreateHotelData {
  name: string;
  location: string;
  address?: string;
  city?: string;
  country?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  star_rating?: number;
  amenities?: string[];
  description?: string;
}

export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (hotelData: CreateHotelData) => {
      const { data, error } = await supabase
        .from('hotels')
        .insert([hotelData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast({
        title: "Success",
        description: "Hotel created successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hotel",
        variant: "destructive"
      });
    },
  });
};
