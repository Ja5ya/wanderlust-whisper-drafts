
-- Phase 1: Itinerary System (V3 Preparation)

-- Client-Specific Itineraries
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_days INTEGER NOT NULL DEFAULT 1,
  start_date DATE,
  end_date DATE,
  total_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'Draft',
  budget NUMERIC,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual days within an itinerary
CREATE TABLE public.itinerary_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  date DATE,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  travel_hours NUMERIC,
  places_visited TEXT[],
  description TEXT,
  estimated_cost NUMERIC,
  tour_day_template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(itinerary_id, day_number)
);

-- Itinerary Knowledge Base

-- Pre-defined tour day templates (for AI itinerary creation)
CREATE TABLE public.tour_day_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_point TEXT NOT NULL,
  end_point TEXT NOT NULL,
  travel_hours NUMERIC NOT NULL,
  places_visited TEXT[] NOT NULL,
  description TEXT NOT NULL,
  difficulty_level TEXT,
  season_availability TEXT[],
  estimated_cost NUMERIC,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reusable content blocks (composing text blocks for itineraries)
CREATE TABLE public.tour_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'city_visit', 'airport_pickup', 'meal', 'activity', 'transport'
  content TEXT NOT NULL,
  duration_hours NUMERIC,
  location TEXT,
  cost_per_person NUMERIC,
  currency TEXT DEFAULT 'USD',
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Complete tour templates (theme, number of days, starting and end point)
CREATE TABLE public.tour_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  start_point TEXT NOT NULL,
  end_point TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT,
  min_participants INTEGER DEFAULT 1,
  max_participants INTEGER,
  base_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  season_availability TEXT[],
  included_services TEXT[],
  excluded_services TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 2: Hotel Booking System (V4 Preparation)

-- Hotel master data (name, location, email contact info)
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  email_sender_name TEXT, -- Name that appears in hotel emails
  email_recipient_name TEXT, -- Name to address emails to
  star_rating INTEGER,
  amenities TEXT[],
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Room type definitions
CREATE TABLE public.room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hotel rates and availability (regime, cancellation, payment, price per room type and date)
CREATE TABLE public.hotel_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  room_type_id UUID REFERENCES public.room_types(id) NOT NULL,
  date DATE NOT NULL,
  regime TEXT NOT NULL, -- 'bed_only', 'bed_breakfast', 'half_board', 'full_board', 'all_inclusive'
  rate_per_room NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  cancellation_policy TEXT,
  payment_method TEXT[],
  available_rooms INTEGER,
  minimum_stay INTEGER DEFAULT 1,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_id, room_type_id, date, regime)
);

-- Phase 3: Support Tables

-- Guide profiles
CREATE TABLE public.guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  languages TEXT[],
  specialties TEXT[],
  location TEXT,
  experience_years INTEGER,
  rate_per_day NUMERIC,
  currency TEXT DEFAULT 'USD',
  availability_calendar JSONB,
  bio TEXT,
  certifications TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notes system
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES public.itineraries(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  is_private BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Destination master data
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  description TEXT,
  best_season TEXT[],
  climate_info TEXT,
  local_currency TEXT,
  time_zone TEXT,
  visa_requirements TEXT,
  health_requirements TEXT,
  cultural_notes TEXT,
  popular_activities TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 4: Booking Enhancement

-- Add hotel-specific columns to existing bookings table
ALTER TABLE public.bookings 
ADD COLUMN hotel_id UUID REFERENCES public.hotels(id),
ADD COLUMN room_type_id UUID REFERENCES public.room_types(id),
ADD COLUMN regime TEXT,
ADD COLUMN number_of_rooms INTEGER DEFAULT 1,
ADD COLUMN number_of_guests INTEGER DEFAULT 1,
ADD COLUMN special_requests TEXT,
ADD COLUMN cancellation_policy TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'Pending',
ADD COLUMN confirmation_number TEXT;

-- Booking items for detailed breakdown
CREATE TABLE public.booking_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL, -- 'hotel', 'flight', 'activity', 'transport', 'guide'
  item_name TEXT NOT NULL,
  description TEXT,
  date DATE,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  supplier_reference TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Junction table for itinerary content blocks (linking days to multiple content blocks)
CREATE TABLE public.itinerary_day_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_day_id UUID REFERENCES public.itinerary_days(id) ON DELETE CASCADE NOT NULL,
  content_block_id UUID REFERENCES public.tour_content_blocks(id) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  custom_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Link itinerary days to tour day templates
ALTER TABLE public.itinerary_days 
ADD CONSTRAINT fk_itinerary_days_template 
FOREIGN KEY (tour_day_template_id) REFERENCES public.tour_day_templates(id);

-- Update foreign key relationships for existing tables
UPDATE public.customers SET guide_id = NULL WHERE guide_id IS NOT NULL;
ALTER TABLE public.customers 
ADD CONSTRAINT fk_customers_guide 
FOREIGN KEY (guide_id) REFERENCES public.guides(id);

UPDATE public.customers SET notes_id = NULL WHERE notes_id IS NOT NULL;
ALTER TABLE public.customers 
ADD CONSTRAINT fk_customers_notes 
FOREIGN KEY (notes_id) REFERENCES public.notes(id);

-- Add indexes for performance
CREATE INDEX idx_itineraries_customer_id ON public.itineraries(customer_id);
CREATE INDEX idx_itinerary_days_itinerary_id ON public.itinerary_days(itinerary_id);
CREATE INDEX idx_hotel_rates_hotel_date ON public.hotel_rates(hotel_id, date);
CREATE INDEX idx_hotel_rates_date_available ON public.hotel_rates(date, is_available);
CREATE INDEX idx_bookings_customer_dates ON public.bookings(customer_id, start_date, end_date);
CREATE INDEX idx_notes_customer_id ON public.notes(customer_id);
CREATE INDEX idx_booking_items_booking_id ON public.booking_items(booking_id);

-- Insert default room types
INSERT INTO public.room_types (name, description, max_occupancy, amenities) VALUES
('Single Room', 'Standard single occupancy room', 1, ARRAY['WiFi', 'TV', 'Private Bathroom']),
('Double Room', 'Standard double occupancy room', 2, ARRAY['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning']),
('Twin Room', 'Two single beds', 2, ARRAY['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning']),
('Suite', 'Luxury suite with separate living area', 4, ARRAY['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning', 'Mini Bar', 'Balcony']),
('Family Room', 'Large room suitable for families', 4, ARRAY['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning', 'Extra Bed']);
