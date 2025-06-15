
-- Use a DO block to manage IDs for related records
DO $$
DECLARE
    hotel1_id uuid := gen_random_uuid();
    hotel2_id uuid := gen_random_uuid();
    room_type_id uuid := gen_random_uuid();
    guide1_id uuid := gen_random_uuid();
    guide2_id uuid := gen_random_uuid();
BEGIN

-- Add a placeholder room type to associate with hotel rates
INSERT INTO public.room_types (id, name, description, max_occupancy, amenities)
VALUES (room_type_id, 'Standard Double Room', 'A comfortable room with a double bed.', 2, ARRAY['WiFi', 'TV', 'Air Conditioning']);

-- Add two placeholder hotels as examples
INSERT INTO public.hotels (id, name, location, city, country, star_rating, is_active)
VALUES
(hotel1_id, 'Sunset Paradise Hotel', 'Beachfront', 'Coastal City', 'Wonderland', 4, true),
(hotel2_id, 'Mountain Retreat Lodge', 'Mountain Valley', 'Alpine Town', 'Wonderland', 5, true);

-- Add daily rates for these hotels for the next 30 days
INSERT INTO public.hotel_rates (hotel_id, room_type_id, date, rate_per_room, currency, is_available, regime)
SELECT hotel1_id, room_type_id, d, 150, 'USD', true, 'Bed and Breakfast' FROM generate_series(CURRENT_DATE, CURRENT_DATE + interval '30 day', '1 day'::interval) d;

INSERT INTO public.hotel_rates (hotel_id, room_type_id, date, rate_per_room, currency, is_available, regime)
SELECT hotel2_id, room_type_id, d, 250, 'USD', true, 'All-Inclusive' FROM generate_series(CURRENT_DATE, CURRENT_DATE + interval '30 day', '1 day'::interval) d;

-- Add two placeholder guides
INSERT INTO public.guides (id, name, location, languages, specialties, is_active)
VALUES
(guide1_id, 'John Doe', 'Coastal City', ARRAY['English', 'Spanish'], ARRAY['History', 'Culture'], true),
(guide2_id, 'Jane Smith', 'Alpine Town', ARRAY['English', 'French'], ARRAY['Hiking', 'Nature'], true);

-- Add daily rates for the guides
INSERT INTO public.guide_rates (guide_id, service_type, rate_per_unit, currency, valid_from, is_active)
VALUES
(guide1_id, 'full_day', 200, 'USD', CURRENT_DATE, true),
(guide2_id, 'full_day', 250, 'USD', CURRENT_DATE, true);

-- Add various transportation costs as requested
INSERT INTO public.transport_rates (vehicle_type, capacity, rate_type, rate_per_unit, currency, location, is_active)
VALUES
('4x4', 4, 'per_day', 120, 'USD', 'Any', true),
('Minivan Fiat', 7, 'per_day', 150, 'USD', 'Any', true),
('Minivan Mercedes', 7, 'per_day', 200, 'USD', 'Any', true),
('Airport Transfer (Sedan)', 3, 'fixed_route', 50, 'USD', 'Coastal City', true),
('Airport Transfer (Van)', 7, 'fixed_route', 80, 'USD', 'Alpine Town', true);

END $$;
