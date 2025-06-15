
-- First, let's check what the valid statuses are
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.customers'::regclass 
AND contype = 'c';

-- Add sample customers with correct status values
INSERT INTO public.customers (id, name, email, phone, status, destination, start_date, end_date, number_of_people, value) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@email.com', '+1-555-0123', 'Planning', 'Bali, Indonesia', '2024-07-15', '2024-07-22', 2, 8500.00),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0124', 'Active', 'Paris, France', '2024-08-10', '2024-08-17', 4, 12000.00),
('550e8400-e29b-41d4-a716-446655440003', 'Michael Brown', 'michael.brown@email.com', '+1-555-0125', 'Planning', 'Tokyo, Japan', '2024-09-05', '2024-09-12', 2, 9500.00);

-- Add sample hotels
INSERT INTO public.hotels (id, name, location, address, city, country, contact_email, contact_phone, star_rating) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Four Seasons Resort Bali', 'Ubud, Bali', 'Jalan Raya Sayan, Ubud', 'Ubud', 'Indonesia', 'reservations@fourseasons-bali.com', '+62-361-977577', 5),
('660e8400-e29b-41d4-a716-446655440002', 'Hotel Plaza Athénée', 'Paris', '25 Avenue Montaigne', 'Paris', 'France', 'reservations@plaza-athenee.com', '+33-1-53-67-66-65', 5),
('660e8400-e29b-41d4-a716-446655440003', 'Park Hyatt Tokyo', 'Tokyo', '3-7-1-2 Nishi Shinjuku', 'Tokyo', 'Japan', 'reservations@tokyo.park.hyatt.com', '+81-3-5322-1234', 5);

-- Add sample itineraries
INSERT INTO public.itineraries (id, customer_id, title, description, total_days, start_date, end_date, total_participants, status, budget, currency) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Bali Cultural & Beach Experience', 'A perfect blend of cultural immersion and beach relaxation in beautiful Bali', 7, '2024-07-15', '2024-07-22', 2, 'Draft', 8500.00, 'USD'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Paris Family Adventure', 'Family-friendly exploration of Paris with kids activities and cultural sites', 7, '2024-08-10', '2024-08-17', 4, 'Confirmed', 12000.00, 'USD'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Tokyo Modern & Traditional', 'Experience both modern Tokyo and traditional Japanese culture', 7, '2024-09-05', '2024-09-12', 2, 'Draft', 9500.00, 'USD');

-- Add sample bookings
INSERT INTO public.bookings (id, customer_id, hotel_id, booking_reference, destination, start_date, end_date, number_of_guests, number_of_rooms, total_amount, status) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'FS-BALI-2024-001', 'Bali, Indonesia', '2024-07-15', '2024-07-22', 2, 1, 4200.00, 'Confirmed'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'PA-PARIS-2024-002', 'Paris, France', '2024-08-10', '2024-08-17', 4, 2, 8400.00, 'Pending'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'PH-TOKYO-2024-003', 'Tokyo, Japan', '2024-09-05', '2024-09-12', 2, 1, 5600.00, 'Pending');

-- Add sample guides
INSERT INTO public.guides (id, name, email, phone, languages, specialties, location, experience_years, rate_per_day, currency, bio) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Made Suartana', 'made.suartana@baliguidesvc.com', '+62-812-3456-7890', ARRAY['English', 'Indonesian', 'Balinese'], ARRAY['Cultural Tours', 'Temple Visits', 'Rice Terrace Tours'], 'Bali, Indonesia', 8, 120.00, 'USD', 'Experienced Balinese guide specializing in cultural and spiritual tours'),
('990e8400-e29b-41d4-a716-446655440002', 'Marie Dubois', 'marie.dubois@parisguides.fr', '+33-6-12-34-56-78', ARRAY['English', 'French', 'Spanish'], ARRAY['Art History', 'Museums', 'Architecture'], 'Paris, France', 12, 180.00, 'USD', 'Art historian and certified Paris guide with expertise in museums and monuments'),
('990e8400-e29b-41d4-a716-446655440003', 'Hiroshi Tanaka', 'hiroshi.tanaka@tokyoguides.jp', '+81-90-1234-5678', ARRAY['English', 'Japanese'], ARRAY['Traditional Culture', 'Modern Tokyo', 'Food Tours'], 'Tokyo, Japan', 15, 200.00, 'USD', 'Tokyo native with deep knowledge of both traditional and modern Japanese culture');

-- Add sample itinerary days
INSERT INTO public.itinerary_days (id, itinerary_id, day_number, date, start_location, end_location, travel_hours, places_visited, description, estimated_cost) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 1, '2024-07-15', 'Denpasar Airport', 'Ubud', 1.5, ARRAY['Airport', 'Ubud'], 'Arrival and transfer to Ubud, hotel check-in', 150.00),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 2, '2024-07-16', 'Ubud', 'Ubud', 0, ARRAY['Tegallalang Rice Terraces', 'Monkey Forest', 'Ubud Market'], 'Full day Ubud cultural tour', 180.00),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 1, '2024-08-10', 'Charles de Gaulle Airport', 'Central Paris', 1.0, ARRAY['Airport', 'Hotel'], 'Arrival and hotel check-in', 120.00),
('aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 2, '2024-08-11', 'Hotel', 'Louvre District', 0, ARRAY['Louvre Museum', 'Tuileries Garden'], 'Louvre Museum and gardens visit', 200.00);

-- Add sample email messages
INSERT INTO public.email_messages (id, customer_id, from_email, to_email, subject, content, is_read, is_draft, is_sent, timestamp) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'john.smith@email.com', 'agent@travelagency.com', 'Bali Trip Inquiry', 'Hi, I am interested in a 7-day trip to Bali for my wife and me. We prefer cultural experiences and some beach time. Our budget is around $8,000-9,000.', true, false, false, '2024-06-14 10:30:00'),
('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'sarah.johnson@email.com', 'agent@travelagency.com', 'Paris Family Vacation', 'Hello, we are planning a family trip to Paris with our two children (ages 8 and 12). We need recommendations for family-friendly activities and accommodations.', true, false, false, '2024-06-13 14:15:00');

-- Add sample WhatsApp messages  
INSERT INTO public.whatsapp_messages (id, customer_id, phone_number, message_content, is_incoming, is_read, timestamp) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+1-555-0123', 'Hi, just wanted to confirm our Bali trip dates. Are we still good for July 15-22?', true, true, '2024-06-14 16:45:00'),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+1-555-0124', 'Can you send me the Paris itinerary draft? The kids are excited!', true, false, '2024-06-13 18:20:00');
