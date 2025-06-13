
-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Active', 'Planning', 'Traveling', 'Completed')),
  destination TEXT,
  trip_type TEXT,
  value DECIMAL(10,2),
  last_contact TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_messages table
CREATE TABLE public.email_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT false,
  is_sent BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whatsapp_messages table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_content TEXT NOT NULL,
  is_incoming BOOLEAN NOT NULL DEFAULT true,
  is_read BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_reference TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation_summaries table
CREATE TABLE public.conversation_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  interaction_count INTEGER NOT NULL DEFAULT 0,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample data for customers
INSERT INTO public.customers (name, email, status, destination, trip_type, value, last_contact) VALUES
('John Doe', 'john.doe@email.com', 'Active', 'Bali, Indonesia', 'Family Vacation', 12500.00, now() - interval '2 days'),
('Sarah Smith', 'sarah.smith@email.com', 'Planning', 'Thailand', 'Honeymoon', 8900.00, now() - interval '1 week'),
('Mike Johnson', 'mike.johnson@email.com', 'Traveling', 'Tokyo, Japan', 'Cultural Tour', 6700.00, now() - interval '3 hours'),
('Emma Wilson', 'emma.wilson@email.com', 'Completed', 'Paris, France', 'Business + Leisure', 15200.00, now() - interval '2 weeks'),
('David Chen', 'david.chen@email.com', 'Planning', 'Morocco', 'Adventure', 9400.00, now() - interval '5 days');

-- Insert sample email messages
INSERT INTO public.email_messages (customer_id, from_email, to_email, subject, content, is_read, timestamp) 
SELECT 
  c.id,
  c.email,
  'support@travelassist.com',
  CASE 
    WHEN c.name = 'John Doe' THEN 'Bali Trip Inquiry - Family of 4'
    WHEN c.name = 'Sarah Smith' THEN 'Thailand Itinerary Changes'
    WHEN c.name = 'Mike Johnson' THEN 'Tokyo Temple Recommendations'
  END,
  CASE 
    WHEN c.name = 'John Doe' THEN 'Hi, I''m planning a 7-day trip to Bali for my family of 4 in December. We''re interested in cultural experiences, some beach time, and family-friendly activities. Could you help us plan an itinerary and provide pricing?'
    WHEN c.name = 'Sarah Smith' THEN 'Hello, we need to modify our upcoming trip to Thailand. We''d like to extend our stay in Bangkok by 2 days and skip Phuket due to weather concerns. Can you help us adjust the booking?'
    WHEN c.name = 'Mike Johnson' THEN 'We''re arriving in Tokyo next week and wondering about the best temples to visit. Also, are there any special cultural events happening during our stay from March 15-22?'
  END,
  CASE 
    WHEN c.name = 'John Doe' THEN false
    WHEN c.name = 'Sarah Smith' THEN false
    WHEN c.name = 'Mike Johnson' THEN true
  END,
  CASE 
    WHEN c.name = 'John Doe' THEN now() - interval '30 minutes'
    WHEN c.name = 'Sarah Smith' THEN now() - interval '1 hour 45 minutes'
    WHEN c.name = 'Mike Johnson' THEN now() - interval '1 day 7 hours 15 minutes'
  END
FROM public.customers c
WHERE c.name IN ('John Doe', 'Sarah Smith', 'Mike Johnson');

-- Insert sample bookings
INSERT INTO public.bookings (customer_id, booking_reference, destination, start_date, end_date, total_amount, status, notes)
SELECT 
  c.id,
  CASE 
    WHEN c.name = 'John Doe' THEN 'BK-2024-001'
    WHEN c.name = 'Emma Wilson' THEN 'BK-2024-002'
    WHEN c.name = 'Mike Johnson' THEN 'BK-2024-003'
  END,
  c.destination,
  CASE 
    WHEN c.name = 'John Doe' THEN '2024-12-15'::date
    WHEN c.name = 'Emma Wilson' THEN '2024-01-10'::date
    WHEN c.name = 'Mike Johnson' THEN '2024-03-15'::date
  END,
  CASE 
    WHEN c.name = 'John Doe' THEN '2024-12-22'::date
    WHEN c.name = 'Emma Wilson' THEN '2024-01-17'::date
    WHEN c.name = 'Mike Johnson' THEN '2024-03-22'::date
  END,
  c.value,
  CASE 
    WHEN c.name = 'John Doe' THEN 'Confirmed'
    WHEN c.name = 'Emma Wilson' THEN 'Completed'
    WHEN c.name = 'Mike Johnson' THEN 'Confirmed'
  END,
  CASE 
    WHEN c.name = 'John Doe' THEN 'Family of 4, children ages 8 and 12'
    WHEN c.name = 'Emma Wilson' THEN 'Business meetings on Jan 11-12, leisure afterwards'
    WHEN c.name = 'Mike Johnson' THEN 'Interest in traditional temples and cultural experiences'
  END
FROM public.customers c
WHERE c.name IN ('John Doe', 'Emma Wilson', 'Mike Johnson');

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, usage_count) VALUES
('What documents do I need for international travel?', 'You will need a valid passport with at least 6 months validity remaining. Some destinations may require a visa - we will help you check visa requirements based on your destination and nationality.', 'Documentation', 15),
('How far in advance should I book my trip?', 'We recommend booking international trips 2-3 months in advance for the best rates and availability. However, we can arrange last-minute trips with 2-3 weeks notice depending on the destination.', 'Booking', 23),
('What is included in your travel packages?', 'Our packages typically include accommodation, airport transfers, guided tours, and 24/7 local support. Flights can be included or arranged separately. We customize each package based on your preferences.', 'Packages', 31),
('Do you provide travel insurance?', 'Yes, we strongly recommend travel insurance and can help you select the right coverage for your trip. We work with several insurance providers to offer comprehensive protection.', 'Insurance', 12),
('What happens if my flight is cancelled?', 'We provide 24/7 support and will help you with rebooking, accommodation if needed, and coordinate with airlines. If you have travel insurance, we will also assist with claims.', 'Support', 8);

-- Enable Row Level Security on all tables (optional for now, can be enabled later when authentication is added)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented yet)
CREATE POLICY "Allow all operations on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on email_messages" ON public.email_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on conversation_summaries" ON public.conversation_summaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
