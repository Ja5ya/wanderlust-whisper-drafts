
-- Drop existing foreign key constraints if they exist, to ensure a clean slate.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS fk_bookings_customer;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS fk_bookings_hotel;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS fk_bookings_room_type;
ALTER TABLE public.booking_items DROP CONSTRAINT IF EXISTS fk_booking_items_booking;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS fk_customers_guide;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS fk_customers_notes;
ALTER TABLE public.email_messages DROP CONSTRAINT IF EXISTS fk_email_messages_customer;
ALTER TABLE public.guide_rates DROP CONSTRAINT IF EXISTS fk_guide_rates_guide;
ALTER TABLE public.hotel_rates DROP CONSTRAINT IF EXISTS fk_hotel_rates_hotel;
ALTER TABLE public.hotel_rates DROP CONSTRAINT IF EXISTS fk_hotel_rates_room_type;
ALTER TABLE public.itineraries DROP CONSTRAINT IF EXISTS fk_itineraries_customer;
ALTER TABLE public.itinerary_days DROP CONSTRAINT IF EXISTS fk_itinerary_days_itinerary;
ALTER TABLE public.itinerary_days DROP CONSTRAINT IF EXISTS fk_itinerary_days_template;
ALTER TABLE public.itinerary_day_content_blocks DROP CONSTRAINT IF EXISTS fk_itinerary_day_content_blocks_day;
ALTER TABLE public.itinerary_day_content_blocks DROP CONSTRAINT IF EXISTS fk_itinerary_day_content_blocks_content;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS fk_notes_customer;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS fk_notes_booking;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS fk_notes_itinerary;
ALTER TABLE public.whatsapp_messages DROP CONSTRAINT IF EXISTS fk_whatsapp_messages_customer;

-- Drop existing RLS policies if they exist, to avoid conflicts.
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.transport_rates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.guide_rates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.activity_rates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.itineraries;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.itinerary_days;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.tour_templates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.hotels;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.hotel_rates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.room_types;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.notes;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.booking_items;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.itinerary_day_content_blocks;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.tour_content_blocks;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.tour_day_templates;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.guides;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.bookings;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.email_messages;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.faqs;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.whatsapp_messages;


-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.transport_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_day_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_day_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Add Foreign Key Constraints to establish relationships between tables
ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_room_type FOREIGN KEY (room_type_id) REFERENCES public.room_types(id) ON DELETE SET NULL;

ALTER TABLE public.booking_items ADD CONSTRAINT fk_booking_items_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

ALTER TABLE public.customers ADD CONSTRAINT fk_customers_guide FOREIGN KEY (guide_id) REFERENCES public.guides(id) ON DELETE SET NULL;
ALTER TABLE public.customers ADD CONSTRAINT fk_customers_notes FOREIGN KEY (notes_id) REFERENCES public.notes(id) ON DELETE SET NULL;

ALTER TABLE public.email_messages ADD CONSTRAINT fk_email_messages_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE public.guide_rates ADD CONSTRAINT fk_guide_rates_guide FOREIGN KEY (guide_id) REFERENCES public.guides(id) ON DELETE CASCADE;

ALTER TABLE public.hotel_rates ADD CONSTRAINT fk_hotel_rates_hotel FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;
ALTER TABLE public.hotel_rates ADD CONSTRAINT fk_hotel_rates_room_type FOREIGN KEY (room_type_id) REFERENCES public.room_types(id) ON DELETE CASCADE;

ALTER TABLE public.itineraries ADD CONSTRAINT fk_itineraries_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

ALTER TABLE public.itinerary_days ADD CONSTRAINT fk_itinerary_days_itinerary FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;
ALTER TABLE public.itinerary_days ADD CONSTRAINT fk_itinerary_days_template FOREIGN KEY (tour_day_template_id) REFERENCES public.tour_day_templates(id) ON DELETE SET NULL;

ALTER TABLE public.itinerary_day_content_blocks ADD CONSTRAINT fk_itinerary_day_content_blocks_day FOREIGN KEY (itinerary_day_id) REFERENCES public.itinerary_days(id) ON DELETE CASCADE;
ALTER TABLE public.itinerary_day_content_blocks ADD CONSTRAINT fk_itinerary_day_content_blocks_content FOREIGN KEY (content_block_id) REFERENCES public.tour_content_blocks(id) ON DELETE CASCADE;

ALTER TABLE public.notes ADD CONSTRAINT fk_notes_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;
ALTER TABLE public.notes ADD CONSTRAINT fk_notes_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;
ALTER TABLE public.notes ADD CONSTRAINT fk_notes_itinerary FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;

ALTER TABLE public.whatsapp_messages ADD CONSTRAINT fk_whatsapp_messages_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create permissive RLS policies to allow access for all authenticated users
CREATE POLICY "Allow all access to authenticated users" ON public.transport_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.guide_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.activity_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.itineraries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.itinerary_days FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.tour_templates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.hotels FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.hotel_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.room_types FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.notes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.booking_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.itinerary_day_content_blocks FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.tour_content_blocks FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.tour_day_templates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.guides FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.customers FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.bookings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.email_messages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.faqs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON public.whatsapp_messages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

