
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AddToFAQData {
  question: string;
  answer: string;
  category?: string;
}

export const useAddToFAQ = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (faqData: AddToFAQData) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faqData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast({
        title: "Success",
        description: "FAQ added successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add FAQ",
        variant: "destructive"
      });
    },
  });
};
