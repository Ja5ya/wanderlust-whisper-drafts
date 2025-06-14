
-- Remove unnecessary tables
DROP TABLE IF EXISTS public.destinations CASCADE;
DROP TABLE IF EXISTS public.conversation_summaries CASCADE;

-- Create guide pricing table
CREATE TABLE public.guide_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL, -- 'full_day', 'half_day', 'hourly', 'multi_day'
  rate_per_unit NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  minimum_duration INTEGER DEFAULT 1, -- minimum hours/days
  valid_from DATE NOT NULL,
  valid_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transport pricing table
CREATE TABLE public.transport_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_type TEXT NOT NULL, -- 'sedan', 'suv', 'van', 'bus', 'luxury_car'
  capacity INTEGER NOT NULL,
  rate_type TEXT NOT NULL, -- 'per_hour', 'per_day', 'per_km', 'fixed_route'
  rate_per_unit NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  location TEXT,
  supplier_name TEXT,
  supplier_contact TEXT,
  minimum_charge NUMERIC,
  fuel_included BOOLEAN DEFAULT true,
  driver_included BOOLEAN DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity pricing table
CREATE TABLE public.activity_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_name TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'tour', 'adventure', 'cultural', 'entertainment', 'sport'
  location TEXT NOT NULL,
  duration_hours NUMERIC,
  rate_per_person NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  minimum_participants INTEGER DEFAULT 1,
  maximum_participants INTEGER,
  supplier_name TEXT,
  supplier_contact TEXT,
  includes TEXT[],
  excludes TEXT[],
  difficulty_level TEXT, -- 'easy', 'moderate', 'challenging'
  age_restrictions TEXT,
  seasonal_availability TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_guide_rates_guide_id ON public.guide_rates(guide_id);
CREATE INDEX idx_transport_rates_type_location ON public.transport_rates(vehicle_type, location);
CREATE INDEX idx_activity_rates_location_type ON public.activity_rates(location, activity_type);
