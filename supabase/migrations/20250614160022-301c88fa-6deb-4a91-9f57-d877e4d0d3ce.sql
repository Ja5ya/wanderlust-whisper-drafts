
-- Insert sample customers with detailed information
INSERT INTO customers (
  name, email, phone, destination, status, number_of_people, 
  start_date, end_date, trip_type, nationality, value
) VALUES 
(
  'Emma Thompson', 
  'emma.thompson@email.com', 
  '+44-20-7946-0958', 
  'Bali, Indonesia', 
  'Active', 
  2, 
  '2024-07-15', 
  '2024-07-25', 
  'Honeymoon', 
  'British', 
  4500
),
(
  'Carlos Rodriguez', 
  'carlos.rodriguez@email.com', 
  '+34-91-123-4567', 
  'Tokyo, Japan', 
  'Planning', 
  4, 
  '2024-08-10', 
  '2024-08-20', 
  'Family', 
  'Spanish', 
  8200
),
(
  'Sarah Chen', 
  'sarah.chen@email.com', 
  '+1-415-555-0123', 
  'Thailand', 
  'Traveling', 
  1, 
  '2024-06-12', 
  '2024-06-22', 
  'Solo Adventure', 
  'American', 
  3200
);

-- Insert hotels for the destinations
INSERT INTO hotels (
  name, location, address, city, country, star_rating, 
  contact_email, contact_phone, amenities, description
) VALUES 
(
  'The Mulia Resort & Villas', 
  'Nusa Dua, Bali', 
  'Jl. Raya Nusa Dua Selatan', 
  'Nusa Dua', 
  'Indonesia', 
  5, 
  'reservations@themulia.com', 
  '+62-361-301-7777', 
  ARRAY['Private Beach', 'Spa', 'Multiple Restaurants', 'Infinity Pool', 'Butler Service'], 
  'Luxury beachfront resort with stunning ocean views and world-class amenities'
),
(
  'The Ritz-Carlton Tokyo', 
  'Roppongi, Tokyo', 
  '9-7-1 Akasaka, Minato City', 
  'Tokyo', 
  'Japan', 
  5, 
  'reservations.tokyo@ritzcarlton.com', 
  '+81-3-3423-8000', 
  ARRAY['City Views', 'Michelin Star Restaurant', 'Spa', 'Club Lounge', 'Concierge'], 
  'Sophisticated luxury hotel in the heart of Tokyo with exceptional service'
),
(
  'Four Seasons Resort Koh Samui', 
  'Koh Samui, Thailand', 
  '219 Moo 5, Angthong', 
  'Koh Samui', 
  'Thailand', 
  5, 
  'reservations.kosamui@fourseasons.com', 
  '+66-77-243-000', 
  ARRAY['Private Beach', 'Spa', 'Pool Villas', 'Thai Restaurant', 'Water Sports'], 
  'Tropical paradise resort with private villas and pristine beaches'
);

-- Insert guides for each destination
INSERT INTO guides (
  name, location, languages, specialties, experience_years, 
  rate_per_day, email, phone, bio
) VALUES 
(
  'Wayan Sujana', 
  'Bali, Indonesia', 
  ARRAY['Indonesian', 'English', 'Dutch'], 
  ARRAY['Cultural Tours', 'Temple Visits', 'Photography', 'Local Cuisine'], 
  12, 
  95, 
  'wayan.sujana@bali-guides.com', 
  '+62-812-3456-7890', 
  'Passionate Balinese guide with deep knowledge of local culture and hidden gems'
),
(
  'Hiroshi Tanaka', 
  'Tokyo, Japan', 
  ARRAY['Japanese', 'English', 'Mandarin'], 
  ARRAY['Historical Sites', 'Modern Culture', 'Technology Tours', 'Food Tours'], 
  8, 
  150, 
  'hiroshi.tanaka@tokyo-tours.jp', 
  '+81-90-1234-5678', 
  'Tokyo native specializing in both traditional and modern aspects of Japanese culture'
),
(
  'Somchai Prasert', 
  'Thailand', 
  ARRAY['Thai', 'English', 'German'], 
  ARRAY['Island Hopping', 'Snorkeling', 'Local Markets', 'Cooking Classes'], 
  15, 
  80, 
  'somchai@thailand-adventures.com', 
  '+66-81-234-5678', 
  'Experienced guide passionate about sharing Thailand natural beauty and culinary traditions'
);

-- Insert itineraries
WITH customer_ids AS (
  SELECT id, email FROM customers WHERE email IN (
    'emma.thompson@email.com', 
    'carlos.rodriguez@email.com', 
    'sarah.chen@email.com'
  )
)
INSERT INTO itineraries (
  customer_id, title, description, total_days, start_date, end_date, 
  total_participants, budget, currency, status
)
SELECT 
  c.id,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Romantic Bali Honeymoon'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Family Adventure in Tokyo'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Solo Thailand Island Discovery'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'A romantic 10-day honeymoon experience in Bali featuring luxury resorts, cultural tours, and private dining'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'An exciting 10-day family adventure in Tokyo with cultural experiences, technology tours, and kid-friendly activities'
    WHEN c.email = 'sarah.chen@email.com' THEN 'A solo 10-day adventure exploring Thailand beautiful islands, local culture, and culinary delights'
  END,
  10,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN '2024-07-15'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN '2024-08-10'
    WHEN c.email = 'sarah.chen@email.com' THEN '2024-06-12'
  END::date,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN '2024-07-25'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN '2024-08-20'
    WHEN c.email = 'sarah.chen@email.com' THEN '2024-06-22'
  END::date,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 2
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 4
    WHEN c.email = 'sarah.chen@email.com' THEN 1
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 4500
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 8200
    WHEN c.email = 'sarah.chen@email.com' THEN 3200
  END,
  'USD',
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Confirmed'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Draft'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Confirmed'
  END
FROM customer_ids c;

-- Insert bookings
WITH customer_ids AS (
  SELECT id, email FROM customers WHERE email IN (
    'emma.thompson@email.com', 
    'carlos.rodriguez@email.com', 
    'sarah.chen@email.com'
  )
),
hotel_ids AS (
  SELECT id, name FROM hotels WHERE name IN (
    'The Mulia Resort & Villas', 
    'The Ritz-Carlton Tokyo', 
    'Four Seasons Resort Koh Samui'
  )
)
INSERT INTO bookings (
  customer_id, hotel_id, booking_reference, destination, start_date, end_date,
  number_of_guests, number_of_rooms, total_amount, status, confirmation_number, regime
)
SELECT 
  c.id,
  h.id,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'BK-MULIA-2024-001'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'BK-RITZ-2024-002'
    WHEN c.email = 'sarah.chen@email.com' THEN 'BK-FS-2024-003'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Bali, Indonesia'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Tokyo, Japan'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Koh Samui, Thailand'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN '2024-07-15'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN '2024-08-10'
    WHEN c.email = 'sarah.chen@email.com' THEN '2024-06-12'
  END::date,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN '2024-07-25'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN '2024-08-20'
    WHEN c.email = 'sarah.chen@email.com' THEN '2024-06-22'
  END::date,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 2
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 4
    WHEN c.email = 'sarah.chen@email.com' THEN 1
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 1
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 2
    WHEN c.email = 'sarah.chen@email.com' THEN 1
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 3200
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 5600
    WHEN c.email = 'sarah.chen@email.com' THEN 2100
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Confirmed'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Pending'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Confirmed'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'MUL-789456123'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN null
    WHEN c.email = 'sarah.chen@email.com' THEN 'FS-987654321'
  END,
  'Full Board'
FROM customer_ids c
JOIN hotel_ids h ON 
  (c.email = 'emma.thompson@email.com' AND h.name = 'The Mulia Resort & Villas') OR
  (c.email = 'carlos.rodriguez@email.com' AND h.name = 'The Ritz-Carlton Tokyo') OR
  (c.email = 'sarah.chen@email.com' AND h.name = 'Four Seasons Resort Koh Samui');

-- Insert email messages
WITH customer_ids AS (
  SELECT id, email FROM customers WHERE email IN (
    'emma.thompson@email.com', 
    'carlos.rodriguez@email.com', 
    'sarah.chen@email.com'
  )
)
INSERT INTO email_messages (
  customer_id, from_email, to_email, subject, content, is_read, timestamp
)
SELECT 
  c.id,
  c.email,
  'info@travelassist.com',
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Special dietary requirements for honeymoon'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Child-friendly activities in Tokyo'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Thank you for the amazing trip!'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Hi! Just wanted to let you know that my fiancé has a gluten intolerance. Could you please arrange for gluten-free meal options at the resort? Also, do you have any recommendations for romantic sunset dinners? Thank you so much!'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Hello! We are so excited about our Tokyo trip. We have two children (ages 8 and 12). Could you recommend some child-friendly activities? Also, are there any technology museums they might enjoy? Looking forward to your suggestions!'
    WHEN c.email = 'sarah.chen@email.com' THEN 'What an incredible experience! The snorkeling trip yesterday was absolutely amazing. The coral reefs were breathtaking. Could you help arrange a cooking class for tomorrow? I would love to learn some authentic Thai dishes. Thanks again!'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN false
    WHEN c.email = 'carlos.rodriguez@email.com' THEN false
    WHEN c.email = 'sarah.chen@email.com' THEN true
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN now() - interval '2 hours'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN now() - interval '1 day'
    WHEN c.email = 'sarah.chen@email.com' THEN now() - interval '6 hours'
  END
FROM customer_ids c;

-- Insert customer notes
WITH customer_ids AS (
  SELECT id, email FROM customers WHERE email IN (
    'emma.thompson@email.com', 
    'carlos.rodriguez@email.com', 
    'sarah.chen@email.com'
  )
)
INSERT INTO notes (
  customer_id, title, content, category, created_by
)
SELECT 
  c.id,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Honeymoon Special Requests'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Family Travel Preferences'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Solo Traveler Profile'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Couple celebrating honeymoon. Prefer romantic settings, sunset dinners, couples spa treatments. Bride has gluten intolerance - arrange special meals. Very interested in photography opportunities and cultural experiences. Budget conscious but willing to splurge on special experiences.'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Family of 4 with children aged 8 and 12. Father works in tech industry, very interested in technology tours and modern culture. Mother loves traditional crafts and cultural sites. Children are energetic and love interactive experiences. Need family-friendly restaurants and activities.'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Experienced solo traveler, very adventurous and independent. Loves water sports, snorkeling, and local cuisine. Vegetarian diet. Prefers authentic local experiences over touristy activities. Good swimmer, certified for scuba diving. Speaks basic Thai phrases.'
  END,
  CASE 
    WHEN c.email = 'emma.thompson@email.com' THEN 'Preferences'
    WHEN c.email = 'carlos.rodriguez@email.com' THEN 'Family'
    WHEN c.email = 'sarah.chen@email.com' THEN 'Profile'
  END,
  'Travel Agent'
FROM customer_ids c;

-- Update customers with assigned guide IDs
UPDATE customers 
SET guide_id = (
  SELECT g.id FROM guides g 
  WHERE (customers.email = 'emma.thompson@email.com' AND g.name = 'Wayan Sujana')
     OR (customers.email = 'carlos.rodriguez@email.com' AND g.name = 'Hiroshi Tanaka')
     OR (customers.email = 'sarah.chen@email.com' AND g.name = 'Somchai Prasert')
)
WHERE customers.email IN ('emma.thompson@email.com', 'carlos.rodriguez@email.com', 'sarah.chen@email.com');

-- Insert some activity rates for the destinations
INSERT INTO activity_rates (
  activity_name, activity_type, location, duration_hours, rate_per_person,
  minimum_participants, maximum_participants, supplier_name, difficulty_level
) VALUES 
-- Bali activities
('Ubud Rice Terrace & Temple Tour', 'cultural', 'Ubud, Bali', 6, 75, 2, 10, 'Bali Cultural Tours', 'easy'),
('Sunset Tanah Lot Temple', 'cultural', 'Tanah Lot, Bali', 4, 45, 1, 15, 'Bali Sunset Tours', 'easy'),
('Mount Batur Sunrise Hike', 'adventure', 'Mount Batur, Bali', 8, 85, 2, 12, 'Bali Adventure Co.', 'moderate'),

-- Tokyo activities
('Tokyo Tech & Innovation Tour', 'cultural', 'Shibuya, Tokyo', 5, 95, 1, 8, 'Tokyo Modern Tours', 'easy'),
('Traditional Tea Ceremony Experience', 'cultural', 'Asakusa, Tokyo', 2, 65, 2, 6, 'Traditional Japan Experiences', 'easy'),
('Tokyo Food Market Tour', 'cultural', 'Tsukiji, Tokyo', 4, 80, 2, 12, 'Tokyo Food Adventures', 'easy'),

-- Thailand activities
('Island Hopping Adventure', 'adventure', 'Koh Samui, Thailand', 8, 120, 1, 20, 'Thai Island Tours', 'easy'),
('Snorkeling at Coral Garden', 'adventure', 'Koh Tao, Thailand', 5, 65, 1, 15, 'Underwater Thailand', 'easy'),
('Thai Cooking Class', 'cultural', 'Koh Samui, Thailand', 4, 55, 1, 8, 'Authentic Thai Cooking', 'easy');
