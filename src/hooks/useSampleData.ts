
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSampleData = () => {
  useEffect(() => {
    const initializeSampleData = async () => {
      try {
        // Check if sample data already exists
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('id')
          .limit(1);

        if (existingCustomers && existingCustomers.length > 0) {
          return; // Sample data already exists
        }

        // Create sample customers
        const { data: customers, error: customerError } = await supabase
          .from('customers')
          .insert([
            {
              name: "John Smith",
              email: "john.smith@email.com",
              phone: "+1-555-0123",
              destination: "Bali, Indonesia",
              status: "Planning",
              number_of_people: 2,
              start_date: "2024-07-15",
              end_date: "2024-07-25",
              trip_type: "Honeymoon",
              nationality: "American"
            },
            {
              name: "Sarah Johnson",
              email: "sarah.johnson@email.com",
              phone: "+1-555-0124",
              destination: "Thailand",
              status: "Active",
              number_of_people: 4,
              start_date: "2024-06-20",
              end_date: "2024-06-30",
              trip_type: "Family",
              nationality: "Canadian"
            },
            {
              name: "Mike Chen",
              email: "mike.chen@email.com",
              phone: "+1-555-0125",
              destination: "Japan",
              status: "Traveling",
              number_of_people: 1,
              start_date: "2024-06-10",
              end_date: "2024-06-20",
              trip_type: "Solo",
              nationality: "Australian"
            }
          ])
          .select();

        if (customerError) throw customerError;

        // Create sample hotels
        await supabase
          .from('hotels')
          .insert([
            {
              name: "Grand Bali Resort",
              location: "Ubud, Bali",
              star_rating: 5,
              contact_email: "reservations@grandbalresort.com",
              contact_phone: "+62-361-123456",
              amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym"]
            },
            {
              name: "Bangkok Palace Hotel",
              location: "Bangkok, Thailand",
              star_rating: 4,
              contact_email: "booking@bangkokpalace.com",
              contact_phone: "+66-2-123456",
              amenities: ["Pool", "Restaurant", "WiFi", "Business Center"]
            },
            {
              name: "Tokyo Imperial Hotel",
              location: "Tokyo, Japan",
              star_rating: 5,
              contact_email: "reservations@tokyoimperial.com",
              contact_phone: "+81-3-123456",
              amenities: ["Spa", "Restaurant", "WiFi", "Concierge", "Gym"]
            }
          ]);

        // Create sample guides
        await supabase
          .from('guides')
          .insert([
            {
              name: "Made Suwitra",
              location: "Bali, Indonesia",
              languages: ["Indonesian", "English"],
              specialties: ["Cultural Tours", "Temple Visits", "Nature"],
              experience_years: 8,
              rate_per_day: 80,
              email: "made.suwitra@email.com",
              phone: "+62-812-3456789"
            },
            {
              name: "Somchai Tanaka",
              location: "Bangkok, Thailand",
              languages: ["Thai", "English", "Japanese"],
              specialties: ["City Tours", "Food Tours", "Shopping"],
              experience_years: 12,
              rate_per_day: 90,
              email: "somchai@email.com",
              phone: "+66-81-234567"
            },
            {
              name: "Yuki Yamamoto",
              location: "Tokyo, Japan",
              languages: ["Japanese", "English"],
              specialties: ["Historical Sites", "Modern Culture", "Technology"],
              experience_years: 6,
              rate_per_day: 120,
              email: "yuki.yamamoto@email.com",
              phone: "+81-90-1234567"
            }
          ]);

        // Create sample email messages
        if (customers && customers.length > 0) {
          await supabase
            .from('email_messages')
            .insert([
              {
                customer_id: customers[0].id,
                from_email: "john.smith@email.com",
                to_email: "info@travelassist.com",
                subject: "Hotel Change Request - Bali Trip",
                content: "Hi! I wanted to ask about changing our Bali hotel to a resort closer to the beach. Is that possible?",
                is_read: false,
                timestamp: new Date().toISOString()
              },
              {
                customer_id: customers[1].id,
                from_email: "sarah.johnson@email.com",
                to_email: "info@travelassist.com",
                subject: "Final Itinerary Request - Thailand Trip",
                content: "Good morning! We're so excited about Thailand trip. Can you send us the final itinerary? Thanks!",
                is_read: false,
                timestamp: new Date(Date.now() - 3600000).toISOString()
              },
              {
                customer_id: customers[2].id,
                from_email: "mike.chen@email.com",
                to_email: "info@travelassist.com",
                subject: "Thank you - Tokyo Tour",
                content: "The Tokyo temple tour was amazing! Thank you for the recommendation. Any suggestions for our last day?",
                is_read: true,
                timestamp: new Date(Date.now() - 86400000).toISOString()
              }
            ]);
        }

        // Create sample activities
        await supabase
          .from('activity_rates')
          .insert([
            {
              activity_name: "Ubud Rice Terrace Tour",
              activity_type: "tour",
              location: "Ubud, Bali",
              duration_hours: 4,
              rate_per_person: 45,
              minimum_participants: 2,
              maximum_participants: 8,
              supplier_name: "Bali Adventures",
              difficulty_level: "easy"
            },
            {
              activity_name: "Bangkok Food Walking Tour",
              activity_type: "cultural",
              location: "Bangkok, Thailand",
              duration_hours: 3,
              rate_per_person: 35,
              minimum_participants: 1,
              maximum_participants: 12,
              supplier_name: "Thai Food Tours",
              difficulty_level: "easy"
            },
            {
              activity_name: "Mount Fuji Hiking",
              activity_type: "adventure",
              location: "Mount Fuji, Japan",
              duration_hours: 8,
              rate_per_person: 120,
              minimum_participants: 1,
              maximum_participants: 6,
              supplier_name: "Japan Adventures",
              difficulty_level: "challenging"
            }
          ]);

        console.log("Sample data initialized successfully");
      } catch (error) {
        console.error("Error initializing sample data:", error);
      }
    };

    initializeSampleData();
  }, []);
};
