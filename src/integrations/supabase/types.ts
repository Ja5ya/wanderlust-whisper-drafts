export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_items: {
        Row: {
          booking_id: string
          created_at: string
          currency: string
          date: string | null
          description: string | null
          id: string
          item_name: string
          item_type: string
          quantity: number | null
          status: string | null
          supplier_reference: string | null
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          currency?: string
          date?: string | null
          description?: string | null
          id?: string
          item_name: string
          item_type: string
          quantity?: number | null
          status?: string | null
          supplier_reference?: string | null
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          currency?: string
          date?: string | null
          description?: string | null
          id?: string
          item_name?: string
          item_type?: string
          quantity?: number | null
          status?: string | null
          supplier_reference?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_reference: string
          cancellation_policy: string | null
          confirmation_number: string | null
          created_at: string
          customer_id: string | null
          destination: string
          end_date: string
          hotel_id: string | null
          id: string
          notes: string | null
          number_of_guests: number | null
          number_of_rooms: number | null
          payment_status: string | null
          regime: string | null
          room_type_id: string | null
          special_requests: string | null
          start_date: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_reference: string
          cancellation_policy?: string | null
          confirmation_number?: string | null
          created_at?: string
          customer_id?: string | null
          destination: string
          end_date: string
          hotel_id?: string | null
          id?: string
          notes?: string | null
          number_of_guests?: number | null
          number_of_rooms?: number | null
          payment_status?: string | null
          regime?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          start_date: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_reference?: string
          cancellation_policy?: string | null
          confirmation_number?: string | null
          created_at?: string
          customer_id?: string | null
          destination?: string
          end_date?: string
          hotel_id?: string | null
          id?: string
          notes?: string | null
          number_of_guests?: number | null
          number_of_rooms?: number | null
          payment_status?: string | null
          regime?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          start_date?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_summaries: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          interaction_count: number
          last_interaction: string | null
          summary_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          interaction_count?: number
          last_interaction?: string | null
          summary_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          interaction_count?: number
          last_interaction?: string | null
          summary_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          destination: string | null
          email: string
          end_date: string | null
          guide_id: string | null
          id: string
          last_contact: string | null
          name: string
          nationality: string | null
          notes_id: string | null
          number_of_people: number | null
          phone: string | null
          start_date: string | null
          status: string
          traveler_details: Json | null
          trip_type: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          email: string
          end_date?: string | null
          guide_id?: string | null
          id?: string
          last_contact?: string | null
          name: string
          nationality?: string | null
          notes_id?: string | null
          number_of_people?: number | null
          phone?: string | null
          start_date?: string | null
          status?: string
          traveler_details?: Json | null
          trip_type?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          email?: string
          end_date?: string | null
          guide_id?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          nationality?: string | null
          notes_id?: string | null
          number_of_people?: number | null
          phone?: string | null
          start_date?: string | null
          status?: string
          traveler_details?: Json | null
          trip_type?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_customers_guide"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customers_notes"
            columns: ["notes_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          best_season: string[] | null
          climate_info: string | null
          country: string
          created_at: string
          cultural_notes: string | null
          description: string | null
          health_requirements: string | null
          id: string
          is_active: boolean
          latitude: number | null
          local_currency: string | null
          longitude: number | null
          name: string
          popular_activities: string[] | null
          region: string | null
          time_zone: string | null
          updated_at: string
          visa_requirements: string | null
        }
        Insert: {
          best_season?: string[] | null
          climate_info?: string | null
          country: string
          created_at?: string
          cultural_notes?: string | null
          description?: string | null
          health_requirements?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          local_currency?: string | null
          longitude?: number | null
          name: string
          popular_activities?: string[] | null
          region?: string | null
          time_zone?: string | null
          updated_at?: string
          visa_requirements?: string | null
        }
        Update: {
          best_season?: string[] | null
          climate_info?: string | null
          country?: string
          created_at?: string
          cultural_notes?: string | null
          description?: string | null
          health_requirements?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          local_currency?: string | null
          longitude?: number | null
          name?: string
          popular_activities?: string[] | null
          region?: string | null
          time_zone?: string | null
          updated_at?: string
          visa_requirements?: string | null
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          content: string
          created_at: string
          customer_id: string | null
          from_email: string
          id: string
          is_draft: boolean
          is_read: boolean
          is_sent: boolean
          subject: string
          timestamp: string
          to_email: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_id?: string | null
          from_email: string
          id?: string
          is_draft?: boolean
          is_read?: boolean
          is_sent?: boolean
          subject: string
          timestamp?: string
          to_email: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_id?: string | null
          from_email?: string
          id?: string
          is_draft?: boolean
          is_read?: boolean
          is_sent?: boolean
          subject?: string
          timestamp?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          question: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      guides: {
        Row: {
          availability_calendar: Json | null
          bio: string | null
          certifications: string[] | null
          created_at: string
          currency: string | null
          email: string | null
          experience_years: number | null
          id: string
          is_active: boolean
          languages: string[] | null
          location: string | null
          name: string
          phone: string | null
          rate_per_day: number | null
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          availability_calendar?: Json | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          currency?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_active?: boolean
          languages?: string[] | null
          location?: string | null
          name: string
          phone?: string | null
          rate_per_day?: number | null
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_calendar?: Json | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          currency?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          is_active?: boolean
          languages?: string[] | null
          location?: string | null
          name?: string
          phone?: string | null
          rate_per_day?: number | null
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      hotel_rates: {
        Row: {
          available_rooms: number | null
          cancellation_policy: string | null
          created_at: string
          currency: string
          date: string
          hotel_id: string
          id: string
          is_available: boolean
          minimum_stay: number | null
          payment_method: string[] | null
          rate_per_room: number
          regime: string
          room_type_id: string
          updated_at: string
        }
        Insert: {
          available_rooms?: number | null
          cancellation_policy?: string | null
          created_at?: string
          currency?: string
          date: string
          hotel_id: string
          id?: string
          is_available?: boolean
          minimum_stay?: number | null
          payment_method?: string[] | null
          rate_per_room: number
          regime: string
          room_type_id: string
          updated_at?: string
        }
        Update: {
          available_rooms?: number | null
          cancellation_policy?: string | null
          created_at?: string
          currency?: string
          date?: string
          hotel_id?: string
          id?: string
          is_available?: boolean
          minimum_stay?: number | null
          payment_method?: string[] | null
          rate_per_room?: number
          regime?: string
          room_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rates_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_rates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          description: string | null
          email_recipient_name: string | null
          email_sender_name: string | null
          id: string
          is_active: boolean
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          star_rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email_recipient_name?: string | null
          email_sender_name?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          star_rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email_recipient_name?: string | null
          email_sender_name?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          star_rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          currency: string | null
          customer_id: string
          description: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string
          title: string
          total_days: number
          total_participants: number | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string
          title: string
          total_days?: number
          total_participants?: number | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string
          title?: string
          total_days?: number
          total_participants?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_day_content_blocks: {
        Row: {
          content_block_id: string
          created_at: string
          custom_content: string | null
          id: string
          itinerary_day_id: string
          order_index: number
        }
        Insert: {
          content_block_id: string
          created_at?: string
          custom_content?: string | null
          id?: string
          itinerary_day_id: string
          order_index?: number
        }
        Update: {
          content_block_id?: string
          created_at?: string
          custom_content?: string | null
          id?: string
          itinerary_day_id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_day_content_blocks_content_block_id_fkey"
            columns: ["content_block_id"]
            isOneToOne: false
            referencedRelation: "tour_content_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_day_content_blocks_itinerary_day_id_fkey"
            columns: ["itinerary_day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string
          date: string | null
          day_number: number
          description: string | null
          end_location: string
          estimated_cost: number | null
          id: string
          itinerary_id: string
          places_visited: string[] | null
          start_location: string
          tour_day_template_id: string | null
          travel_hours: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          day_number: number
          description?: string | null
          end_location: string
          estimated_cost?: number | null
          id?: string
          itinerary_id: string
          places_visited?: string[] | null
          start_location: string
          tour_day_template_id?: string | null
          travel_hours?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string | null
          day_number?: number
          description?: string | null
          end_location?: string
          estimated_cost?: number | null
          id?: string
          itinerary_id?: string
          places_visited?: string[] | null
          start_location?: string
          tour_day_template_id?: string | null
          travel_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_itinerary_days_template"
            columns: ["tour_day_template_id"]
            isOneToOne: false
            referencedRelation: "tour_day_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          booking_id: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          id: string
          is_private: boolean
          itinerary_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_private?: boolean
          itinerary_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_private?: boolean
          itinerary_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          max_occupancy: number
          name: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          max_occupancy?: number
          name: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          max_occupancy?: number
          name?: string
        }
        Relationships: []
      }
      tour_content_blocks: {
        Row: {
          content: string
          cost_per_person: number | null
          created_at: string
          currency: string | null
          duration_hours: number | null
          id: string
          is_active: boolean
          location: string | null
          name: string
          tags: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          cost_per_person?: number | null
          created_at?: string
          currency?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          tags?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          cost_per_person?: number | null
          created_at?: string
          currency?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          tags?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tour_day_templates: {
        Row: {
          created_at: string
          currency: string | null
          description: string
          difficulty_level: string | null
          end_point: string
          estimated_cost: number | null
          id: string
          is_active: boolean
          name: string
          places_visited: string[]
          season_availability: string[] | null
          start_point: string
          travel_hours: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description: string
          difficulty_level?: string | null
          end_point: string
          estimated_cost?: number | null
          id?: string
          is_active?: boolean
          name: string
          places_visited: string[]
          season_availability?: string[] | null
          start_point: string
          travel_hours: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string
          difficulty_level?: string | null
          end_point?: string
          estimated_cost?: number | null
          id?: string
          is_active?: boolean
          name?: string
          places_visited?: string[]
          season_availability?: string[] | null
          start_point?: string
          travel_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      tour_templates: {
        Row: {
          base_price: number | null
          created_at: string
          currency: string | null
          description: string | null
          difficulty_level: string | null
          duration_days: number
          end_point: string
          excluded_services: string[] | null
          id: string
          included_services: string[] | null
          is_active: boolean
          max_participants: number | null
          min_participants: number | null
          name: string
          season_availability: string[] | null
          start_point: string
          theme: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_days: number
          end_point: string
          excluded_services?: string[] | null
          id?: string
          included_services?: string[] | null
          is_active?: boolean
          max_participants?: number | null
          min_participants?: number | null
          name: string
          season_availability?: string[] | null
          start_point: string
          theme: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          end_point?: string
          excluded_services?: string[] | null
          id?: string
          included_services?: string[] | null
          is_active?: boolean
          max_participants?: number | null
          min_participants?: number | null
          name?: string
          season_availability?: string[] | null
          start_point?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          is_incoming: boolean
          is_read: boolean
          message_content: string
          phone_number: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_incoming?: boolean
          is_read?: boolean
          message_content: string
          phone_number: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_incoming?: boolean
          is_read?: boolean
          message_content?: string
          phone_number?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
