
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PricingItem {
  id: string;
  name: string;
  dates: string;
  nights?: number;
  price: number;
  currency: string;
}

export const usePricingItems = () => {
  const { toast } = useToast();
  
  const [hotels, setHotels] = useState<PricingItem[]>([
    { id: '1', name: 'Four Seasons Resort Bali', dates: 'Jan 15 - Jan 18', nights: 3, price: 450, currency: 'USD' },
    { id: '2', name: 'The Ritz-Carlton Ubud', dates: 'Jan 18 - Jan 20', nights: 2, price: 380, currency: 'USD' }
  ]);

  const [activities, setActivities] = useState<PricingItem[]>([
    { id: '1', name: 'Ubud Rice Terraces Tour', dates: 'Jan 16', price: 85, currency: 'USD' },
    { id: '2', name: 'Temple Hopping Experience', dates: 'Jan 17', price: 95, currency: 'USD' },
    { id: '3', name: 'Cooking Class & Market Visit', dates: 'Jan 19', price: 120, currency: 'USD' }
  ]);

  const [transportation, setTransportation] = useState<PricingItem[]>([
    { id: '1', name: 'Airport Transfer (Arrival)', dates: 'Jan 15', price: 35, currency: 'USD' },
    { id: '2', name: 'Private Driver (3 days)', dates: 'Jan 16 - Jan 18', price: 150, currency: 'USD' },
    { id: '3', name: 'Airport Transfer (Departure)', dates: 'Jan 20', price: 35, currency: 'USD' }
  ]);

  const [guides, setGuides] = useState<PricingItem[]>([
    { id: '1', name: 'Licensed Cultural Guide - Made', dates: 'Jan 16 - Jan 17', price: 80, currency: 'USD' },
    { id: '2', name: 'Adventure Guide - Kadek', dates: 'Jan 18 - Jan 19', price: 75, currency: 'USD' }
  ]);

  const updateItemPrice = (category: string, id: string, newPrice: number) => {
    const updateList = (items: PricingItem[]) =>
      items.map(item => item.id === id ? { ...item, price: newPrice } : item);

    switch (category) {
      case 'hotels':
        setHotels(updateList(hotels));
        break;
      case 'activities':
        setActivities(updateList(activities));
        break;
      case 'transportation':
        setTransportation(updateList(transportation));
        break;
      case 'guides':
        setGuides(updateList(guides));
        break;
    }
  };

  const updateItemNights = (id: string, newNights: number) => {
    setHotels(hotels.map(item => 
      item.id === id ? { ...item, nights: newNights } : item
    ));
  };

  const addItem = (category: string, item: Omit<PricingItem, 'id' | 'currency'>) => {
    const newItem: PricingItem = {
      ...item,
      id: Date.now().toString(),
      currency: 'USD'
    };

    switch (category) {
      case 'hotels':
        setHotels([...hotels, newItem]);
        break;
      case 'activities':
        setActivities([...activities, newItem]);
        break;
      case 'transportation':
        setTransportation([...transportation, newItem]);
        break;
      case 'guides':
        setGuides([...guides, newItem]);
        break;
    }

    toast({ title: "Success", description: `${category.slice(0, -1)} added successfully!` });
  };

  const removeItem = (category: string, id: string) => {
    switch (category) {
      case 'hotels':
        setHotels(hotels.filter(item => item.id !== id));
        break;
      case 'activities':
        setActivities(activities.filter(item => item.id !== id));
        break;
      case 'transportation':
        setTransportation(transportation.filter(item => item.id !== id));
        break;
      case 'guides':
        setGuides(guides.filter(item => item.id !== id));
        break;
    }
  };

  return {
    hotels,
    activities,
    transportation,
    guides,
    updateItemPrice,
    updateItemNights,
    addItem,
    removeItem
  };
};
