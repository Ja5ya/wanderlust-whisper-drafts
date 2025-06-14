
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PricingState {
  hotels: number;
  transportation: number;
  activities: number;
  guides: number;
  profitMargin: number;
  totalCost: number;
  totalProfit: number;
  totalPrice: number;
}

interface PricingCalculationHookProps {
  itineraryId?: string;
  totalDays: number;
  totalParticipants: number;
}

export const usePricingCalculation = ({ 
  itineraryId, 
  totalDays, 
  totalParticipants 
}: PricingCalculationHookProps) => {
  const [pricing, setPricing] = useState<PricingState>({
    hotels: 0,
    transportation: 0,
    activities: 0,
    guides: 0,
    profitMargin: 20,
    totalCost: 0,
    totalProfit: 0,
    totalPrice: 0
  });

  const { data: hotelRates = [] } = useQuery({
    queryKey: ['hotel-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_rates')
        .select('*')
        .eq('is_available', true)
        .order('rate_per_room', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: transportRates = [] } = useQuery({
    queryKey: ['transport-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_rates')
        .select('*')
        .eq('is_active', true)
        .order('rate_per_unit', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: activityRates = [] } = useQuery({
    queryKey: ['activity-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_rates')
        .select('*')
        .eq('is_active', true)
        .order('rate_per_person', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: guideRates = [] } = useQuery({
    queryKey: ['guide-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guide_rates')
        .select('*')
        .eq('is_active', true)
        .order('rate_per_unit', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate estimated costs from database rates
  useEffect(() => {
    if (hotelRates.length > 0 && transportRates.length > 0 && activityRates.length > 0 && guideRates.length > 0) {
      const avgHotelRate = hotelRates.reduce((sum, rate) => sum + Number(rate.rate_per_room), 0) / hotelRates.length;
      const avgTransportRate = transportRates.reduce((sum, rate) => sum + Number(rate.rate_per_unit), 0) / transportRates.length;
      const avgActivityRate = activityRates.reduce((sum, rate) => sum + Number(rate.rate_per_person), 0) / activityRates.length;
      const avgGuideRate = guideRates.reduce((sum, rate) => sum + Number(rate.rate_per_unit), 0) / guideRates.length;

      const estimatedHotels = (totalDays - 1) * avgHotelRate; // nights = days - 1
      const estimatedTransport = totalDays * avgTransportRate;
      const estimatedActivities = totalDays * avgActivityRate * totalParticipants;
      const estimatedGuides = totalDays * avgGuideRate;

      setPricing(prev => ({
        ...prev,
        hotels: Math.round(estimatedHotels),
        transportation: Math.round(estimatedTransport),
        activities: Math.round(estimatedActivities),
        guides: Math.round(estimatedGuides)
      }));
    }
  }, [hotelRates, transportRates, activityRates, guideRates, totalDays, totalParticipants]);

  // Calculate totals whenever pricing changes
  useEffect(() => {
    const subtotal = pricing.hotels + pricing.transportation + pricing.activities + pricing.guides;
    const profit = (subtotal * pricing.profitMargin) / 100;
    const total = subtotal + profit;
    
    setPricing(prev => ({
      ...prev,
      totalCost: subtotal,
      totalProfit: Math.round(profit),
      totalPrice: Math.round(total)
    }));
  }, [pricing.hotels, pricing.transportation, pricing.activities, pricing.guides, pricing.profitMargin]);

  const updatePricing = (field: keyof PricingState, value: number) => {
    setPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    pricing,
    updatePricing,
    hotelRates,
    transportRates,
    activityRates,
    guideRates
  };
};
